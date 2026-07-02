/* =========================================
   app.js - كود تطبيق وصال الكامل (نسخة Firestore النهائية)
   ========================================= */

// 1. إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBvnmHgNIm4Xs-d-LBQo02BTPGxm_FZsrk",
    authDomain: "wassal-app-final.firebaseapp.com",
    projectId: "wassal-app-final",
    storageBucket: "wassal-app-final.firebasestorage.app",
    messagingSenderId: "110183430414",
    appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. المتغيرات الأساسية
let currentUser = null;
let cart = [];
let currentRestaurant = null;
let customerLocation = null;
let deliveryCost = 0;
let selectedPaymentMethod = 'cash';

// 3. (انسخ هنا جميع بيانات المطاعم والمتغيرات الأخرى الموجودة في ملفك القديم)
// ...

// 4. 🟢 دالة إنشاء الطلب الجديد (هذا هو الجزء المهم الذي يرسل لـ Firestore)
async function confirmCheckoutOrder() {
    let addressVal = document.getElementById('checkoutAddressManual').value.trim();
    if (!customerLocation && !addressVal) return showToast('حدد عنوان التوصيل');
    if (!currentUser || currentUser.role !== 'customer') return showToast('سجل دخول كعميل');

    let totalFood = cart.reduce((s, i) => s + (i.p * i.qty), 0);
    let total = totalFood + deliveryCost;
    let generalNote = document.getElementById('cartOrderNote').value.trim();

    const orderData = {
        restaurant: currentRestaurant.name,
        customerName: currentUser.name,
        customerPhone: currentUser.phone,
        address: addressVal || 'موقع جغرافي',
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.p, note: i.note || '' })),
        totalFood: totalFood,
        deliveryCost: deliveryCost,
        total: total,
        status: 'pending',
        driverId: null,
        paymentMethod: selectedPaymentMethod,
        generalNote: generalNote
    };

    try {
        // 🔥 هذا الجزء يرسل الطلب إلى Firestore
        const orderRef = db.collection('orders').doc();
        await orderRef.set({
            ...orderData,
            orderId: orderRef.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        localStorage.setItem('currentTrackingOrder', orderRef.id);
        showToast('✅ تم إرسال طلبك! سيظهر في لوحة التحكم.');

        cart = [];
        customerLocation = null;
        deliveryCost = 0;
        updateCartDisplay();
        showPage('homePage');

    } catch (error) {
        console.error("❌ فشل في حفظ الطلب:", error);
        showToast('❌ حدث خطأ أثناء إرسال الطلب');
    }
}

// (باقي دوال التتبع، واجهة المندوب، والكاروسيل موجودة في ملفك وتعمل كما هي)
