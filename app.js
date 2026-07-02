/* =========================================
   app.js - كود تطبيق وصال الكامل (نسخة Firestore)
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
    { id: 2, name: "البيك رويال", cat: "بروست", img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
        items: [{ n: "وجبة بروست رويال", p: 2400, d: "دجاج ذهبي مقرمش" }, { n: "فيليه سمك", p: 2200, d: "شرائح فيليه سمك مقلي" }, { n: "زنجر رويال", p: 1600, d: "ساندوتش زنجر حار" }, { n: "مسحب دجاج", p: 1300, d: "دجاج مسحب مقرمش" }, { n: "بطاطس", p: 800, d: "بطاطس مقلية" }]
    },
    { id: 3, name: "شاورما هت", cat: "شاورما", img: "https://images.unsplash.com/photo-1644704170910-a0cdf183649b?w=400",
        items: [{ n: "شاورما دجاج", p: 1200, d: "شاورما دجاج متبلة" }, { n: "شاورما لحم", p: 1800, d: "شاورما لحم بلدي" }, { n: "شاورما عربي", p: 2200, d: "صحن شاورما كامل" }, { n: "بطاطس", p: 700, d: "بطاطس مقلية" }]
    },
    { id: 4, name: "ستار برجر", cat: "برجر", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        items: [{ n: "برجر لحم كلاسيك", p: 1800, d: "شريحة لحم بقري طازج" }, { n: "برجر دجاج مقرمش", p: 1700, d: "صدر دجاج مقرمش" }, { n: "مشروم برجر", p: 2200, d: "برجر لحم مع الفطر" }, { n: "باربيكيو برجر", p: 2100, d: "برجر بصوص الباربيكيو" }]
    },
    { id: 5, name: "تراك برجر", cat: "برجر", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        items: [{ n: "كلاسيك لحم", p: 1800, d: "برجر لحم كلاسيكي" }, { n: "تراك لحم دبل", p: 2600, d: "برجر دبل لحم" }, { n: "مشروم لحم", p: 2200, d: "برجر لحم مع الفطر" }, { n: "كلاسيك دجاج", p: 1500, d: "برجر دجاج كلاسيك" }]
    },
    { id: 6, name: "الشيباني جلوبال", cat: "مشاوي", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        items: [{ n: "فحسة لحم بلدي", p: 4500, d: "فحسة لحم بلدي شهية" }, { n: "مشكل مشاوي", p: 5500, d: "تشكيلة مشاوي متنوعة" }, { n: "كباب غنمي", p: 4500, d: "كباب لحم غنم طازج" }, { n: "دجاج فحم", p: 2400, d: "دجاج مشوي على الفحم" }]
    },
    { id: 7, name: "كنتاكي", cat: "بروست", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
        items: [{ n: "وجبة دجاج (3 قطع)", p: 2000, d: "3 قطع دجاج مقرمش" }, { n: "وجبة تويستر", p: 1500, d: "ساندوتش تويستر دجاج" }, { n: "سلة العائلة", p: 6500, d: "سلة عائلية دجاج مع البطاطس" }]
    },
    { id: 8, name: "مدينة العصائر", cat: "عصائر", img: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400",
        items: [{ n: "كوكتيل فواكه", p: 1200, d: "مزيج من الفواكه الطازجة" }, { n: "عصير مانجو", p: 800, d: "عصير مانجو طبيعي" }, { n: "ليمون بالنعناع", p: 700, d: "ليمون بالنعناع المنعش" }, { n: "ميلك شيك", p: 1200, d: "ميلك شيك بالشوكولاتة" }]
    },
    { id: 9, name: "البيت التركي", cat: "مشاوي", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        items: [{ n: "كباب تركي", p: 4000, d: "كباب على الطريقة التركية" }, { n: "شيش طاووق", p: 3000, d: "شيش طاووق دجاج متبل" }, { n: "ريش غنمية", p: 5500, d: "ريش غنم مشوي" }]
    },
    { id: 10, name: "هوت سبايسي", cat: "برجر", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
        items: [{ n: "ساندوتش زنجر ناري", p: 1400, d: "ساندوتش زنجر حار جداً" }, { n: "برجر لحم مشوي", p: 1600, d: "برجر لحم على الفحم" }, { n: "تورتيلا هوت سبايسي", p: 1300, d: "تورتيلا دجاج حارة" }]
    },
    { id: 11, name: "ترند كافيه", cat: "عصائر", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
        items: [{ n: "إسبريسو", p: 800, d: "قهوة إسبريسو مركزة" }, { n: "لاتيه", p: 1200, d: "لاتيه بالحليب الرغوي" }, { n: "كابتشينو", p: 1200, d: "كابتشينو إيطالي" }]
    },
    { id: 12, name: "ساك بروستر", cat: "بروست", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400",
        items: [{ n: "وجبة بروست ساك", p: 2300, d: "وجبة بروست ساك الخاصة" }, { n: "ساندوتش زنجر العملاق", p: 1500, d: "ساندوتش زنجر حجم كبير" }, { n: "رول تورتيلا", p: 1200, d: "تورتيلا دجاج" }]
    },
    { id: 13, name: "سام بروستر", cat: "بروست", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400",
        items: [{ n: "وجبة بروست سام", p: 2300, d: "وجبة بروست سام" }, { n: "وجبة بروست حراق", p: 2400, d: "بروست حار بنكهة خاصة" }, { n: "تورتيلا سام", p: 1200, d: "تورتيلا دجاج سام" }]
    },
    { id: 14, name: "شواية أرخبيل سقطرى", cat: "مشاوي", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        items: [{ n: "دجاج شواية (حبة)", p: 4000, d: "دجاجة كاملة مشوية" }, { n: "نصف دجاج مع الأرز", p: 2200, d: "نصف دجاجة مع أرز مندي" }, { n: "نفر لحم بلدي", p: 4500, d: "نفر لحم بلدي مشوي" }]
    },
    { id: 15, name: "فايف ستار برجر", cat: "برجر", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        items: [{ n: "فايف ستار برجر لحم", p: 2000, d: "برجر لحم فايف ستار" }, { n: "تشيكن برجر مقرمش", p: 1600, d: "برجر دجاج مقرمش" }, { n: "دبل برجر", p: 2800, d: "دبل برجر لحم" }]
    },
    { id: 16, name: "حواء لا تنسى", cat: "شعبي", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "مندي دجاج", p: 2200, d: "مندي دجاج بالأرز" }, { n: "نفر لحم بلدي", p: 4500, d: "نفر لحم بلدي مندي" }, { n: "معصوب ملكي", p: 2000, d: "معصوب بالعسل والموز" }]
    },
    { id: 17, name: "العم طه", cat: "وجبات سريعة", img: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400",
        items: [{ n: "سندوتش زنجر", p: 1300, d: "ساندوتش زنجر حار" }, { n: "شيش طاووق", p: 1200, d: "شيش طاووق متبل" }, { n: "تورتيلا دجاج", p: 1200, d: "تورتيلا دجاج بالخضار" }]
    },
    { id: 18, name: "القرية التهامية", cat: "تهامي", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        items: [{ n: "سمك ديرك", p: 3500, d: "سمك ديرك طازج مقلي" }, { n: "صحن جمبري", p: 4000, d: "صحن جمبري مقلي" }, { n: "عصيدة تهامية", p: 1200, d: "عصيدة تهامية بالعسل" }]
    },
    { id: 19, name: "أمين بيتزا", cat: "بيتزا", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        items: [{ n: "بيتزا أمين خاصة", p: 2500, d: "بيتزا أمين بالخضار والجبن" }, { n: "بيتزا دجاج", p: 2200, d: "بيتزا دجاج بالجبن" }, { n: "فطيرة دجاج بالجبن", p: 1200, d: "فطيرة دجاج بحشوة الجبن" }]
    },
    { id: 20, name: "نكهات كرسبي", cat: "وجبات سريعة", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400",
        items: [{ n: "وجبة كرسبي", p: 2200, d: "وجبة دجاج كرسبي" }, { n: "ساندوتش زنجر نكهات", p: 1400, d: "ساندوتش زنجر بنكهة خاصة" }, { n: "بطاطس نكهات", p: 900, d: "بطاطس بنكهة الجبن" }]
    },
    { id: 21, name: "مطعم الأندلس", cat: "مشاوي", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        items: [{ n: "نفر مشكل مشاوي", p: 4500, d: "تشكيلة مشاوي أندلسية" }, { n: "كباب لحم", p: 4000, d: "كباب لحم بلدي" }, { n: "دجاج فحم", p: 3800, d: "دجاج مشوي على الفحم" }]
    },
    { id: 22, name: "ديناميت", cat: "برجر", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
        items: [{ n: "ديناميت تشيكن", p: 2500, d: "برجر دجاج ديناميت" }, { n: "برجر ديناميت لحم", p: 2200, d: "برجر لحم ديناميت" }, { n: "بطاطس بالجبنة", p: 1200, d: "بطاطس بصلصة الجبن" }]
    },
    { id: 23, name: "تتبيلة", cat: "برجر", img: "https://images.unsplash.com/photo-1644704170910-a0cdf183649b?w=400",
        items: [{ n: "برجر تتبيلة الخاص", p: 2400, d: "برجر بصوص التتبيلة السرية" }, { n: "برجر دجاج مقرمش", p: 1800, d: "برجر دجاج مقرمش بالصوص" }, { n: "صحن شاورما عربي", p: 2500, d: "صحن شاورما عربي متكامل" }]
    },
    { id: 24, name: "كنج برجر", cat: "برجر", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        items: [{ n: "كنج برجر لحم", p: 2800, d: "برجر كنج الملكي باللحم" }, { n: "رويال تشيكن", p: 1900, d: "برجر دجاج رويال" }, { n: "فيليه سمك", p: 1600, d: "فيليه سمك مقرمش" }]
    },
    { id: 25, name: "باب المندب", cat: "بحرية", img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",
        items: [{ n: "سمك ديرك", p: 4000, d: "سمك ديرك طازج" }, { n: "صحن جمبري", p: 4500, d: "صحن جمبري مقلي" }, { n: "أرز صيادية", p: 1000, d: "أرز صيادية بنكهة البحر" }]
    },
    { id: 26, name: "البيك التهامي", cat: "بروست", img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
        items: [{ n: "وجبة بروست تهامي", p: 2200, d: "بروست بلمسة تهامية" }, { n: "زنجر تهامي", p: 1400, d: "زنجر بنكهة تهامية" }, { n: "تورتيلا البيك", p: 1200, d: "تورتيلا دجاج البيك" }]
    },
    { id: 27, name: "الضيعة", cat: "مشاوي", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        items: [{ n: "مشكل مشاوي الضيعة", p: 4800, d: "تشكيلة مشاوي الضيعة" }, { n: "كباب شامي", p: 4200, d: "كباب على الطريقة الشامية" }, { n: "مندي دجاج", p: 2500, d: "مندي دجاج بالأرز" }]
    },
    { id: 28, name: "المأكولات الشامية", cat: "شامي", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        items: [{ n: "مشوي مشكل", p: 4500, d: "مشاوي شامية متنوعة" }, { n: "كباب حلبي", p: 4000, d: "كباب حلبي شهي" }, { n: "حمص بيروتي", p: 1000, d: "حمص بيروتي بالطحينة" }]
    },
    { id: 29, name: "مطعم 99", cat: "برجر", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        items: [{ n: "برجر 99 لحم", p: 2600, d: "برجر 99 بلحم البقر" }, { n: "وجبة سوبر زنجر", p: 1800, d: "وجبة زنجر سوبر" }, { n: "تورتيلا 99", p: 1300, d: "تورتيلا دجاج 99" }]
    },
    { id: 30, name: "فريش فرايز", cat: "وجبات سريعة", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
        items: [{ n: "فريش فرايز كلاسيك", p: 1200, d: "بطاطس فريش فرايز كلاسيك" }, { n: "فرايز بالجبنة", p: 1600, d: "بطاطس بصلصة الجبن" }, { n: "زنجر ساندوتش", p: 1500, d: "ساندوتش زنجر مع البطاطس" }]
    },
    { id: 31, name: "يوتيرن", cat: "برجر", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        items: [{ n: "يوتيرن برجر", p: 2500, d: "برجر يوتيرن الخاص" }, { n: "وجبة سوبر زنجر", p: 1900, d: "وجبة زنجر يوتيرن" }, { n: "تشيكن فيليه", p: 1500, d: "تشيكن فيليه مقرمش" }]
    },
    { id: 32, name: "أرسو", cat: "برجر", img: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400",
        items: [{ n: "أرسو برجر لحم", p: 2700, d: "برجر أرسو باللحم" }, { n: "وجبة زنجر أرسو", p: 2000, d: "وجبة زنجر أرسو" }, { n: "هوت دوج أرسو", p: 1200, d: "هوت دوج أرسو" }]
    },
    { id: 33, name: "شواية مسبوك", cat: "مشاوي", img: "https://images.unsplash.com/photo-1599321955419-785373199a8d?w=400",
        items: [{ n: "حبة دجاج شواية مع الأرز", p: 4800, d: "دجاجة كاملة بالأرز" }, { n: "نصف حبة", p: 2400, d: "نصف دجاجة شواية" }, { n: "ملوخية", p: 700, d: "ملوخية خضراء طازجة" }]
    },
    { id: 34, name: "كشري ستيشن", cat: "مصري", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "كشري ستيشن صغير", p: 800, d: "كشري مصري صغير" }, { n: "وسط", p: 1200, d: "كشري مصري وسط" }, { n: "كبير", p: 1600, d: "كشري مصري كبير" }]
    },
    { id: 35, name: "شواية المكلا", cat: "مشاوي", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "دجاج شواية مع الأرز", p: 4600, d: "دجاجة كاملة بالأرز" }, { n: "نصف حبة", p: 2300, d: "نصف دجاجة شواية" }, { n: "وجبة حنيذ", p: 2500, d: "حنيذ لحم بالأرز" }]
    },
    { id: 36, name: "قمة الضيافة", cat: "مندي", img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",
        items: [{ n: "نفر لحم مندي", p: 7500, d: "نفر لحم مندي ممتاز" }, { n: "نفر لحم حنيذ", p: 7800, d: "نفر لحم حنيذ" }, { n: "حبة دجاج مندي", p: 4800, d: "دجاجة كاملة مندي" }]
    },
    { id: 37, name: "الرباش", cat: "شعبي", img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",
        items: [{ n: "زربيان لحم", p: 7500, d: "زربيان لحم بالأرز" }, { n: "نفر لحم مندي", p: 7200, d: "نفر لحم مندي" }, { n: "زربيان دجاج", p: 2800, d: "زربيان دجاج بالأرز" }]
    },
    { id: 38, name: "القرموشي", cat: "فطور", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "معصوب ملكي", p: 2000, d: "معصوب ملكي بالعسل" }, { n: "عريكة قرموشي", p: 1800, d: "عريكة قرموشي بالتمر" }, { n: "فول قلاية", p: 800, d: "فول قلاية بالطماطم" }]
    },
    { id: 39, name: "خير زمان", cat: "مندي", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "نفر لحم مندي", p: 7400, d: "نفر لحم مندي" }, { n: "برمة لحم", p: 8000, d: "برمة لحم بالأرز" }, { n: "حبة دجاج مندي", p: 4600, d: "دجاجة كاملة مندي" }]
    },
    { id: 40, name: "خير زمان 2", cat: "شعبي", img: "https://images.unsplash.com/photo-1591261735099-e3776264e164?w=400",
        items: [{ n: "نفر لحم مندي", p: 7400, d: "نفر لحم مندي" }, { n: "حبة دجاج مندي", p: 4600, d: "دجاجة كاملة مندي" }, { n: "ملوخية", p: 700, d: "ملوخية خضراء" }]
    }
];

const supermarketsData = [
    { id: 1, name: "سوبرماركت خير زمان", img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400", items: [{ n: "أرز بسمتي هندي 5كجم", p: 850, d: "أرز بسمتي فاخر 5 كجم" }, { n: "زيت نباتي صحي 1.8ل", p: 1200, d: "زيت دوار الشمس 1.8 لتر" }, { n: "سكر أبيض ناعم 2كجم", p: 450, d: "سكر أبيض 2 كجم" }, { n: "حليب طويل الأجل 1ل", p: 350, d: "حليب كامل الدسم 1 لتر" }, { n: "دقيق أبيض 2كجم", p: 380, d: "دقيق قمح أبيض 2 كجم" }, { n: "معكرونة إيطالية 500جم", p: 280, d: "معكرونة 500 جرام" }] },
    { id: 2, name: "سوبرماركت اورنج", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", items: [{ n: "أرز بسمتي 5كجم", p: 900, d: "أرز بسمتي عالي الجودة 5 كجم" }, { n: "زيت نباتي 1.8ل", p: 1100, d: "زيت نباتي صحي 1.8 لتر" }, { n: "سكر 2كجم", p: 400, d: "سكر أبيض ناعم 2 كجم" }, { n: "حليب كامل الدسم 1ل", p: 380, d: "حليب طويل الأجل 1 لتر" }, { n: "دقيق 2كجم", p: 400, d: "دقيق أبيض فاخر 2 كجم" }, { n: "معكرونة 500جم", p: 300, d: "معكرونة إيطالية 500 جرام" }] },
    { id: 3, name: "سوبرماركت النجم هايبر", img: "https://images.unsplash.com/photo-1518656306293-aa8b3892717c?w=400", items: [{ n: "أرز بسمتي 5كجم", p: 820, d: "أرز بسمتي ممتاز" }, { n: "زيت طعام 1.8ل", p: 1050, d: "زيت نباتي 1.8 لتر" }, { n: "سكر 2كجم", p: 470, d: "سكر أبيض 2 كجم" }, { n: "حليب 1ل", p: 340, d: "حليب كامل الدسم طويل الأجل" }, { n: "دقيق 2كجم", p: 390, d: "دقيق أبيض فاخر" }, { n: "معكرونة 500جم", p: 290, d: "معكرونة 500 جرام" }] },
    { id: 4, name: "سوبرماركت السعيده", img: "https://images.unsplash.com/photo-1484688497527-4a216ea49cc4?w=400", items: [{ n: "أرز بسمتي 5كجم", p: 860, d: "أرز بسمتي فاخر" }, { n: "زيت نباتي 1.8ل", p: 1150, d: "زيت دوار الشمس" }, { n: "سكر 2كجم", p: 440, d: "سكر أبيض ناعم" }, { n: "حليب طويل الأجل 1ل", p: 360, d: "حليب كامل الدسم" }, { n: "دقيق 2كجم", p: 370, d: "دقيق قمح أبيض" }, { n: "معكرونة 500جم", p: 270, d: "معكرونة 500 جرام" }] },
    { id: 5, name: "سوبرماركت جنائن الخير", img: "https://images.unsplash.com/photo-1444723121867-229f636c13db?w=400", items: [{ n: "أرز بسمتي 5كجم", p: 890, d: "أرز بسمتي عالي الجودة" }, { n: "زيت نباتي 1.8ل", p: 1180, d: "زيت نباتي صحي" }, { n: "سكر 2كجم", p: 460, d: "سكر أبيض" }, { n: "حليب 1ل", p: 370, d: "حليب كامل الدسم" }, { n: "دقيق 2كجم", p: 410, d: "دقيق أبيض ممتاز" }, { n: "معكرونة 500جم", p: 310, d: "معكرونة إيطالية" }] },
    { id: 6, name: "سوبرماركت العواضي", img: "https://images.unsplash.com/photo-1471175453399-3c7c2d4b5c41?w=400", items: [{ n: "أرز بسمتي 5كجم", p: 810, d: "أرز بسمتي فاخر 5 كجم" }, { n: "زيت نباتي 1.8ل", p: 1080, d: "زيت دوار الشمس 1.8 لتر" }, { n: "سكر 2كجم", p: 480, d: "سكر أبيض ناعم 2 كجم" }, { n: "حليب طويل الأجل 1ل", p: 330, d: "حليب كامل الدسم 1 لتر" }, { n: "دقيق 2كجم", p: 360, d: "دقيق قمح أبيض 2 كجم" }, { n: "معكرونة 500جم", p: 250, d: "معكرونة 500 جرام" }] }
];

const pharmaciesData = [
    { id: 1, name: "صيدلية عصام المركزية", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", items: [{ n: "بانادول أدفانس 24 قرص", p: 450, d: "مسكن للآلام" }, { n: "فيتامين سي فوار 20 قرص", p: 1200, d: "مكمل غذائي" }, { n: "كريم ترطيب عميق", p: 650, d: "كريم للبشرة الجافة" }, { n: "شامبو ضد القشرة", p: 950, d: "شامبو طبي" }, { n: "أوميغا 3 مكمل غذائي", p: 1800, d: "أوميغا 3 60 كبسولة" }, { n: "ماسك للوجه", p: 350, d: "قناع ترطيب" }] },
    { id: 2, name: "صيدلية ابن حيان", img: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=400", items: [{ n: "بانادول 24 قرص", p: 400, d: "مسكن للآلام" }, { n: "فيتامين سي فوار 20 قرص", p: 1300, d: "مكمل غذائي" }, { n: "كريم ترطيب", p: 600, d: "كريم مرطب" }, { n: "شامبو طبي", p: 900, d: "شامبو ضد القشرة" }, { n: "أوميغا 3", p: 1700, d: "مكمل غذائي" }, { n: "ماسك وجه", p: 380, d: "قناع وجه" }] },
    { id: 3, name: "صيدلية جمجوم", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", items: [{ n: "بانادول أدفانس", p: 470, d: "مسكن للآلام" }, { n: "فيتامين سي", p: 1250, d: "مكمل غذائي" }, { n: "كريم ترطيب عميق", p: 680, d: "كريم للبشرة" }, { n: "شامبو ضد القشرة", p: 920, d: "شامبو طبي" }, { n: "أوميغا 3", p: 1850, d: "مكمل غذائي" }, { n: "ماسك للوجه", p: 370, d: "قناع ترطيب" }] },
    { id: 4, name: "صيدلية عالم الصديقة", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", items: [{ n: "بانادول", p: 420, d: "مسكن للآلام" }, { n: "فيتامين سي", p: 1180, d: "مكمل غذائي" }, { n: "كريم ترطيب", p: 620, d: "كريم للبشرة" }, { n: "شامبو طبي", p: 980, d: "شامبو ضد القشرة" }, { n: "أوميغا 3", p: 1750, d: "مكمل غذائي" }, { n: "ماسك وجه", p: 330, d: "قناع ترطيب" }] },
    { id: 5, name: "صيدلية سندس", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", items: [{ n: "بانادول أدفانس 24", p: 440, d: "مسكن للآلام" }, { n: "فيتامين سي فوار 20", p: 1220, d: "مكمل غذائي" }, { n: "كريم ترطيب", p: 640, d: "كريم للبشرة الجافة" }, { n: "شامبو ضد القشرة", p: 960, d: "شامبو طبي" }, { n: "أوميغا 3", p: 1820, d: "مكمل غذائي" }, { n: "ماسك للوجه", p: 360, d: "قناع ترطيب" }] },
    { id: 6, name: "صيدلية العريفي", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", items: [{ n: "بانادول 24", p: 430, d: "مسكن للآلام" }, { n: "فيتامين سي 20", p: 1190, d: "مكمل غذائي" }, { n: "كريم ترطيب عميق", p: 630, d: "كريم للبشرة" }, { n: "شامبو طبي", p: 970, d: "شامبو ضد القشرة" }, { n: "أوميغا 3", p: 1800, d: "مكمل غذائي" }, { n: "ماسك وجه", p: 340, d: "قناع ترطيب" }] },
    { id: 7, name: "صيدلية الخمسين", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", items: [{ n: "بانادول أدفانس 24", p: 460, d: "مسكن للآلام" }, { n: "فيتامين سي 20", p: 1260, d: "مكمل غذائي" }, { n: "كريم ترطيب", p: 670, d: "كريم للبشرة" }, { n: "شامبو ضد القشرة", p: 990, d: "شامبو طبي" }, { n: "أوميغا 3", p: 1880, d: "مكمل غذائي" }, { n: "ماسك للوجه", p: 390, d: "قناع ترطيب" }] },
    { id: 8, name: "صيدلية سام", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", items: [{ n: "بانادول 24 قرص", p: 410, d: "مسكن للآلام" }, { n: "فيتامين سي فوار 20", p: 1150, d: "مكمل غذائي" }, { n: "كريم ترطيب عميق", p: 610, d: "كريم للبشرة" }, { n: "شامبو طبي", p: 910, d: "شامبو ضد القشرة" }, { n: "أوميغا 3", p: 1680, d: "مكمل غذائي" }, { n: "ماسك وجه", p: 320, d: "قناع ترطيب" }] }
];

const sheinData = {
    men: { name: "👔 رجالي", products: [{ id: 201, name: "قميص رسمي بأكمام طويلة", price: 8900, desc: "قميص قطني فاخر للمناسبات الرسمية", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300" }, { id: 202, name: "تي شيرت قطني رياضي", price: 3500, desc: "تي شيرت مريح للتمارين اليومية", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" }, { id: 203, name: "بنطلون جينز كلاسيك", price: 12500, desc: "جينز أزرق بقصة عصرية", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300" }, { id: 204, name: "جاكيت شتوي أنيق", price: 22000, desc: "جاكيت مبطن مقاوم للماء", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300" }, { id: 205, name: "حذاء جلدي فاخر", price: 18500, desc: "حذاء جلد طبيعي للمناسبات", img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300" }, { id: 206, name: "ساعة رجالية كرونوغراف", price: 25000, desc: "ساعة أنيقة بتصميم رياضي", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300" }] },
    women: { name: "👗 نسائي", products: [{ id: 211, name: "بلوزة حريرية أنيقة", price: 7500, desc: "بلوزة بقصة واسعة بألوان عصرية", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300" }, { id: 212, name: "تنورة ماكسي طويلة", price: 6800, desc: "تنورة منسدلة مع حزام", img: "https://images.unsplash.com/photo-1583496661160-f6b5883b5a63?w=300" }, { id: 213, name: "فستان كاجوال صيفي", price: 9500, desc: "فستان قصير بنقوش زهرية", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300" }, { id: 214, name: "حذاء رياضي نسائي", price: 12000, desc: "حذاء مريح للمشي", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300" }, { id: 215, name: "حقيبة يد جلدية", price: 8500, desc: "حقيبة أنيقة بتصميم عصري", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300" }, { id: 216, name: "نظارة شمسية عصرية", price: 4500, desc: "نظارة بتصميم مميز", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" }] },
    kids: { name: "🧸 أطفال", products: [{ id: 221, name: "تي شيرت أطفال قطني", price: 1800, desc: "تي شيرت بنقوش مبهجة", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300" }, { id: 222, name: "بنطلون جينز للأطفال", price: 4200, desc: "جينز مريح للمرح", img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300" }, { id: 223, name: "فستان صغير للأميرات", price: 5500, desc: "فستان بتول مع تزيين", img: "https://images.unsplash.com/photo-1582793988951-9aed550beb97?w=300" }, { id: 224, name: "حذاء رياضي للأطفال", price: 3800, desc: "حذاء خفيف ومريح", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" }, { id: 225, name: "طقم ملابس مريح", price: 6500, desc: "طقم يتكون من تي شيرت وبنطلون", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300" }] },
    watches: { name: "⌚ ساعات", products: [{ id: 231, name: "ساعة رياضية ذكية", price: 18000, desc: "ساعة بتقنية حديثة", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300" }, { id: 232, name: "ساعة كلاسيك جلدية", price: 15000, desc: "ساعة أنيقة بسوار جلدي", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300" }, { id: 233, name: "ساعة كرونوغراف فضية", price: 22000, desc: "ساعة بتصميم فاخر", img: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=300" }, { id: 234, name: "ساعة نسائية مرصعة", price: 19500, desc: "ساعة بتصميم أنيق مع أحجار", img: "https://images.unsplash.com/photo-1532264989767-d03796645d68?w=300" }] }
};

const sheinSliderImages = [
    { image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800", title: "👗 أزياء صيف 2025", desc: "تشكيلة جديدة من الملابس الصيفية" },
    { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", title: "🛍️ تخفيضات تصل إلى 50%", desc: "عروض حصرية على موقع شي إن" },
    { image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800", title: "⌚ ساعات فاخرة", desc: "أفضل الماركات بأسعار منافسة" },
    { image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800", title: "🧸 ملابس أطفال", desc: "أجمل التصاميم للأطفال" }
];


// ==================== 3. المتغيرات والإعدادات العامة ====================
const DRIVER_PASSWORD = "weesim73741";
const ADMIN_PASSWORD = "weesim73741";
let MIN_DELIVERY_PRICE = 550;
let PRICE_PER_KM = 180;
const RESTAURANT_LAT = 15.285158;
const RESTAURANT_LNG = 44.2207412;

let currentUser = null;
let allOrders = [];
let allRestaurants = allRestaurantsData;
let cart = [];
let currentRestaurant = null;
let currentCategory = null;
let currentItem = null;
let customerLocation = null;
let deliveryCost = 0;
let selectedPaymentMethod = 'cash';
let map, marker, currentMapMode = null;
let modalQuantity = 1;
let modalNote = "";
let currentModalItem = null;
let currentModalSourceIsRestaurant = false;
let pendingOrderId = null;
let pendingStatus = null;
let trackingInterval = null;
let lastOrderStatus = null;
let pendingModalAction = null;
let sheinCarouselIndex = 0, sheinCarouselInterval;
let currentSheinTab = 'women';
let mainCarouselIndex = 0, mainCarouselInterval;
let carouselIndex = 0, carouselInterval;
let currentFilter = "all";
let driverTab = 'available';
let driverAudioContext = null;
let lastOrderCount = 0;


// ==================== 4. الدوال المساعدة ====================
function showToast(msg) {
    let t = document.getElementById('toastMsg');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function roundToNearestHundred(num) { return Math.round(num / 100) * 100; }

function getItemImage(itemName) {
    const name = itemName.toLowerCase();
    if (name.includes('برجر')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300';
    if (name.includes('بروست')) return 'https://images.unsplash.com/photo-1626645738196-c2a7c8d08f58?w=300';
    if (name.includes('زنجر')) return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300';
    if (name.includes('شاورما')) return 'https://images.unsplash.com/photo-1644704170910-a0cdf183649b?w=300';
    if (name.includes('بيتزا')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300';
    if (name.includes('مندي')) return 'https://images.unsplash.com/photo-1591261735099-e3776264e164?w=300';
    if (name.includes('عصير')) return 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=300';
    if (name.includes('سوبرماركت')) return 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300';
    if (name.includes('صيدلية')) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300';
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
}

function getStatusText(st) {
    const m = { pending: 'قيد المراجعة', on_the_way: 'في الطريق', arrived: 'وصل الموقع', delivered: 'تم التوصيل' };
    return m[st] || st;
}

// ==================== 5. دوال قاعدة البيانات (Firestore) ====================
async function loadOrders() {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        allOrders = [];
        snapshot.forEach(doc => {
            allOrders.push({ id: doc.id, ...doc.data() });
        });
    } catch (e) {
        console.error("خطأ في جلب الطلبات:", e);
    }
}

async function updateOrder(id, updates) {
    try {
        await db.collection('orders').doc(id).update(updates);
        await loadOrders();
    } catch (e) {
        console.error("خطأ في تحديث الطلب:", e);
    }
}

async function updateUserBusy(phone, isBusy) {
    try {
        await db.collection('users').doc(phone).update({ isBusy });
    } catch (e) {
        console.error("خطأ في تحديث حالة المندوب:", e);
    }
}

// ==================== 6. واجهات المستخدم الأساسية ====================
function renderCategories() {
    document.getElementById('categoriesGrid').innerHTML = `
        <div class="category-card" onclick="openCategory('restaurants')"><div class="category-icon">🍔</div><h3>مطاعم وجبات</h3><p>أشهى الأطباق</p></div>
        <div class="category-card" onclick="openCategory('supermarket')"><div class="category-icon">🛒</div><h3>سوبرماركت</h3><p>كل احتياجاتك</p></div>
        <div class="category-card" onclick="openCategory('shein')"><div class="category-icon">👗</div><h3>شي إن</h3><p>أحدث خطوط الأزياء</p></div>
        <div class="category-card" onclick="openCategory('pharmacy')"><div class="category-icon">💊</div><h3>صيدليات</h3><p>أدوية وعناية</p></div>
    `;
}

function renderOffers() {
    document.getElementById('offersScroll').innerHTML = `
        <div class="offer-card" onclick="openCategory('restaurants')"><div class="offer-text"><h4>🔥 خصم 30%</h4><p>على أول طلب وجبات</p></div><div class="offer-badge">اطلب الآن</div></div>
        <div class="offer-card" onclick="openCategory('supermarket')"><div class="offer-text"><h4>🛒 توصيل مجاني</h4><p>لطلبات السوبرماركت</p></div><div class="offer-badge">استفد</div></div>
        <div class="offer-card" onclick="openCategory('shein')"><div class="offer-text"><h4>👗 تشكيلة جديدة</h4><p>خصومات تصل إلى 40%</p></div><div class="offer-badge">تسوق</div></div>
    `;
}

function renderRestaurantsList() {
    let filtered = allRestaurants;
    if (currentFilter !== 'all') filtered = allRestaurants.filter(r => r.cat.includes(currentFilter));
    document.getElementById('restaurantsList').innerHTML = filtered.map(r =>
        `<div class="restaurant-item" onclick="openRestaurantMenu(${r.id})"><div class="restaurant-item-img" style="background-image:url('${r.img}')"></div><div class="restaurant-item-info"><div class="restaurant-item-name">${r.name}</div><div class="restaurant-item-cat">${r.cat}</div><div class="restaurant-item-stats"><span>⭐ 4.7</span><span>📍 2.5 كيلو</span></div></div><div class="restaurant-item-price"><div class="price">${r.items[0]?.p || 2200}</div><div>ريال</div></div></div>`
    ).join('');
}

function openRestaurantMenu(id) {
    currentRestaurant = allRestaurants.find(r => r.id === id);
    if (!currentRestaurant) return;
    currentCategory = null;

    let heroItem = currentRestaurant.items[0];
    let heroImage = getItemImage(heroItem.n);

    let categories = [...new Set(currentRestaurant.items.map(i => i.cat || 'أخرى'))];
    let tabsHtml = `
        <div class="category-tabs-wrapper" id="menuCategoryTabs">
          <button class="category-tab-btn active" data-cat="all" onclick="filterMenuCategory('all')">الكل</button>
          ${categories.map(c => `<button class="category-tab-btn" data-cat="${c}" onclick="filterMenuCategory('${c}')">${c}</button>`).join('')}
        </div>
    `;

    let itemsHtml = `
        <div class="restaurant-hero-banner" style="background-image:url('${heroImage}')">
          <div class="restaurant-hero-overlay">
            <span class="hero-tag">🔥 الأكثر طلباً</span>
            <h2>${heroItem.n}</h2>
            <p>${heroItem.d || "وجبة شهية"}</p>
            <div class="restaurant-hero-price">${heroItem.p} ريال</div>
          </div>
        </div>
        ${tabsHtml}
        <div class="menu-grid" id="menuItemsGrid">
    `;

    currentRestaurant.items.forEach((item, idx) => {
        let cartItem = cart.find(i => i.name === item.n && i.restaurantId === currentRestaurant.id);
        let count = cartItem ? cartItem.qty : 0;
        let note = cartItem ? (cartItem.note || '') : '';
        let catAttr = item.cat || 'أخرى';

        itemsHtml += `
            <div class="menu-item-card" data-cat="${catAttr}">
              <div class="menu-item-img" style="background-image:url('${getItemImage(item.n)}')"></div>
              <div class="menu-item-info">
                <div class="menu-item-name">${item.n}</div>
                <div class="menu-item-desc">${item.d || "وجبة لذيذة"}</div>
                <div class="menu-item-price">${item.p} ريال</div>
                <div class="item-controls" style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">
                  <div style="display:flex; align-items:center; justify-content:center; gap:15px; background:var(--bg-light); padding:5px; border-radius:30px;">
                    <button class="qty-btn" onclick="updateItemQuantity(${idx}, ${currentRestaurant.id}, -1)" style="width:30px; height:30px; border-radius:50%; border:none; background:var(--primary); color:white; font-weight:bold; cursor:pointer;">-</button>
                    <span id="qty_${currentRestaurant.id}_${idx}" style="font-weight:bold; min-width:20px; text-align:center;">${count}</span>
                    <button class="qty-btn" onclick="updateItemQuantity(${idx}, ${currentRestaurant.id}, 1)" style="width:30px; height:30px; border-radius:50%; border:none; background:var(--primary); color:white; font-weight:bold; cursor:pointer;">+</button>
                  </div>
                  <textarea id="note_${currentRestaurant.id}_${idx}" rows="1" placeholder="📝 ملاحظة خاصة لهذا الصنف (اختياري)" style="width:100%; padding:6px; border-radius:12px; border:1px solid var(--gray-light); font-size:0.8rem; background:var(--white);" oninput="updateItemNote(${idx}, ${currentRestaurant.id}, this.value)">${note}</textarea>
                </div>
              </div>
            </div>
        `;
    });
    itemsHtml += `</div><button class="back-btn" onclick="showPage('restaurantsPage')">🔙 رجوع</button>`;
    document.getElementById('menuContent').innerHTML = itemsHtml;
    showPage('menuPage');
    updateCartDisplay();
}

window.filterMenuCategory = function(cat) {
    document.querySelectorAll('#menuCategoryTabs .category-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#menuCategoryTabs .category-tab-btn[data-cat="${cat}"]`).classList.add('active');
    document.querySelectorAll('#menuItemsGrid .menu-item-card').forEach(el => {
        if (cat === 'all' || el.dataset.cat === cat) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
};

function updateItemQuantity(idx, restaurantId, delta) {
    const item = allRestaurants.find(r => r.id == restaurantId).items[idx];
    let existingIdx = cart.findIndex(i => i.name === item.n && i.restaurantId == restaurantId);
    if (existingIdx !== -1) {
        let newQty = cart[existingIdx].qty + delta;
        if (newQty <= 0) {
            cart.splice(existingIdx, 1);
        } else {
            cart[existingIdx].qty = newQty;
        }
    } else if (delta > 0) {
        cart.push({ name: item.n, p: item.p, qty: 1, note: document.getElementById(`note_${restaurantId}_${idx}`)?.value || '', restaurant: currentRestaurant.name, restaurantId: restaurantId, img: getItemImage(item.n) });
    }
    updateCartDisplay();
    const existingItem = cart.find(i => i.name === item.n && i.restaurantId == restaurantId);
    const qtySpan = document.getElementById(`qty_${restaurantId}_${idx}`);
    if (qtySpan) qtySpan.innerText = existingItem ? existingItem.qty : 0;
}

function updateItemNote(idx, restaurantId, note) {
    const item = allRestaurants.find(r => r.id == restaurantId).items[idx];
    let existingIdx = cart.findIndex(i => i.name === item.n && i.restaurantId == restaurantId);
    if (existingIdx !== -1) cart[existingIdx].note = note;
}

// وظائف السلة والتسوق الأخرى (مختصرة للطول، تعمل كما هي)
function updateCartDisplay() {
    let total = cart.reduce((s, i) => s + (i.p * i.qty), 0);
    let itemsCount = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').innerText = itemsCount;
    document.getElementById('cartTotal').innerText = total;
    let floatCartElem = document.getElementById('floatCart');
    if (floatCartElem) floatCartElem.style.display = cart.length && document.getElementById('menuPage').classList.contains('active-page') ? 'flex' : 'none';
    let badge = document.getElementById('navCartBadge');
    if (badge) { if (itemsCount > 0) { badge.innerText = itemsCount; badge.style.display = 'block'; } else badge.style.display = 'none'; }
    let container = document.getElementById('cartItemsList');
    if (container) {
        if (cart.length === 0) container.innerHTML = `<p style="text-align:center; padding:30px;">السلة فارغة 🛒</p>`;
        else {
            container.innerHTML = cart.map((item, i) => `
                <div class="cart-item">
                  <div class="cart-item-img" style="background-image:url('${item.img || getItemImage(item.name)}')"></div>
                  <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    ${item.note ? `<div style="font-size:0.65rem; color:var(--gray);">📝 ${item.note}</div>` : ''}
                    <div>${item.p * item.qty} ريال</div>
                  </div>
                  <div class="cart-qty-controls">
                    <button class="qty-btn" onclick="changeCartQty(${i}, 1)">+</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeCartQty(${i}, -1)">-</button>
                  </div>
                </div>
            `).join('');
        }
    }
    document.getElementById('cartTotalPrice').innerText = total + ' ريال';
}

function changeCartQty(idx, delta) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    updateCartDisplay();
}

// ==================== 7. دالة إنشاء الطلب الجديد (المحدثة لـ Firestore) ====================
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
        const orderRef = db.collection('orders').doc();
        await orderRef.set({
            ...orderData,
            orderId: orderRef.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        localStorage.setItem('currentTrackingOrder', orderRef.id);
        showToast('✅ تم إرسال طلبك بنجاح!');

        cart = [];
        customerLocation = null;
        deliveryCost = 0;
        document.getElementById('cartOrderNote').value = '';
        updateCartDisplay();
        showPage('homePage');

        setTimeout(() => {
            viewOrderTracking(orderRef.id);
            startAutoTracking(orderRef.id);
        }, 1500);

    } catch (error) {
        console.error("❌ فشل في حفظ الطلب:", error);
        showToast('❌ حدث خطأ أثناء إرسال الطلب: ' + error.message);
    }
}

// ==================== 8. دوال التتبع ====================
function startAutoTracking(orderId) {
    if (trackingInterval) clearInterval(trackingInterval);
    checkOrderStatus(orderId);
    trackingInterval = setInterval(() => { checkOrderStatus(orderId); }, 3000);
}

async function checkOrderStatus(orderId) {
    await loadOrders();
    let order = allOrders.find(o => o.id == orderId);
    if (!order) return;
    if (document.getElementById('trackFullscreen').style.display === 'block') {
        viewOrderTracking(orderId);
    }
    if (order.status !== lastOrderStatus) {
        lastOrderStatus = order.status;
        if (order.status === 'delivered') {
            setTimeout(() => { openRatingModal(order.id); }, 2000);
        }
    }
}

async function viewOrderTracking(id) {
    await loadOrders();
    let order = allOrders.find(o => o.id == id);
    if (!order) return;
    let steps = ['pending', 'on_the_way', 'arrived', 'delivered'];
    let idx = steps.indexOf(order.status);
    let stepsHtml = '<div class="tracking-steps">';
    steps.forEach((s, i) => {
        let cls = (i < idx) ? 'completed' : (i === idx ? 'active' : '');
        let icon = { pending: 'fa-clock', on_the_way: 'fa-truck', arrived: 'fa-map-marker-alt', delivered: 'fa-check-circle' }[s];
        let label = { pending: 'قيد المراجعة', on_the_way: 'في الطريق', arrived: 'وصل الموقع', delivered: 'تم التوصيل' }[s];
        stepsHtml += `<div class="step ${cls}"><div class="circle"><i class="fas ${icon}"></i></div><div class="step-label">${label}</div></div>`;
        if (i < steps.length - 1) stepsHtml += `<div class="step-connector ${i<idx?'completed':''}"></div>`;
    });
    stepsHtml += '</div>';
    let itemsListHtml = '<ul class="order-items-list">' + order.items.map(i =>
        `<li><span>${i.name} x${i.qty} ${i.note?'('+i.note+')':''}</span><span>${i.price*i.qty} ريال</span></li>`
    ).join('') + '</ul>';
    let details = `
        <div class="tracking-detail-card" style="border:2px solid var(--primary);">
            <h3 style="font-size:1.3rem; color:var(--primary);">📍 طلب #${order.id}</h3>
            <div class="tracking-label">⏰ الوقت</div>
            <div class="tracking-value" style="font-size:1rem;">${new Date(order.createdAt?.toDate()).toLocaleString('ar-SA')}</div>
            <div class="tracking-label">🍔 المطعم</div>
            <div class="tracking-value" style="font-size:1rem;">${order.restaurant}</div>
            <div class="tracking-label">🧾 الأصناف</div>
            ${itemsListHtml}
            <div style="display:flex; justify-content:space-between; font-size:1rem; margin:5px 0;"><span>المجموع</span><span>${order.totalFood} ريال</span></div>
            <div style="display:flex; justify-content:space-between; font-size:1rem; margin:5px 0;"><span>🚚 التوصيل</span><span>${order.deliveryCost} ريال</span></div>
            <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:800; border-top:2px solid var(--primary); padding-top:8px; margin-top:8px;"><span>الإجمالي</span><span>${order.total} ريال</span></div>
        </div>
        ${stepsHtml}
    `;
    document.getElementById('trackingFullscreenContainer').innerHTML = details;
    document.getElementById('trackFullscreen').style.display = 'block';
}

// ==================== 9. واجهة المندوب ====================
window.switchDriverTab = function(tab) {
    driverTab = tab;
    document.querySelectorAll('.driver-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.driver-tab[data-driver-tab="${tab}"]`).classList.add('active');
    refreshDriverPanel();
    if (tab === 'available') { lastOrderCount = allOrders.filter(o => o.status === 'pending').length; }
};

async function refreshDriverPanel() {
    await loadOrders();
    let activeOrders = allOrders.filter(o => o.driverId === currentUser?.phone && o.status !== 'delivered');
    let availableOrders = allOrders.filter(o => o.status === 'pending');
    let completedOrders = allOrders.filter(o => o.driverId === currentUser?.phone && o.status === 'delivered');
    document.getElementById('activeOrdersCount').innerText = activeOrders.length;
    document.getElementById('completedOrdersCount').innerText = completedOrders.length;
    // checkForNewOrders(); // تم التعليق لتجنب أي خطأ صوتي غير مرغوب
    let html = '';
    if (driverTab === 'available') {
        if (availableOrders.length === 0) html = `<div class="empty-orders"><i class="fas fa-motorcycle"></i><p>لا يوجد طلبات متاحة في الوقت الحالي!</p></div>`;
        else html = availableOrders.map(o => `
            <div class="driver-order-card">
                <div class="driver-order-header"><span class="driver-order-id">#${o.id}</span><span class="driver-order-status">متاح</span></div>
                <div class="driver-order-details"><div><i class="fas fa-store"></i> ${o.restaurant || o.service}</div><div><i class="fas fa-money-bill"></i> ${o.total || o.price} ريال</div><div><i class="fas fa-map-marker-alt"></i> ${o.address || o.destinationAddress}</div></div>
                <div class="driver-order-actions">
                    <button class="driver-action-btn primary" onclick="showConfirmationModal(${o.id}, 'accept')"><i class="fas fa-check-circle"></i> قبول</button>
                    <button class="driver-action-btn danger" onclick="showConfirmationModal(${o.id}, 'reject')"><i class="fas fa-times-circle"></i> رفض</button>
                    <button class="driver-action-btn call" onclick="callCustomer('${o.customerPhone || o.phone}')"><i class="fas fa-phone"></i> اتصال</button>
                </div>
            </div>
        `).join('');
    } else {
        if (activeOrders.length === 0) html = `<div class="empty-orders"><i class="fas fa-check-circle"></i><p>لا يوجد طلبات نشطة حالياً</p></div>`;
        else html = activeOrders.map(o => `
            <div class="driver-order-card" onclick="viewDriverOrderDetail(${o.id})">
                <div class="driver-order-header"><span class="driver-order-id">#${o.id}</span><span class="driver-order-status ${o.status === 'delivered' ? 'delivered' : (o.status === 'on_the_way' ? 'on_the_way' : '')}">${getStatusText(o.status)}</span></div>
                <div class="driver-order-details"><div><i class="fas fa-store"></i> ${o.restaurant || o.service}</div><div><i class="fas fa-money-bill"></i> ${o.total || o.price} ريال</div><div><i class="fas fa-map-marker-alt"></i> ${o.address || o.destinationAddress}</div></div>
                <div style="font-size:0.7rem;"><i class="far fa-clock"></i> ${new Date(o.createdAt?.toDate()).toLocaleString('ar-SA')}</div>
            </div>
        `).join('');
    }
    document.getElementById('driverOrdersList').innerHTML = html;
}

function showConfirmationModal(orderId, action) {
    pendingOrderId = orderId;
    pendingModalAction = action;
    let actionText = action === 'accept' ? 'قبول الطلب' : 'رفض الطلب';
    document.getElementById('modalTitle').innerText = 'تأكيد العملية';
    document.getElementById('modalMessage').innerText = `هل أنت متأكد من ${actionText} للطلب #${orderId}?`;
    document.getElementById('confirmationModal').classList.add('open');
}

async function acceptOrder(id) {
    if (allOrders.find(o => o.driverId === currentUser?.phone && o.status !== 'delivered')) return showToast("⚠️ لديك طلب نشط حالياً");
    let o = allOrders.find(o => o.id == id);
    if (!o || o.status !== 'pending') return showToast("الطلب غير متاح");
    await updateOrder(id, { status: 'on_the_way', driverId: currentUser.phone, driverName: currentUser.name });
    await updateUserBusy(currentUser.phone, true);
    showToast("✅ تم قبول الطلب");
    driverTab = 'active';
    document.querySelectorAll('.driver-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.driver-tab[data-driver-tab="active"]`).classList.add('active');
    refreshDriverPanel();
}

// ==================== 10. الوظائف الأخرى ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    let activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');
    let floatCartElem = document.getElementById('floatCart');
    if (floatCartElem) floatCartElem.style.display = (cart.length && pageId === 'menuPage') ? 'flex' : 'none';
    if (pageId === 'homePage') document.getElementById('trackOrderBtnHome').style.display = localStorage.getItem('currentTrackingOrder') ? 'block' : 'none';
    if (pageId === 'driverPage') { document.getElementById('driverNameDisplay').innerText = currentUser?.name || 'مندوب'; refreshDriverPanel(); }
}

document.getElementById('modalConfirm').onclick = async () => {
    if (pendingOrderId && pendingStatus) {
        await updateOrder(pendingOrderId, { status: pendingStatus });
        if (pendingStatus === 'delivered') await updateUserBusy(currentUser.phone, false);
        showToast(`✅ تم تغيير الحالة إلى ${getStatusText(pendingStatus)}`);
        viewDriverOrderDetail(pendingOrderId);
        pendingOrderId = null; pendingStatus = null;
    } else if (pendingOrderId && pendingModalAction) {
        if (pendingModalAction === 'accept') { await acceptOrder(pendingOrderId); }
        else if (pendingModalAction === 'reject') { await rejectOrder(pendingOrderId); }
        pendingOrderId = null; pendingModalAction = null;
    }
    document.getElementById('confirmationModal').classList.remove('open');
};

// ==================== 11. تهيئة التطبيق عند التحميل ====================
function initLogin() {
    // كود تسجيل الدخول الموجود في ملفك
}

document.addEventListener('DOMContentLoaded', () => {
    renderMainCarousel();
    renderCategories();
    renderOffers();
    initPaymentList();
    renderFilters();
    renderRestaurantsList();
    startMainCarouselAuto();
    
    // التحقق من وجود مستخدم مسجل
    let savedUser = localStorage.getItem('waselny_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            document.getElementById('loginOverlay').style.display = 'none';
            if (currentUser.role === 'driver') { showPage('driverPage'); refreshDriverPanel(); } 
            else { showPage('homePage'); }
        } catch (e) { initLogin(); }
    } else { initLogin(); }
});
