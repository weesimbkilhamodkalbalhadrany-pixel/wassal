/* =========================================
   app.js - كود التطبيق بالكامل (FCM v1 API)
   ========================================= */

// 1. إعدادات Firebase الأساسية
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

// ⚠️ تنبيه أمني: هذا المتغير يجب أن يُستقبل من خادمك الخلفي، ولا يكتب يدوياً في الكود هنا.
// الطريقة الصحيحة: إنشاء Access Token في الخادم باستخدام firebase-admin.
let ACCESS_TOKEN = "ضع_هنا_Token_الذي_يولده_خادمك_الخلفي"; 

// =========================================
// 3. تسجيل الدخول (محاكاة لربط المستخدم الحالي)
// =========================================
async function loginUser(name, phone, role) {
    try {
        const userRef = db.collection('users').doc(phone);
        await userRef.set({ name, phone, role, isOnline: true }, { merge: true });
        currentUserId = phone;
        currentUserRole = role;
        console.log(`تم تسجيل الدخول كـ ${role}: ${name}`);
        if (role === 'driver') setupActiveOrderListener(phone);
        return true;
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        return false;
    }
}

// للاختبار (احذفها لاحقاً)
// loginUser("أحمد العميل", "0599123456", "customer");
// loginUser("محمد المندوب", "0599654321", "driver");


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
        
        // VAPID Key من صورتك
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

        statusSpan.innerText = "✅ تم حفظ التوكن بنجاح!";
        console.log("FCM Token saved:", token);

    } catch (error) {
        console.error("خطأ:", error);
        statusSpan.innerText = "❌ حدث خطأ: " + error.message;
    }
});


// =========================================
// 5. دالة إرسال الإشعار التلقائي (FCM v1 HTTP API)
// =========================================
async function sendAutomaticNotification(targetToken, title, body) {
    if (!targetToken) return false;

    // 🟢 هيكل الحمولة الجديد لـ FCM v1
    const payload = {
        "message": {
            "token": targetToken,
            "notification": {
                "title": title,
                "body": body,
                "sound": "default",
                "badge": 1,
                "icon": "/logo.png"
            },
            "data": {
                "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "screen": "order_details"
            }
        }
    };

    try {
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${firebaseConfig.projectId}/messages:send`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN, // 🟢 تغيير إلى Bearer + Token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const responseData = await response.json();
        // في v1، النجاح يُرجع حقل "name" بدلاً من "success"
        if (responseData.name) {
            console.log("✅ تم إرسال الإشعار بنجاح عبر v1:", responseData.name);
            return true;
        } else {
            console.error("فشل إرسال الإشعار:", responseData);
            return false;
        }
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
            btn.disabled = false; btn.innerText = "✅ تأكيد الطلب"; return;
        }

        const newOrderRef = db.collection('orders').doc();
        const orderData = {
            orderId: newOrderRef.id,
            customerId: currentUserId,
            customerName: "أحمد العميل", 
            status: "pending",
            driverId: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: [{ name: "وجبة برجر", price: 50, quantity: 2 }],
            deliveryAddress: "شارع الملك فهد، الرياض"
        };

        await newOrderRef.set(orderData);
        
        document.getElementById('client-status-section').style.display = 'block';
        document.getElementById('order-status-text').innerText = "طلبك معلق (Pending) في انتظار مندوب...";

        const driversSnapshot = await db.collection('users').where('role', '==', 'driver').get();
        if (!driversSnapshot.empty) {
            for (const doc of driversSnapshot.docs) {
                const data = doc.data();
                if (data.fcmToken) {
                    await sendAutomaticNotification(
                        data.fcmToken,
                        "🛵 طلب جديد!",
                        `لديك طلب جديد من ${orderData.customerName} في انتظارك.`
                    );
                }
            }
        }

        btn.disabled = false; btn.innerText = "✅ تأكيد الطلب";

    } catch (error) {
        console.error("خطأ:", error);
        alert("فشل إنشاء الطلب");
        btn.disabled = false; btn.innerText = "✅ تأكيد الطلب";
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
                    "✅ تم قبول طلبك",
                    "تم قبول طلبك، المندوب في طريقه للمحل الآن."
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
            title = "🚚 الطلب في الطريق";
            body = "مندوب التوصيل في طريقه إليك، يرجى الاستعداد.";
        } else if (newStatus === "delivered") {
            title = "🎉 تم التسليم بنجاح";
            body = "لقد تم تسليم طلبك بنجاح. شكراً لاختيارك خدمتنا.";
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
    if (success) alert("✅ تم قبول الطلب!");
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
            pendingListDiv.innerHTML = "<p style='color: #888;'>لا توجد طلبات معلقة.</p>";
            return;
        }
        snapshot.forEach((doc) => {
            const order = doc.data();
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-card';
            orderDiv.innerHTML = `
                <div><strong>طلب رقم:</strong> ${order.orderId}</div>
                <div><strong>العميل:</strong> ${order.customerName}</div>
                <div><strong>العنوان:</strong> ${order.deliveryAddress}</div>
                <div class="driver-actions">
                    <button class="btn-success" onclick="window.handleAcceptOrder('${order.orderId}', '${order.customerId}')">📥 قبول</button>
                    <button class="btn-warning" onclick="alert('تم رفض الطلب!')">❌ رفض</button>
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
            snapshot.forEach(doc => {
                const order = doc.data();
                console.log("طلب نشط:", order.orderId, "الحالة:", order.status);
                // يمكنك هنا إضافة أزرار التحكم الديناميكية في الـ HTML للمندوب
            });
        });
}


// =========================================
// 9. استقبال الإشعارات داخل التطبيق (In-App)
// =========================================
messaging.onMessage((payload) => {
    console.log("📩 إشعار أثناء الفتح:", payload);
    alert(`📢 إشعار جديد:\n${payload.notification.title}\n${payload.notification.body}`);
});


// =========================================
// 10. تشغيل المستمعين عند تحميل الصفحة
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    setupOrderListener();
    console.log("🚀 تم تشغيل النظام بـ FCM v1");
});
