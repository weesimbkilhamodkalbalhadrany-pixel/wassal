/* =========================================
   app.js - كود تطبيق وصال الكامل (نسخة Firestore النهائية)
   ========================================= */

// ==================== 1. إعدادات Firebase ====================
const firebaseConfig = {
    apiKey: "AIzaSyBvnmHgNIm4Xs-d-LBQo02BTPGxm_FZsrk",
    authDomain: "wassal-app-final.firebaseapp.com",
    projectId: "wassal-app-final",
    storageBucket: "wassal-app-final.firebasestorage.app",
    messagingSenderId: "110183430414",
    appId: "1:110183430414:web:e4b8e88e31e91a0f61ff5f"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();


// ==================== 2. البيانات الثابتة (المطاعم والمنتجات) ====================
const allRestaurantsData = [
    { id: 1, name: "رويال بروستر", cat: "بروست", img: "https://images.unsplash.com/photo-1626645738196-c2a7c8d08f58?w=400",
        items: [{ n: "ماء", p: 100, d: "ماء معدني 1 لتر", cat: "المشروبات" }, { n: "مشروب غازي ون سي", p: 250, d: "مشروب غازي ون سي 330 مل", cat: "المشروبات" }, { n: "ايسكريم", p: 600, d: "ايسكريم بنكهات متعددة", cat: "المشروبات" }, { n: "مشروب غازي", p: 250, d: "مشروب غازي 330 مل", cat: "المشروبات" }, { n: "عصير هنية", p: 200, d: "عصير هنية طبيعي", cat: "المشروبات" }, { n: "ويدجز", p: 1200, d: "ويدجز بطاطس مشوية", cat: "السلطات والمقبلات" }, { n: "سلطة بار", p: 1400, d: "سلطة بار طازجة", cat: "السلطات والمقبلات" }, { n: "حمص", p: 600, d: "حمص بالطحينة", cat: "السلطات والمقبلات" }, { n: "ارز", p: 500, d: "ارز بسمتي مبخر", cat: "السلطات والمقبلات" }, { n: "ورق عنب", p: 500, d: "ورق عنب محشي", cat: "السلطات والمقبلات" }, { n: "شيبس", p: 400, d: "شيبس بطاطس", cat: "وجبات خفيفة" }, { n: "لزانيا", p: 2500, d: "لزانيا لحم بالبشاميل", cat: "وجبات خفيفة" }, { n: "سيد", p: 2200, d: "سيد دجاج مع صلصة خاصة", cat: "وجبات خفيفة" }, { n: "نوواعم الدجاج", p: 1100, d: "نوواعم دجاج مقرمشة", cat: "وجبات الأطفال" }, { n: "بروست اطفال", p: 1000, d: "وجبة بروست للأطفال", cat: "وجبات الأطفال" }, { n: "تشكن برجر", p: 1100, d: "برجر دجاج للأطفال", cat: "وجبات الأطفال" }, { n: "فاهيتا", p: 1600, d: "فاهيتا دجاج مع الخضار", cat: "السندوتشات" }, { n: "رويال ديلوكس", p: 2500, d: "سندوتش رويال ديلوكس مميز", cat: "السندوتشات" }, { n: "شيبس طاووق", p: 1600, d: "شيبس طاووق دجاج", cat: "السندوتشات" }, { n: "راب عربي", p: 1800, d: "راب عربي دجاج", cat: "السندوتشات" }, { n: "خبز بان", p: 100, d: "خبز بان طازج", cat: "الخبز" }, { n: "خبز الثوم", p: 600, d: "خبز الثوم المحمص", cat: "الخبز" }, { n: "بيتزا ثمار البحر", p: 3400, d: "بيتزا ثمار البحر", cat: "البيتزا" }, { n: "بيتزا سوبريم", p: 3200, d: "بيتزا سوبريم بالخضار", cat: "البيتزا" }, { n: "بيتزا سبايسي لحم", p: 3000, d: "بيتزا سبايسي لحم", cat: "البيتزا" }, { n: "بيتزا بالتونة", p: 3000, d: "بيتزا تونة", cat: "البيتزا" }, { n: "جمبري", p: 2700, d: "جمبري مقرمش", cat: "أطباق موسمية" }, { n: "كلاسيك برجر", p: 2200, d: "كلاسيك برجر لحم", cat: "البرجر" }, { n: "بيف برجر", p: 1700, d: "بيف برجر لحم", cat: "البرجر" }, { n: "تشيكن برجر", p: 1700, d: "تشيكن برجر دجاج", cat: "البرجر" }, { n: "بيج تشيكن فيليه سبايسي", p: 2400, d: "تشيكن فيليه حار", cat: "البرجر" }, { n: "بروست", p: 1500, d: "وجبة بروست دجاج", cat: "الوجبات الرئيسية" }, { n: "نوواعم الدجاج", p: 2000, d: "نوواعم دجاج فاخرة", cat: "الوجبات الرئيسية" }, { n: "تشيكن ستريبس", p: 1900, d: "تشيكن ستريبس دجاج", cat: "الوجبات الرئيسية" }, { n: "تشيكن جريل", p: 1900, d: "تشيكن جريل مشوي", cat: "الوجبات الرئيسية" }]
    },
    // ... (باقي بيانات المطاعم موجودة في ملفك، يمكنك استكمالها كما هي)
];

// ==================== 3. المتغيرات والإعدادات العامة ====================
const DRIVER_PASSWORD = "weesim73741";
let MIN_DELIVERY_PRICE = 550;
let PRICE_PER_KM = 180;
const RESTAURANT_LAT = 15.285158;
const RESTAURANT_LNG = 44.2207412;

let currentUser = null;
let allOrders = [];
let allRestaurants = allRestaurantsData;
let cart = [];
let currentRestaurant = null;
let customerLocation = null;
let deliveryCost = 0;
let selectedPaymentMethod = 'cash';

// ==================== 4. الدوال المساعدة ====================
function showToast(msg) {
    let t = document.getElementById('toastMsg');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function getStatusText(st) {
    const m = { pending: 'قيد المراجعة', on_the_way: 'في الطريق', arrived: 'وصل الموقع', delivered: 'تم التوصيل' };
    return m[st] || st;
}

// ==================== 5. 🟢 دالة إنشاء الطلب الجديد (المحدثة إلى Firestore) ====================
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
        lat: customerLocation?.lat || RESTAURANT_LAT,
        lng: customerLocation?.lng || RESTAURANT_LNG,
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
        // 🟢 إرسال البيانات مباشرة إلى Firestore (db)
        const orderRef = db.collection('orders').doc();
        await orderRef.set({
            ...orderData,
            orderId: orderRef.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        localStorage.setItem('currentTrackingOrder', orderRef.id);
        showToast('✅ تم إرسال طلبك! سيظهر في لوحة التحكم قريباً.');

        // تنظيف السلة والعودة للرئيسية
        cart = [];
        customerLocation = null;
        deliveryCost = 0;
        document.getElementById('cartOrderNote').value = '';
        updateCartDisplay();
        showPage('homePage');

        // عرض التتبع
        setTimeout(() => {
            viewOrderTracking(orderRef.id);
            startAutoTracking(orderRef.id);
        }, 1500);

    } catch (error) {
        console.error("❌ فشل في حفظ الطلب:", error);
        showToast('❌ حدث خطأ أثناء إرسال الطلب');
    }
}

// ==================== 6. دوال التتبع وواجهة المندوب ====================
// (احتفظ ببقية الدوال كما هي في ملفك القديم، أو استخدم الدوال المكتملة من كودي السابق)
function startAutoTracking(orderId) { /* ... */ }
async function viewOrderTracking(id) { /* ... */ }
window.switchDriverTab = function(tab) { /* ... */ }
async function refreshDriverPanel() { /* ... */ }
// ... (باقي الدوال)

// ==================== 7. تهيئة التطبيق عند التحميل ====================
function initLogin() {
    // (كود تسجيل الدخول الخاص بك)
}

document.addEventListener('DOMContentLoaded', () => {
    // (دوال بدء التشغيل، الكاروسيل، إلخ)
    renderCategories();
    renderOffers();
    renderRestaurantsList();
});
