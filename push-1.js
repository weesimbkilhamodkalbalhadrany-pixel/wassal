/* ===== push.js - إشعارات مطعم العم طه =====
 * - يسجّل الـ Service Worker
 * - يطلب إذن الإشعارات بزر واضح بعد تسجيل الدخول
 * - يرسل اشتراك الجهاز للسيرفر
 * - يراقب حفظ الطلبات في Firebase ويطلب من السيرفر إرسال الإشعار المناسب
 *   (طلب جديد -> المندوبين | تغيّر الحالة -> العميل)
 * لا يحتاج أي تعديل داخل كود التطبيق نفسه.
 */
(function () {
  'use strict';

  // عنوان الـ API: فارغ = نفس دومين التطبيق (انشر التطبيق والـ api في نفس مشروع Vercel)
  var API_BASE = '';

  var supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var origFetch = window.fetch.bind(window);

  // ---------- اعتراض حفظ الطلبات في Firebase ----------
  window.fetch = function (input, init) {
    var p = origFetch(input, init);
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      var m = url.match(/\/orders\/(\d+)\.json/);
      if (m && (method === 'PUT' || method === 'PATCH')) {
        var orderId = m[1];
        var type = method === 'PUT' ? 'new_order' : 'status';
        p.then(function (r) {
          if (r && r.ok) sendNotify(type, orderId);
        }).catch(function () {});
      }
    } catch (e) {}
    return p;
  };

  function sendNotify(type, orderId) {
    origFetch(API_BASE + '/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type, orderId: orderId })
    }).catch(function () {});
  }

  // ---------- مساعدات ----------
  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(base64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  var publicKeyCache = null;
  async function getPublicKey() {
    if (publicKeyCache) return publicKeyCache;
    var res = await origFetch(API_BASE + '/api/subscribe');
    var data = await res.json();
    if (!data || !data.publicKey) throw new Error('no public key');
    publicKeyCache = data.publicKey;
    return publicKeyCache;
  }

  function toast(msg) {
    if (typeof showToast === 'function') showToast(msg);
  }

  // ---------- الاشتراك ----------
  async function subscribeUser(user) {
    var reg = await navigator.serviceWorker.ready;
    var key = await getPublicKey();
    var sub = await reg.pushManager.getSubscription();

    if (!sub) {
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key)
        });
      } catch (e) {
        var old = await reg.pushManager.getSubscription();
        if (old) await old.unsubscribe();
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key)
        });
      }
    }

    var res = await origFetch(API_BASE + '/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: user.role, phone: user.phone, subscription: sub.toJSON() })
    });
    return res.ok;
  }

  // ---------- شريط تفعيل الإشعارات ----------
  function showBanner(user) {
    if (document.getElementById('pushBanner')) return;
    var bar = document.createElement('div');
    bar.id = 'pushBanner';
    bar.style.cssText =
      'position:fixed;top:10px;left:10px;right:10px;z-index:99990;background:#6f1a2d;color:#fff;' +
      'border:1px solid #dab669;border-radius:18px;padding:12px 14px;display:flex;align-items:center;' +
      'gap:10px;box-shadow:0 6px 18px rgba(0,0,0,.3);font-family:Cairo,sans-serif;direction:rtl;';
    bar.innerHTML =
      '<div style="flex:1;font-size:.8rem;font-weight:700;line-height:1.5;">' +
      (user.role === 'driver' ? '🔔 فعّل الإشعارات لتصلك الطلبات الجديدة فوراً' : '🔔 فعّل الإشعارات لتعرف حالة طلبك لحظة بلحظة') +
      '</div>' +
      '<button id="pushAllowBtn" style="background:#dab669;color:#222;border:none;border-radius:30px;padding:8px 16px;font-weight:800;font-size:.8rem;cursor:pointer;font-family:inherit;">تفعيل</button>' +
      '<button id="pushLaterBtn" style="background:transparent;color:#fff;border:none;font-size:1.1rem;cursor:pointer;">✕</button>';
    document.body.appendChild(bar);

    document.getElementById('pushLaterBtn').onclick = function () {
      bar.remove();
      try { sessionStorage.setItem('taha_push_dismissed', '1'); } catch (e) {}
    };
    document.getElementById('pushAllowBtn').onclick = async function () {
      try {
        var perm = await Notification.requestPermission();
        if (perm === 'granted') {
          await subscribeUser(user);
          toast('✅ تم تفعيل الإشعارات');
        } else {
          toast('⚠️ لم يتم السماح بالإشعارات');
        }
      } catch (e) {
        toast('❌ تعذر تفعيل الإشعارات');
      }
      bar.remove();
    };
  }

  // ---------- التشغيل بعد تسجيل الدخول ----------
  var started = false;
  async function setupForUser(user) {
    if (started || !supported) return;
    started = true;
    try {
      await navigator.serviceWorker.register('sw.js');
      if (Notification.permission === 'granted') {
        await subscribeUser(user);
      } else if (Notification.permission === 'default') {
        var dismissed = false;
        try { dismissed = sessionStorage.getItem('taha_push_dismissed') === '1'; } catch (e) {}
        if (!dismissed) showBanner(user);
      }
    } catch (e) {
      console.warn('push setup failed', e);
    }
  }

  var waiter = setInterval(function () {
    var user = null;
    try { user = typeof currentUser !== 'undefined' ? currentUser : null; } catch (e) {}
    if (user && user.phone && user.role) {
      clearInterval(waiter);
      setupForUser(user);
    }
  }, 1500);
})();
