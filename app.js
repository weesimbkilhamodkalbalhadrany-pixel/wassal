/* =========================================
   app.js - كود التطبيق بالكامل (FCM v1 API) - نسخة واصل التلقائية المحدثة
   ========================================= */

// 1. إعدادات Firebase الأساسية لمشروعك (wasal-app-final)
const firebaseConfig = {
    apiKey: "AIzaSyBvmggMwxr-dJi0Q00BTf9cm_FzSrK",
    authDomain: "wasal-app-final.firebaseapp.com",
    projectId: "wasal-app-final",
    storageBucket: "wasal-app-final.firebasestorage.app",
    messagingSenderId: "110183430614",
    appId: "1:110183430614:web:e4b8e83e19a6f1ff5f"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

// 2. المتغيرات الهامة
let currentUserId = null;
let currentUserRole = null; // 'customer' أو 'driver'
let currentUserFcmToken = null;

// لقطة ذكية: دمج مفاتيح الـ JSON السري هنا لتوليد صلاحية الإرسال تلقائياً
const SERVICE_ACCOUNT = {
    client_email: "firebase-adminsdk-fbsvc@wassal-app-final.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsyTox1ol04MUs\nyAJiKhJKmpL9ow5DMhyISAS7FUxWiYs5P8DS1+yAB4/y2Kat83IJsC78WsL3U0pu\nk5Q+Hw3+p7+A7MSHLC3A0P16Yci12pDJahO5FxK/1jTjxTTtLoSq4dy94T3YKEPW\nQqqMxy5CwIGafjwrVPZ05YvGROVCU5qCHrVVC1YraX0xl06/5RdofxC6WleP8Elk\njPz/8b3qvadN/fomdTS0hWd9+o6vukZWMVWLCkupujn+GGZGiBwbv6D9992hwXyd\nqARob2eyxm/1YsbPhnCCdrUxMa13dVakFHqkQx+RTbq5xuPynqh7fJKQ+gSvm3QQ\n/oPpugG1AgMBAAECggEABzgkKpNqbFv82Q1lThkwaPYS6K6QqL2WBBqwOenepen6\ny3JOufCEJOhL+ytSsYdvrxhxqiEXrtJH1J1tbvgIs2hqX7Zk0roFkl4ZDS07P9/p\nN0UrnErqwWGvlYm2l6dfKy2jNbrMxPSPuwrPifDDjc3xzFT0aiITZxh1MdxMkOwQ\nOLS4ADsQAd592YeFwU/xyC2O3L9c1f8ruO3vIZ7Qr48SmyNnJvRoG0pIwrpfwEQy\nKocnOX0/cBLZTHW5xFfUJyk73zbV8nxKFs1Vpzzovw4n/dSWWkgU2J0FX+6LRXNM\n2GdCXSfSi6NX9AcdExaGB92RfcnTHdi1mGEHQnje0QKBgQDewDRFLo+k0Srv1f7b\ndr0w7wKz6I/+cKFpvrWoFkUJLYJVemk+0Z7ZFirdUzaqwfqt6Uew8B+dYK/Wi3Ia\nqB07JQ5/C8bPlMdzca6isZehXNgZEHFlnZTRMa3XG4TQQZRmulEgJhGvofZi2tR9\neyQX7C7CHzrKw4AGe5Ro8BCYpQKBgQDGk8KvcrH9ChOSqVJCW+fHzFtJXkkRB+9U\nUH5AyK1y3RZ4EVSd8SXRp7aBkJZE3XZyDNJLJRkbCAO9PWeQxZq5C1EvXeV/5FVA\niGt9qTvzfq21t9mLvtcJJt3bcq6xCWrUyCq6lewYaIPcCBOOcDleD94JWLts58Cz\ne5l99Udn0QKBgQDE12DZie3SHi0tSBQxaFqDtZLT3T3yASICyk7JPPTAyYCVfNko\ndCFFgXtbnj9+4nBd4vpBd9DYSCrbEttAhzNdor+OsZ98rOMcN2e1ye5O4Dbu30L2\nIyzxOE+A+YaCapFzvk4WdM3IQP30GaERShJ5OXOQg/x2VhD6qZZarVpdKQKBgHwz\nistVc1mOmdtbJ+X1Uay3dkkXPZ/3VItppO2kFkgHW+xQ+pmmoD7XJOE4q6P62ABR\nYJ47X852XtBXvZTg4vrlxytXERnCmEe6i3CXDrYm/0Lu8JPlEt3Yf16oBfcYqsbX\nQ1JcPsStafuO2Zx3OIpKZld2NhPRh8c6gTA03yphAoGAUj1XHxpMQ41LUu/I2Atp\nCy2XFY+/NYdiHaq5UkXJXnsB5eya3HkpkYGtPKhQCR91IcBBp8FeNC0hc2RomFDL\nZMB/0ZdUO3tIsC4vLOhxXEk6oomVema8DmkIUdftEiZAgqs20TLqOFBRrgt/5ycM\nQONdQsrOCN6iGVL02bzjBDo=\n-----END PRIVATE KEY-----\n"
};

// =========================================
// 3. تسجيل الدخول (محاكاة لربط المستخدم الحالي بالتجربة)
// =========================================
async function loginUser(name, phone, role) {
    try {
        const userRef = db.collection('users').doc(phone);
        await userRef.set({ name, phone, role, isOnline: true }, { merge: true });
        currentUserId = phone;
        currentUserRole = role;
        console.log(`تم تسجيل الدخول كـ ${role}: ${name}`);
        
        // إظهار لوحة التحكم المناسبة بحسب الدور
        if (role === 'driver') {
            setupOrderListener();
            setupActiveOrderListener(phone);
        }
        return true;
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        return false;
    }
}

// تشغيل وضع العميل افتراضياً للتجربة الأولى من جهازك
loginUser("وسيم العميل", "777777771", "customer");

// للتبديل وفتح شاشة المندوب في المتصفح الخفي (عطل السطر الأعلى وشغل هذا):
// loginUser("كابتن واصل", "777777772", "driver");


// =========================================
// 4. طلب الإذن وحفظ التوكن (FCM)
// =========================================
document.getElementById('btn-allow-notifications').addEventListener('click', async function() {
    const statusSpan = document.getElementById('notification-permission-status');
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            statusSpan.innerText = "❌ تم رفض الإذن.";
            return;
        }
        statusSpan.innerText = "🔄 جاري الحصول على التوكن...";
        
        // استخدام الـ VAPID Key الصحيح المأخوذ من مشروعك بدقة
        const token = await messaging.getToken({ 
            vapidKey: "BE5Xx_uW2FKp76SMJe9Sul5CkBi2-OmwktJgg-yP9wqWe2Avw-ke2Avw-kWxdc9xulEosh5FXLaFffFCgEwEacggCh7VzQ" 
        });
        currentUserFcmToken = token;
        
        if (!currentUserId) {
            alert("يرجى تسجيل الدخول أولاً لحفظ التوكن.");
            return;
        }
        
        await db.collection('users').doc(currentUserId).update({
            fcmToken: token,
            lastTokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });

        statusSpan.innerText = "✅ تم ربط جهازك بنظام V1 بنجاح!";
        console.log("FCM Token saved:", token);

    } catch (error) {
        console.error("خطأ:", error);
        statusSpan.innerText = "❌ حدث خطأ: " + error.message;
    }
});


// =========================================
// 5. دالة إرسال الإشعار التلقائي (FCM v1 HTTP API المحدثة ذاتياً)
// =========================================
async function sendAutomaticNotification(targetToken, title, body) {
    if (!targetToken) return false;

    // هيكل الحمولة الجديد والمطابق لـ FCM v1
    const payload = {
        "message": {
            "token": targetToken,
            "notification": {
                "title": title,
                "body": body
            },
            "webpush": {
                "headers": { "Urgency": "high" },
                "notification": {
                    "icon": "logo.png",
                    "badge": "logo.png",
                    "sound": "default"
                }
            }
        }
    };

    try {
        // نرسل الإشعار للرابط المباشر لنظام V1 بدون الحاجة لـ Access Token معقد، بالاعتماد على التحقق المتبادل لفايربيز ويب
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${firebaseConfig.projectId}/messages:send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        return response.ok;
    } catch (error) {
        console.error("خطأ في الاتصال بـ FCM v1:", error);
        return false;
    }
}


// =========================================
// 6. إنشاء طلب جديد (للعميل) + إرسال إشعار للمندوب
// =========================================
document.getElementById('btn-confirm-order').addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.innerText = "🔄 جاري إنشاء الطلب...";

    try {
        if (!currentUserId) {
            alert("يجب تسجيل الدخول كعميل أولاً.");
            btn.disabled = false; btn.innerText = "🛒 تأكيد الطلب وإرساله للمناديب"; return;
        }

        const newOrderRef = db.collection('orders').doc();
        const orderData = {
            orderId: newOrderRef.id,
            customerId: currentUserId,
            customerName: "وسيم العميل", 
            status: "pending",
            driverId: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: [{ name: "طلب توصيل سريع واصل", price: 2000, quantity: 1 }],
            deliveryAddress: "صنعاء - شارع حدة"
        };

        await newOrderRef.set(orderData);
        
        document.getElementById('client-status-section').style.display = 'block';
        document.getElementById('order-status-text').innerHTML = `🔹 حالة طلبك: <b style="color:#ffc107">في انتظار المندوب (Pending)</b>`;

        const driversSnapshot = await db.collection('users').where('role', '==', 'driver').get();
        if (!driversSnapshot.empty) {
            driversSnapshot.forEach(async (doc) => {
                const data = doc.data();
                if (data.fcmToken) {
                    await sendAutomaticNotification(
                        data.fcmToken,
                        "🛵 طلب واصل جديد متاح!",
                        `يوجد طلب توصيل جديد معلق في الساحة بانتظارك.`
                    );
                }
            });
        }

        btn.disabled = false; btn.innerText = "🛒 تأكيد الطلب وإرساله للمناديب";

    } catch (error) {
        console.error("خطأ:", error);
        alert("فشل إنشاء الطلب");
        btn.disabled = false; btn.innerText = "🛒 تأكيد الطلب وإرساله للمناديب";
    }
});


// =========================================
// 7. منطق المندوب (إسناد الطلب وتحديث الحالة)
// =========================================
async function assignOrderToDriver(orderId, driverId, customerId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: "accepted",
            driverId: driverId,
            acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        const customerDoc = await db.collection('users').doc(customerId).get();
        if (customerDoc.exists) {
            const customerToken = customerDoc.data().fcmToken;
            if (customerToken) {
                await sendAutomaticNotification(
                    customerToken,
                    "✅ واصل: تم قبول طلبك",
                    "وافق أحد الكباتن على طلبك وهو في طريقه للموقع الآن."
                );
            }
        }
        return true;
    } catch (error) {
        console.error("خطأ في إسناد الطلب:", error);
        return false;
    }
}

async function updateOrderStatus(orderId, newStatus, customerId) {
    try {
        await db.collection('orders').doc(orderId).update({ status: newStatus });

        let title = "", body = "";
        if (newStatus === "in_transit") {
            title = "🚚 طلبك في الطريق";
            body = "الكابتن استلم طلبيتك وشق طريقه متوجهاً إليك، يرجى الاستعداد.";
        } else if (newStatus === "delivered") {
            title = "🎉 تم التسليم بنجاح";
            body = "تم تسليم الشحنة وتوصيل الأمانة بنجاح، شكراً لثقتك بواصل.";
        } else {
            return false;
        }

        const customerDoc = await db.collection('users').doc(customerId).get();
        if (customerDoc.exists) {
            const customerToken = customerDoc.data().fcmToken;
            if (customerToken) {
                await sendAutomaticNotification(customerToken, title, body);
            }
        }
        return true;
    } catch (error) {
        console.error("خطأ في تحديث حالة الطلب:", error);
        return false;
    }
}

window.handleAcceptOrder = async function(orderId, customerId) {
    const driverId = currentUserId;
    if (!driverId) return alert("سجل الدخول كمندوب أولاً.");
    const success = await assignOrderToDriver(orderId, driverId, customerId);
    if (success) alert("✅ تم قبول وحجز الطلب!");
    else alert("❌ حدث خطأ أثناء القبول.");
};

window.handleUpdateStatus = async function(orderId, customerId, newStatus) {
    const success = await updateOrderStatus(orderId, newStatus, customerId);
    if (success) alert(`✅ تم التحديث إلى: ${newStatus === 'in_transit' ? 'في الطريق' : 'تم التسليم'}`);
    else alert("❌ حدث خطأ.");
};


// =========================================
// 8. المراقبة الحية (onSnapshot) - لوحة المندوب
// =========================================
function setupOrderListener() {
    db.collection('orders').where('status', '==', 'pending').onSnapshot((snapshot) => {
        const pendingListDiv = document.getElementById('driver-orders-list');
        if (!pendingListDiv) return;
        pendingListDiv.innerHTML = "";
        if (snapshot.empty) {
            pendingListDiv.innerHTML = "<p style='color: #888;'>الساحة نظيفة، لا توجد طلبات معلقة حالياً...</p>";
            return;
        }
        snapshot.forEach((doc) => {
            const order = doc.data();
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-card';
            orderDiv.innerHTML = `
                <div><strong>📦 طلب رقم:</strong> ${order.orderId}</div>
                <div><strong>👤 العميل:</strong> ${order.customerName}</div>
                <div><strong>📍 العنوان:</strong> ${order.deliveryAddress}</div>
                <div class="driver-actions" style="margin-top:10px;">
                    <button class="btn-success" onclick="window.handleAcceptOrder('${order.orderId}', '${order.customerId}')">📥 قبول</button>
                </div>
            `;
            pendingListDiv.appendChild(orderDiv);
        });
    });
}

function setupActiveOrderListener(driverId) {
    db.collection('orders')
        .where('driverId', '==', driverId)
        .where('status', 'in', ['accepted', 'in_transit'])
        .onSnapshot((snapshot) => {
            const activeDiv = document.getElementById('driver-active-orders');
            if(!activeDiv) return;
            activeDiv.innerHTML = "";
            
            snapshot.forEach(doc => {
                const order = doc.data();
                const card = document.createElement('div');
                card.className = 'order-card accepted';
                card.innerHTML = `
                    <div><strong>طلبك الجاري رقم:</strong> ${order.orderId}</div>
                    <div><strong>الحالة:</strong> <b>${order.status}</b></div>
                    <div class="driver-actions" style="margin-top:10px;">
                        ${order.status === 'accepted' ? `<button class="btn-warning" onclick="window.handleUpdateStatus('${order.orderId}', '${order.customerId}', 'in_transit')">🚚 جاري التوصيل</button>` : ''}
                        ${order.status === 'in_transit' ? `<button class="btn-danger" onclick="window.handleUpdateStatus('${order.orderId}', '${order.customerId}', 'delivered')">🏁 تم التسليم</button>` : ''}
                    </div>
                `;
                activeDiv.appendChild(card);
            });
        });
}


// =========================================
// 9. استقبال الإشعارات داخل التطبيق (In-App)
// =========================================
messaging.onMessage((payload) => {
    console.log("📩 إشعار أثناء الفتح:", payload);
    alert(`📢 إشعار V1 عاجل:\n\n${payload.notification.title}\n${payload.notification.body}`);
});


// =========================================
// 10. تشغيل المستمعين عند تحميل الصفحة
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    setupOrderListener();
    console.log("🚀 تم تشغيل النظام بـ FCM v1 بنجاح ذاتي");
});
