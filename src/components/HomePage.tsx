import React, { useState, useEffect, useRef, useMemo } from 'react';

// ===============================================================================================
// --- ⚙️ تم حذف استيراد البيانات الثابتة من هنا ---
// --- سيتم الآن جلب البيانات مباشرة من GitHub ---
// ===============================================================================================


// ===============================================================================================
// --- 🎭 مكونات وهمية (Mock Components) ---
// ===============================================================================================
const WhatsAppWidget: React.FC = () => (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors transform hover:scale-110">
        <a href="https://wa.me/972528180757" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
        </a>
    </div>
);


// ===============================================================================================
// --- 📝 الواجهات والأنواع (Interfaces & Types) ---
// ===============================================================================================
type LanguageCode = 'ar' | 'en' | 'he';

interface LocalizedString {
    en: string;
    ar: string;
    he: string;
}

interface ActivationInfo {
    id: number;
    title: LocalizedString;
    description?: LocalizedString;
    category?: LocalizedString;
    image_url?: string;
    price?: string | number;
    ecu?: string;
}

interface CartItem extends ActivationInfo {
    carModelName: string;
    carYear: string;
    carGeneration: string;
}

interface LanguageMap {
    [key: string]: any;
}

interface Tool {
    id: string;
    image_url: string;
    titleKey: string;
    descriptionKey: string;
}

interface WorkItem {
    image_url: string;
    title: LocalizedString;
    description: LocalizedString;
    link: string;
}

// ===============================================================================================
// --- 🌍 بيانات ثابتة وترجمات ---
// ===============================================================================================
const translations: LanguageMap = {
    en: {
        headerHome: "Home", headerActivations: "Activations", headerServices: "Services", headerContact: "Contact Us",
        headerOurWork: "Our Work", headerAqTools: "AQ Tools", headerCodingVip: "Coding VIP",
        cartTitle: "Shopping Cart", cartEmptyTitle: "Your cart is empty", cartEmptyMessage: "Add some activations to your cart", cartTotal: "Subtotal", cartTaxes: "Taxes and shipping calculated at checkout.", cartCheckout: "Checkout", cartContinueShopping: "Continue Shopping", cartRemove: "Remove", welcomeTitle: "Discover the available activations for your car and get the best driving experience", activationsTitle: "Available Activations", activationsFor: "For", viewDetails: "View Details", addToCart: "Add to Cart", addedToCart: "Added", servicesTitle: "Our Services", service1Title: "Advanced Programming", service1Desc: "Activate all hidden features in your car professionally and safely.", service2Title: "Unlimited Warranty", service2Desc: "We offer a lifetime warranty on all programming services.", service3Title: "Online Services", service3Desc: "Remote car programming and modification over the internet.", service3Req: "Requirements", detailDescription: "Description", detailECU: "ECU", detailSimplifiedExplanation: "Simplified Explanation ✨", detailGoBack: "Back to List", contactTitle: "Contact Us", contactInfo: "Contact Information", contactPhone: "Phone", contactEmail: "Email", contactAddress: "Address", contactSendMessage: "Send us a message", contactFullName: "Full Name", contactYourEmail: "Email Address", contactPhoneNumber: "Phone Number", contactMessage: "Message", contactSubmit: "Send Message", contactSuccess: "Your message has been sent successfully!", contactError: (status: number) => `Error sending message. Code: ${status}.`, contactNetworkError: "Network error. Please check your connection.", contactCarInquiry: "I would like to inquire about activations for the car:", contactModelYear: "model", contactGeneration: "generation", contactCartItems: "Activations in cart:", footerRights: (year: number) => `© ${year}`, footerRightsSuffix: "All rights reserved.", footerSlogan: "Professional BMW Programming Services", businessHours: "Business Hours", hoursSundayThursday: "Sunday - Thursday: 9:00 AM - 6:00 PM", hoursFriday: "Friday: 9:00 AM - 1:00 PM", hoursSaturday: "Saturday: Closed", statusOpen: "We're Open!", statusClosed: "We're Closed.",
        selectorTitle: "Choose Your BMW", selectorSeries: "Series", selectorSelectSeries: "Select Series...", selectorYear: "Year", selectorSelectYear: "Select Year...", selectorGeneration: "Generation (Model)", selectorSelectGeneration: "Select Generation...",
        whatsappGroupButton: "Join our WhatsApp Group",
        discoverActivations: "Discover Activations",
        backToHome: "Back to Home",
        aqBimmerToolsTitle: "Tools",
        downloadNow: "Download Now",
        inquireOnWhatsApp: "Inquire on WhatsApp",
        toolViewDetails: "View Details",
        toolCheatoolTitle: "AQ///cheaTool",
        toolCheatoolShortDesc: "The Ultimate BMW Coding & Modification Program. Click to see more details.",
        tool2Title: "AQ///imageTool", tool2Desc: "A tool for replacing entry videos, images, and clock backgrounds in NBT Evo units",
        toolDetailPageTitle: "AQ///cheaTool: The Ultimate BMW Coding & Modification Program",
        toolDetailPageDesc: "Unleash the full potential of your BMW with AQ///cheaTool – a comprehensive solution for all your coding, activation, and retrofit needs!",
        toolFeaturesTitle: "Features and Capabilities",
        toolFeaturesDesc: "Our program offers unparalleled versatility, supporting all BMW models for a wide range of functions:",
        featureAllCoding: "All Coding: Access and modify every codable parameter in your BMW.",
        featureActivations: "Activations: Enable hidden features and functionalities.",
        featureRetrofits: "Retrofits: Seamlessly integrate new hardware components.",
        featureEvoHDD: "Even EVO HDD Changes: Perform advanced modifications, including hard drive changes on EVO units.",
        toolUpgradeTitle: "iDrive System Upgrade and CarPlay Integration",
        toolUpgradeDesc: "Upgrade your iDrive system and integrate Apple CarPlay:",
        featureFlashID4: "Flash ID4 to ID5/6 + CarPlay: Transform your ID4 unit into the latest ID5/6 system with integrated CarPlay.",
        featureEvoImage: "EVO Image Change (Manual): Manually change EVO images for all units, including CIC, NBT, NBTEVO, and Entrynav.",
        featureFileTransfer: "File Transfer & Permissions: Detailed instructions on file transfer, obtaining permissions, and adding new paths.",
        toolMessageTitle: "Control Unit Message Management",
        toolMessageDesc: "Master control unit communication and error messages:",
        featureCC: "CC Messages: Understand and manage all control unit messages with detailed explanations.",
        featureCopyText: "Direct Text Copy for Search: Easily copy message text for quick parameter search.",
        featureEsys: "E-Sys Coding Steps: Detailed instructions on performing coding via E-Sys.",
        toolPackageTitle: "The All-in-One Tool Package",
        toolPackageDesc: "Your purchase includes our full suite of essential modification tools:",
        toolList: ["AQ///imageTool & cheaTool", "NBT-Startup animation generator", "FA CREATOR", "MGU Tool (For updates only)", "FSC Long code Generator", "Behram Tool (Auto file transfer, VIN unlock)"],
        toolAiAssistantTitle: "AQ///ai Assistant",
        toolAiWelcome: "Hello! How can I help you with AQ///bimmer Tools today?",
        toolAiPlaceholder: "Ask about features, price...",
        toolGetPackage: "Get The Full Package",
        toolPrice: "$150",
        toolPaymentDesc: "Pay via PayPal and send your payment confirmation and registered email to get the activation key.",
        payWithPaypal: "Pay with PayPal",
        downloadSoftware: "Download Software",
        joinWhatsApp: "Join WhatsApp Group",
        detailBenefits: "Benefits", detailTechDetails: "Technical Details", detailSimilarActivations: "You might also like...",
        bimmerBotWelcome: "Hello! I'm BimmerBot, your expert assistant for AQ///bimmer. How can I help you with your BMW activations today?",
        bimmerBotPlaceholder: "Ask about CarPlay, Sport+ mode...",
        bimmerBotError: "Sorry, I'm having trouble connecting to my systems. Please try again in a moment.",
    },
    ar: {
        headerHome: "الرئيسية", headerActivations: "التفعيلات", headerServices: "الخدمات", headerContact: "تواصل معنا",
        headerOurWork: "أعمالنا", headerAqTools: "أدوات", headerCodingVip: "برمجة VIP",
        cartTitle: "سلة التسوق", cartEmptyTitle: "سلة التسوق فارغة", cartEmptyMessage: "أضف بعض التفعيلات إلى سلتك", cartTotal: "المجموع", cartTaxes: "الضرائب والشحن تحسب عند الدفع.", cartCheckout: "اتمام الطلب", cartContinueShopping: "متابعة التسوق", cartRemove: "إزالة", welcomeTitle: "اكتشف التفعيلات المتاحة لسيارتك واحصل على أفضل تجربة قيادة", activationsTitle: "التفعيلات المتاحة", activationsFor: "لـ", viewDetails: "عرض التفاصيل", addToCart: "إضافة للسلة", addedToCart: "تمت الإضافة", servicesTitle: "خدماتنا", service1Title: "برمجة متقدمة", service1Desc: "تفعيل جميع الخصائص المخفية في سيارتك باحترافية وأمان تام.", service2Title: "ضمان غير محدود", service2Desc: "نقدم ضمان شامل مدى الحياة على جميع خدمات البرمجة.", service3Title: "خدمات اونلاين", service3Desc: "برمجة وتعديل السيارة عن بعد من خلال الإنترنت.", service3Req: "المتطلبات", detailDescription: "الوصف", detailECU: "الوحدة (ECU)", detailSimplifiedExplanation: "شرح مبسط ✨", detailGoBack: "العودة للقائمة", contactTitle: "تواصل معنا", contactInfo: "معلومات التواصل", contactPhone: "الهاتف", contactEmail: "البريد الإلكتروني", contactAddress: "العنوان", contactSendMessage: "أرسل لنا رسالة", contactFullName: "الاسم الكامل", contactYourEmail: "البريد الإلكتروني", contactPhoneNumber: "رقم الهاتف", contactMessage: "الرسالة", contactSubmit: "إرسال الرسالة", contactSuccess: "تم إرسال رسالتك بنجاح!", contactError: (status: number) => `حدث خطأ أثناء إرسال الرسالة. رمز الخطأ: ${status}.`, contactNetworkError: "حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت.", contactCarInquiry: "أود الاستفسار عن تفعيلات لسيارة:", contactModelYear: "موديل", contactGeneration: "جيل", contactCartItems: "التفعيلات المطلوبة في السلة:", footerRights: (year: number) => `© ${year}`, footerRightsSuffix: "جميع الحقوق محفوظة.", footerSlogan: "خدمات برمجة سيارات BMW الاحترافية", businessHours: "ساعات العمل", hoursSundayThursday: "الأحد - الخميس: 9:00 ص - 6:00 م", hoursFriday: "الجمعة: 9:00 ص - 1:00 م", hoursSaturday: "السبت: مغلق", statusOpen: "نحن متواجدون الآن!", statusClosed: "نحن مغلقون الآن.",
        selectorTitle: "اختر سيارتك البي ام دبليو", selectorSeries: "السلسلة", selectorSelectSeries: "اختر السلسلة...", selectorYear: "سنة الصنع", selectorSelectYear: "اختر السنة...", selectorGeneration: "الجيل (موديل)", selectorSelectGeneration: "اختر الجيل...",
        whatsappGroupButton: "انضم لمجموعتنا على الواتساب",
        discoverActivations: "اكتشف التفعيلات",
        backToHome: "العودة للرئيسية",
        aqBimmerToolsTitle: "أدوات",
        downloadNow: "تحميل الآن",
        inquireOnWhatsApp: "استفسار عبر الواتساب",
        toolViewDetails: "عرض التفاصيل",
        toolCheatoolTitle: "AQ///cheaTool",
        toolCheatoolShortDesc: "البرنامج الشامل لبرمجة وتعديل سيارات BMW. اضغط لعرض التفاصيل.",
        tool2Title: "AQ///imageTool", tool2Desc: "اداه تبديل الصور وفيديو الدخول وصور الساعات في وحدات NBT evo",
        toolDetailPageTitle: "AQ///cheaTool: البرنامج الشامل لبرمجة وتعديل BMW",
        toolDetailPageDesc: "أطلق العنان للإمكانيات الكاملة لسيارتك BMW مع AQ///cheaTool - الحل الشامل لجميع احتياجات البرمجة والتفعيلات والتركيبات الإضافية!",
        toolFeaturesTitle: "الميزات والقدرات",
        toolFeaturesDesc: "يقدم برنامجنا تنوعًا لا مثيل له، ويدعم جميع موديلات BMW لمجموعة واسعة من الوظائف:",
        featureAllCoding: "جميع أنواع البرمجة: الوصول إلى كل متغير قابل للبرمجة في سيارتك وتعديله.",
        featureActivations: "التفعيلات: تمكين الميزات والوظائف المخفية.",
        featureRetrofits: "التركيبات الإضافية (Retrofits): دمج مكونات الأجهزة الجديدة بسلاسة.",
        featureEvoHDD: "حتى تغييرات EVO HDD: قم بإجراء تعديلات متقدمة، بما في ذلك تغييرات القرص الصلب على وحدات EVO.",
        toolUpgradeTitle: "ترقية نظام iDrive وتكامل CarPlay",
        toolUpgradeDesc: "قم بترقية نظام iDrive الخاص بك وادمج Apple CarPlay:",
        featureFlashID4: "فلاش ID4 إلى ID5/6 + CarPlay: حوّل وحدة ID4 الخاصة بك إلى أحدث نظام ID5/6 مع CarPlay مدمج.",
        featureEvoImage: "تغيير صورة EVO (يدويًا): قم بتغيير صور EVO يدويًا لجميع الوحدات، بما في ذلك CIC و NBT و NBTEVO و Entrynav.",
        featureFileTransfer: "نقل الملفات والأذونات: إرشادات مفصلة حول نقل الملفات والحصول على الأذونات وإضافة مسارات جديدة.",
        toolMessageTitle: "إدارة رسائل وحدات التحكم",
        toolMessageDesc: "تحكم بشكل كامل في اتصالات وحدة التحكم ورسائل الأخطاء:",
        featureCC: "رسائل CC: فهم وإدارة جميع رسائل وحدة التحكم مع شروحات مفصلة.",
        featureCopyText: "نسخ النص المباشر للبحث: انسخ نص الرسالة بسهولة للبحث السريع عن المتغيرات.",
        featureEsys: "خطوات برمجة E-Sys: إرشادات مفصلة حول إجراء البرمجة عبر E-Sys.",
        toolPackageTitle: "حزمة الأدوات المتكاملة",
        toolPackageDesc: "يشمل شراؤك مجموعتنا الكاملة من أدوات التعديل الأساسية:",
        toolList: ["AQ///imageTool & cheaTool", "مولد رسوم متحركة لبدء التشغيل NBT", "FA CREATOR", "أداة MGU (للتحديثات فقط)", "مولد أكواد FSC الطويلة", "أداة بهرام (نقل تلقائي للملفات، فتح VIN)"],
        toolAiAssistantTitle: "مساعد AQ///ai",
        toolAiWelcome: "مرحباً! كيف يمكنني مساعدتك بخصوص أدوات AQ///bimmer اليوم؟",
        toolAiPlaceholder: "اسأل عن الميزات، السعر...",
        toolGetPackage: "احصل على الحزمة الكاملة",
        toolPrice: "$150",
        toolPaymentDesc: "ادفع عبر PayPal وأرسل تأكيد الدفع والبريد الإلكتروني المسجل للحصول على مفتاح التفعيل.",
        payWithPaypal: "الدفع بواسطة PayPal",
        downloadSoftware: "تحميل البرنامج",
        joinWhatsApp: "الانضمام لمجموعة الواتساب",
        detailBenefits: "الفوائد", detailTechDetails: "تفاصيل تقنية", detailSimilarActivations: "قد يعجبك أيضاً...",
        bimmerBotWelcome: "أهلاً بك! أنا BimmerBot، مساعدك الخبير من AQ///bimmer. كيف يمكنني مساعدتك بخصوص تفعيلات سيارتك BMW اليوم؟",
        bimmerBotPlaceholder: "اسأل عن كاربلاي، وضع سبورت+...",
        bimmerBotError: "عذراً، أواجه مشكلة في الاتصال بأنظمتي. الرجاء المحاولة بعد لحظات.",
    },
    he: {
        headerHome: "ראשי", headerActivations: "הפעלות", headerServices: "שירותים", headerContact: "צור קשר",
        headerOurWork: "העבודות שלנו", headerAqTools: "כלים של", headerCodingVip: "קידוד VIP",
        cartTitle: "עגלת קניות", cartEmptyTitle: "העגלה שלך ריקה", cartEmptyMessage: "הוסף כמה הפעלות לעגלה שלך", cartTotal: "סכום ביניים", cartTaxes: "מיסים ומשלוח יחושבו בקופה.", cartCheckout: "לתשלום", cartContinueShopping: "המשך בקניות", cartRemove: "הסר", welcomeTitle: "גלה את ההפעלות הזמינות לרכבך וקבל את חווית הנהיגה הטובה ביותר", activationsTitle: "הפעלות זמינות", activationsFor: "עבור", viewDetails: "צפה בפרטים", addToCart: "הוסף לעגלה", addedToCart: "נוסף לעגלה", servicesTitle: "השירותים שלנו", service1Title: "תכנות מתקדם", service1Desc: "הפעל את כל התכונות הנסתרות ברכבך במקצועיות ובבטיחות מלאה.", service2Title: "אחריות ללא הגבלה", service2Desc: "אנו מציעים אחריות לכל החיים על כל שירותי התכנות.", service3Title: "שירותים מקוונים", service3Desc: "תכנות ושינוי רכבים מרחוק דרך האינטרנט.", service3Req: "דרישות", detailDescription: "תיאור", detailECU: "ECU", detailSimplifiedExplanation: "הסבר פשוט ✨", detailGoBack: "חזור לרשימה", contactTitle: "צור קשר", contactInfo: "פרטי התקשרות", contactPhone: "טלפון", contactEmail: "אימייל", contactAddress: "כתובת", contactSendMessage: "שלח לנו הודעה", contactFullName: "שם מלא", contactYourEmail: "כתובת אימייל", contactPhoneNumber: "מספר טלפון", contactMessage: "הודעה", contactSubmit: "שלח הודעה", contactSuccess: "הודעתך נשלחה בהצלחה!", contactError: (status: number) => `אירעה שגיאה בשליחת ההודעה. קוד שגיאה: ${status}.`, contactNetworkError: "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט.", contactCarInquiry: "ברצוני לברר לגבי הפעלות לרכב:", contactModelYear: "מודל", contactGeneration: "דור", contactCartItems: "הפעלות מבוקשות בעגלה:", footerRights: (year: number) => `© ${year}`, footerRightsSuffix: "כל הזכויות שמורות.", footerSlogan: "שירותי תכנות מקצועיים ל-BMW", businessHours: "שעות פעילות", hoursSundayThursday: "ראשון - חמישי: 09:00 - 18:00", hoursFriday: "שישי: 09:00 - 13:00", hoursSaturday: "שבת: סגור", statusOpen: "אנחנו פתוחים!", statusClosed: "אנחנו סגורים.",
        selectorTitle: "בחר את רכב ה-BMW שלך", selectorSeries: "סדרה", selectorSelectSeries: "בחר סדרה...", selectorYear: "שנת ייצור", selectorSelectYear: "בחר שנה...", selectorGeneration: "דור (דגם)", selectorSelectGeneration: "בחר דור...",
        whatsappGroupButton: "הצטרף לקבוצת הוואטסאפ שלנו",
        discoverActivations: "גלה הפעלות",
        backToHome: "חזרה לדף הבית",
        aqBimmerToolsTitle: "כלים של",
        downloadNow: "הורד עכשיו",
        inquireOnWhatsApp: "בירור בוואטסאפ",
        toolViewDetails: "צפה בפרטים",
        toolCheatoolTitle: "AQ///cheaTool",
        toolCheatoolShortDesc: "התוכנה האולטימטיבית לקידוד ושינויים ב-BMW. לחץ לפרטים נוספים.",
        tool2Title: "כלי שינוי תמונות ביחדה", tool2Desc: "תמונה ראשית לפי בחירה אישית וגם החלפת שעון מובנה לשעונן יוקרה",
        toolDetailPageTitle: "AQ///cheaTool: התוכנה האולטימטיבית לקידוד ושינויים ב-BMW",
        toolDetailPageDesc: "שחרר את הפוטנציאל המלא של ה-BMW שלך עם AQ///cheaTool – פתרון מקיף לכל צרכי הקידוד, ההפעלות והרטרופיטים שלך!",
        toolFeaturesTitle: "תכונות ויכולות",
        toolFeaturesDesc: "התוכנה שלנו מציעה גמישות שאין שני לה, ותומכת בכל דגמי BMW למגוון רחב של פונקציות:",
        featureAllCoding: "כל הקידודים: גש ושנה כל פרמטר שניתן לקודד ב-BMW שלך.",
        featureActivations: "הפעלות: אפשר תכונות ופונקציות נסתרות.",
        featureRetrofits: "רטרופיטים: שלב בצורה חלקה רכיבי חומרה חדשים.",
        featureEvoHDD: "אפילו שינויי EVO HDD: בצע שינויים מתקדמים, כולל שינויים בכונן הקשיח ביחידות EVO.",
        toolUpgradeTitle: "שדרוג מערכת iDrive ושילוב CarPlay",
        toolUpgradeDesc: "שדרג את מערכת ה-iDrive שלך ושלב את Apple CarPlay:",
        featureFlashID4: "פלאש מ-ID4 ל-ID5/6 + CarPlay: הפוך את יחידת ה-ID4 שלך למערכת ID5/6 העדכנית ביותר עם CarPlay משולב.",
        featureEvoImage: "החלפת תמונת EVO (ידנית): החלף ידנית תמונות EVO לכל היחידות, כולל CIC, NBT, NBTEVO ו-Entrynav.",
        featureFileTransfer: "העברת קבצים והרשאות: הוראות מפורטות על העברת קבצים, קבלת הרשאות והוספת נתיבים חדשים.",
        toolMessageTitle: "ניהול הודעות יחידת בקרה",
        toolMessageDesc: "שלוט בתקשורת יחידת הבקרה ובהודעות שגיאה:",
        featureCC: "הודעות CC: הבן ונהל את כל הודעות יחידת הבקרה עם הסברים מפורטים.",
        featureCopyText: "העתקת טקסט ישירה לחיפוש: העתק בקלות טקסט הודעה לחיפוש פרמטרים מהיר.",
        featureEsys: "שלבי קידוד ב-E-Sys: הוראות מפורטות לביצוע קידוד באמצעות E-Sys.",
        toolPackageTitle: "חבילת הכלים המלאה",
        toolPackageDesc: "הרכישה שלך כוללת את כל חבילת כלי השינוי החיוניים שלנו:",
        toolList: ["AQ///imageTool & cheaTool", "מחולל אנימציית אתחול ל-NBT", "יוצר FA", "כלי MGU (לעדכונים בלבד)", "מחולל קוד ארוך של FSC", "כלי بهرام (העברת קבצים אוטומטית, שחרור VIN)"],
        toolAiAssistantTitle: "העוזר החכם AQ///ai",
        toolAiWelcome: "שלום! איך אוכל לעזור לך עם הכלים של AQ///bimmer היום?",
        toolAiPlaceholder: "שאל על תכונות, מחיר...",
        toolGetPackage: "קבל את החבילה המלאה",
        toolPrice: "$150",
        toolPaymentDesc: "שלם באמצעות PayPal ושלח את אישור התשלום והאימייל הרשום שלך כדי לקבל את מפתח ההפעלה.",
        payWithPaypal: "שלם עם PayPal",
        downloadSoftware: "הורד תוכנה",
        joinWhatsApp: "הצטרף לקבוצת וואטסאפ",
        detailBenefits: "יתרונות", detailTechDetails: "פרטים טכניים", detailSimilarActivations: "אולי יעניין אותך גם...",
        bimmerBotWelcome: "שלום! אני BimmerBot, העוזר המומחה שלך מבית AQ///bimmer. איך אוכל לעזור לך עם הפעלות ה-BMW שלך היום?",
        bimmerBotPlaceholder: "שאל על CarPlay, מצב ספורט+...",
        bimmerBotError: "מצטער, אני מתקשה להתחבר למערכות שלי. אנא נסה שוב בעוד רגע.",
    },
};

const ourWorkData: WorkItem[] = [
    { 
        image_url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
        title: { 
            en: 'For BMW Coders', 
            ar: 'لمبرمجي BMW', 
            he: 'למקודדי BMW' 
        }, 
        description: { 
            en: 'Remote assistance, file services, and specialized solutions for programmers.', 
            ar: 'صفحة خاصة للمساعدة عن بعد، شراء ملفات، وخدمات متقدمة للمبرمجين.', 
            he: 'עזרה מרחוק, קניית קבצים ושירותים מתקדמים למתכנתים.' 
        }, 
        link: 'https://aqbimmer.netlify.app/bmw' 
    },
    { image_url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', title: { en: 'Performance Tuning', ar: 'تعديل الأداء', he: 'כוונון ביצועים' }, description: { en: 'Enhancing engine performance and driving dynamics for a thrilling experience.', ar: 'تحسين أداء المحرك وديناميكيات القيادة لتجربة مثيرة.', he: 'שיפור ביצועי המנוע ודינמיקת הנהיגה לחוויה מרגשת.' }, link: '#' },
    { image_url: 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', title: { en: 'Retrofit Installations', ar: 'تركيب تحديثات', he: 'התקנות רטרופיט' }, description: { en: 'Installing the latest BMW hardware and software into older models.', ar: 'تركيب أحدث أجهزة وبرامج BMW في الموديلات القديمة.', he: 'התקנת חומרת ותוכנת BMW העדכניות ביותר בדגמים ישנים יותר.' }, link: '#' },
];

const aqBimmerToolsData: Tool[] = [
    { 
        id: 'cheatool', 
        image_url: 'https://scontent.fsdv1-2.fna.fbcdn.net/v/t39.30808-6/518147833_745775931436253_647278901686359445_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=y12429d1NLwQ7kNvwFc-X8t&_nc_oc=AdkoPcZ15daktIpIFqPwyAHBUMIuk9eFQQIS5htvDh8QAQpHXrd33KeSl-LFh7AA33c&_nc_zt=23&_nc_ht=scontent.fsdv1-2.fna&_nc_gid=XnhBsVBCqmBhAh9YnVaLNg&oh=00_AfRpLEGhyb1008nFKtqRQhUioC3weVpstdM_AJCIwvhNGg&oe=687C2DD2', 
        titleKey: 'toolCheatoolTitle', 
        descriptionKey: 'toolCheatoolShortDesc' 
    },
    { 
        id: 'diagtool', 
        image_url: 'https://scontent.ftlv18-1.fna.fbcdn.net/v/t39.30808-6/518278183_745775568102956_1712913012265848888_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=OeiGm8u324oQ7kNvwHQxpEj&_nc_oc=AdnbpbDMTQoD48KrF83ZCOhsJMxNVctDUUSpzfCuqUGHqKlhCyNUaDfkpsEsJRJEz4c&_nc_zt=23&_nc_ht=scontent.ftlv18-1.fna&_nc_gid=7cqzz06KsOHSgZ_YV9Ue4g&oh=00_AfRnGip_X3fs-eJFkudoLSL-LrTrizvIUOL9JuN-7pwVxg&oe=687E6E1E', 
        titleKey: 'tool2Title', 
        descriptionKey: 'tool2Desc' 
    },
];

const getOpeningHoursStatus = (lang: LanguageCode) => {
    const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jerusalem"}));
    const day = now.getDay();
    const hour = now.getHours();
    const t = translations[lang];

    let isOpen = false;
    if (day >= 0 && day <= 4) { if (hour >= 9 && hour < 18) isOpen = true; } 
    else if (day === 5) { if (hour >= 9 && hour < 13) isOpen = true; }
    return { isOpen, message: isOpen ? t.statusOpen : t.statusClosed };
};

const heroBackgroundImage = 'https://wallup.net/wp-content/uploads/2016/01/239736-car-BMW-748x421.jpg';


// ===============================================================================================
// --- ✨ المكونات الفرعية المدمجة ---
// ===============================================================================================

// --- مكون العلامة التجارية ---
const BrandName: React.FC = () => (
    <span className="font-bold">
        <span className="text-blue-500">AQ</span>
        <span className="text-gray-300">///</span>
        <span className="text-red-500">bimmer</span>
    </span>
);

// --- مكون اختيار السيارة (ModelSelector) ---
const ModelSelector: React.FC<{ 
    onSelectionChange: (selection: any | null) => void; 
    t: any;
    bmwModels: any[];
    bmwYearsGenerations: any;
}> = ({ onSelectionChange, t, bmwModels, bmwYearsGenerations }) => {
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedModelName, setSelectedModelName] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedYearText, setSelectedYearText] = useState<string>('');
    const [selectedGeneration, setSelectedGeneration] = useState<string>('');
    const [selectedGenerationText, setSelectedGenerationText] = useState<string>('');

    const [availableYears, setAvailableYears] = useState<Array<{ value: string, text: string }>>([]);
    const [availableGenerations, setAvailableGenerations] = useState<Array<{ value: string, text: string }>>([]);

    useEffect(() => {
        setSelectedYear('');
        setSelectedGeneration('');
        setAvailableGenerations([]);
        if (selectedModel) {
            const modelData = (bmwYearsGenerations as any)[selectedModel];
            setAvailableYears(modelData ? modelData.years : []);
        } else {
            setAvailableYears([]);
        }
    }, [selectedModel, bmwYearsGenerations]);

    useEffect(() => {
        setSelectedGeneration('');
        if (selectedModel && selectedYear) {
            const modelData = (bmwYearsGenerations as any)[selectedModel];
            const yearData = modelData?.years.find((y: any) => y.value === selectedYear);
            setAvailableGenerations(yearData ? yearData.generations : []);
        } else {
            setAvailableGenerations([]);
        }
    }, [selectedYear, selectedModel, bmwYearsGenerations]);

    useEffect(() => {
        if (selectedModel && selectedYear && selectedGeneration) {
            onSelectionChange({
                model: selectedModel,
                modelName: selectedModelName,
                year: selectedYear,
                yearText: selectedYearText,
                generation: selectedGeneration,
                generationText: selectedGenerationText,
            });
        } else {
            onSelectionChange(null);
        }
    }, [selectedModel, selectedYear, selectedGeneration, selectedModelName, selectedYearText, selectedGenerationText, onSelectionChange]);

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const text = e.target.options[e.target.selectedIndex].text;
        setSelectedModel(value);
        setSelectedModelName(text);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const text = e.target.options[e.target.selectedIndex].text;
        setSelectedYear(value);
        setSelectedYearText(text);
    };

    const handleGenerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const text = e.target.options[e.target.selectedIndex].text;
        setSelectedGeneration(value);
        setSelectedGenerationText(text);
    };

    return (
        <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">{t.selectorTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label htmlFor="model-select" className="block text-white font-medium">{t.selectorSeries}</label>
                    <select id="model-select" value={selectedModel} onChange={handleModelChange} className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t.selectorSelectSeries}</option>
                        {bmwModels.map((model) => (<option key={model.value} value={model.value}>{model.text}</option>))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="year-select" className="block text-white font-medium">{t.selectorYear}</label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange} disabled={!selectedModel} className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                        <option value="">{t.selectorSelectYear}</option>
                        {availableYears.map((year) => (<option key={year.value} value={year.value}>{year.text}</option>))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="generation-select" className="block text-white font-medium">{t.selectorGeneration}</label>
                    <select id="generation-select" value={selectedGeneration} onChange={handleGenerationChange} disabled={!selectedYear} className="w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                        <option value="">{t.selectorSelectGeneration}</option>
                        {availableGenerations.map((generation) => (<option key={generation.value} value={generation.value}>{generation.text}</option>))}
                    </select>
                </div>
            </div>
        </div>
    );
};

// --- مكون تبديل اللغة (LanguageSwitcher) ---
const LanguageSwitcher: React.FC<{ language: LanguageCode; setLanguage: (lang: LanguageCode) => void; }> = ({ language, setLanguage }) => {
    const languages: { code: LanguageCode, name: string }[] = [
        { code: 'en', name: 'EN' },
        { code: 'he', name: 'HE' },
        { code: 'ar', name: 'AR' },
    ];
    return (
        <div className="flex items-center gap-x-2 text-sm">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded transition-colors ${language === lang.code ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
};


// --- باقي المكونات الفرعية ---
const HomeView: React.FC<{ 
    setView: (view: 'home' | 'activations') => void; 
    t: any; 
    language: LanguageCode; 
    showToolDetail: (tool: Tool) => void;
}> = ({ setView, t, language, showToolDetail }) => (
    <>
        <section className="relative text-center py-32 px-4 bg-cover bg-center rounded-lg overflow-hidden" style={{ backgroundImage: `url(${heroBackgroundImage})` }}>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg"><BrandName /></h1>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto text-shadow-md">{t.welcomeTitle}</p>
                <button onClick={() => setView('activations')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                    {t.discoverActivations}
                </button>
            </div>
        </section>

        <section className="my-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">{t.headerOurWork}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {ourWorkData.map((work, index) => (
                    <a href={work.link} key={index} className="block group">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 shadow-lg shadow-blue-500/10 h-full">
                            <img src={work.image_url} alt={work.title[language]} className="rounded-lg h-48 w-full object-cover mb-5 transition-transform duration-300 group-hover:scale-105" />
                            <h3 className="text-xl font-bold mb-2 text-white">{work.title[language]}</h3>
                            <p className="text-gray-300">{work.description[language]}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
        
        <section className="my-24" id="tools">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">{t.headerAqTools} <BrandName /></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {aqBimmerToolsData.map((tool) => (
                         <div key={tool.id} className="block group">
                            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 shadow-lg shadow-blue-500/10 flex flex-col items-center h-full">
                                <img src={tool.image_url} alt={t[tool.titleKey]} className="h-32 w-32 object-contain mb-5 transition-transform duration-300 group-hover:scale-110" />
                                <h3 className="text-xl font-bold mb-2 text-white">{t[tool.titleKey]}</h3>
                                <p className="text-gray-300 mb-4 flex-grow">{t[tool.descriptionKey]}</p>
                                <button onClick={() => showToolDetail(tool)} className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 inline-block">
                                   {t.toolViewDetails}
                                </button>
                            </div>
                        </div>
                ))}
            </div>
        </section>

        <section className="my-24">
            <h2 className="text-3xl font-bold mb-8 text-center">{t.servicesTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center shadow-lg shadow-blue-500/10"><h3 className="text-xl font-bold mb-2">{t.service1Title}</h3><p className="text-gray-300">{t.service1Desc}</p></div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center shadow-lg shadow-blue-500/10"><h3 className="text-xl font-bold mb-2">{t.service2Title}</h3><p className="text-gray-300">{t.service2Desc}</p></div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center shadow-lg shadow-blue-500/10"><h3 className="text-xl font-bold mb-2">{t.service3Title}</h3><p className="text-gray-300">{t.service3Desc}</p></div>
            </div>
        </section>
    </>
);

const ActivationsView: React.FC<{
    t: any;
    selectedCar: any;
    handleSelectionChange: (selection: any) => void;
    displayedActivations: ActivationInfo[];
    cart: CartItem[];
    addToCart: (activation: ActivationInfo) => void;
    showDetail: (activation: ActivationInfo) => void;
    language: LanguageCode;
    bmwModels: any[];
    bmwYearsGenerations: any;
}> = ({ t, selectedCar, handleSelectionChange, displayedActivations, cart, addToCart, showDetail, language, bmwModels, bmwYearsGenerations }) => {
    
    return (
        <section>
            <div className="container mx-auto">
                <ModelSelector onSelectionChange={handleSelectionChange} t={t} bmwModels={bmwModels} bmwYearsGenerations={bmwYearsGenerations}/>
                
                {selectedCar && (
                <div className="mt-16 bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-xl shadow-blue-500/10">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.activationsTitle} <span className="block text-xl text-blue-300 mt-2">{t.activationsFor} {selectedCar.modelName}</span></h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedActivations.map((act: ActivationInfo) => {
                            const isInCart = cart.some((item: CartItem) => item.id === act.id);
                            return (
                                <div key={act.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/20 hover:border-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 flex flex-col">
                                    {act.image_url && (<div className="h-48 w-full overflow-hidden"><img src={act.image_url} alt={act.title[language]} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/ffffff/png?text=Image+Not+Found'; }} /></div>)}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold mb-2 flex-grow">{act.title[language]}</h3>
                                        <div className="flex gap-x-2 mt-auto pt-4">
                                            <button onClick={() => showDetail(act)} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md transition text-sm">{t.viewDetails}</button>
                                            <button onClick={() => addToCart(act)} disabled={isInCart} className={`flex-1 text-white px-3 py-2 rounded-md transition text-sm ${isInCart ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>{isInCart ? t.addedToCart : t.addToCart}</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}
            </div>
        </section>
    );
};

const ContactSection: React.FC<{ t: any; contactRef: React.RefObject<HTMLElement>; language: LanguageCode; openingStatus: { isOpen: boolean; message: string; } }> = ({ t, contactRef, language, openingStatus }) => {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactMessage, setContactMessage] = useState('');
  
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const BASE_WEBHOOK_URL = "https://trigger.macrodroid.com/8913c37e-6263-401f-b576-d3537845c1a1/AQ";
        const queryParams = new URLSearchParams({ name: contactName, email: contactEmail, phone: contactPhone, message: contactMessage }).toString();
        try {
            const response = await fetch(`${BASE_WEBHOOK_URL}?${queryParams}`);
            // Use a more modern notification system instead of alert
            alert(response.ok ? t.contactSuccess : t.contactError(response.status));
            if (response.ok) { setContactName(''); setContactEmail(''); setContactPhone(''); setContactMessage(''); }
        } catch (error) {
            alert(t.contactNetworkError);
        }
    };
  
    return (
        <section id="contact" ref={contactRef} className="my-24">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl shadow-blue-500/10">
                <h2 className="text-3xl font-bold mb-8 text-center">{t.contactTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">{t.contactInfo}</h3>
                            <div className="space-y-3">
                                <p><strong>{t.contactPhone}:</strong><span dir="ltr" className="inline-block mx-2"><a href="tel:+972528180757" className="hover:text-blue-400">+972 52 818 0757</a></span></p>
                                <p><strong>{t.contactEmail}:</strong><span dir="ltr" className="inline-block mx-2"><a href="mailto:a.3cx.92@Gmail.com" className="hover:text-blue-400">a.3cx.92@Gmail.com</a></span></p>
                                <p><strong>{t.contactAddress}:</strong> {language === 'ar' ? 'الطيرة المثلث, إسرائيل' : language === 'he' ? 'טירה, ישראל' : 'Tira, Israel'}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">{t.businessHours}</h3>
                            <div className="space-y-2">
                                <p className="text-gray-300">{t.hoursSundayThursday}</p>
                                <p className="text-gray-300">{t.hoursFriday}</p>
                                <p className="text-gray-300">{t.hoursSaturday}</p>
                                <div className={`mt-4 text-lg font-bold p-3 rounded-md text-center ${openingStatus.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{openingStatus.message}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">{t.contactSendMessage}</h3>
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                            <input type="text" placeholder={t.contactFullName} className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactName} onChange={e => setContactName(e.target.value)} required />
                            <input type="email" placeholder={t.contactYourEmail} className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                            <input type="tel" placeholder={t.contactPhoneNumber} className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                            <textarea rows={4} placeholder={t.contactMessage} className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required></textarea>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-transform transform hover:scale-105">{t.contactSubmit}</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Footer: React.FC<{ t: any; }> = ({ t }) => (
    <footer className="bg-black/50 backdrop-blur-md py-8">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl"><BrandName /></h2>
            <p className="text-gray-400 mt-2">{t.footerSlogan}</p>
            <div className="mt-6">
                <a href="https://chat.whatsapp.com/HUAj4QH196hGSSeILo11Tj?mode=r_c" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 inline-block">
                    {t.whatsappGroupButton}
                </a>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6 text-gray-500 text-sm">
                <p>{t.footerRights(new Date().getFullYear())} <BrandName />. {t.footerRightsSuffix}</p>
            </div>
        </div>
    </footer>
);

const AiChatBox: React.FC<{ t: any; language: LanguageCode; }> = ({ t, language }) => {
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ sender: 'ai', text: t.toolAiWelcome }]);
    }, [t.toolAiWelcome]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userInput = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
        setInput('');
        setIsLoading(true);

        const prompt = `You are AQ///ai, a friendly and direct expert assistant for AQ///bimmer Tools. Your knowledge is based on the features described on the tool's page. Answer the user's question conversationally based ONLY on the tools' capabilities. User's question: "${userInput}". Respond in ${language}.`;
        
        // --- FIXED --- Using the correct API key
        const apiKey = "AIzaSyABTQjEatx39SqbuQTYT2zpLfjbz8mMdhc"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        try {
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.statusText}`);
            const data = await apiResponse.json();
            const aiResponse = data.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            // --- FIXED --- Using a valid translation key 'bimmerBotError' for the error message
            setMessages(prev => [...prev, { sender: 'ai', text: t.bimmerBotError }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full mr-3 bg-gradient-to-tr from-blue-500 to-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t.toolAiAssistantTitle}</h3>
            </div>
            <div ref={chatWindowRef} className="h-64 overflow-y-auto bg-black/40 p-3 rounded-lg space-y-4 mb-4" style={{ scrollbarWidth: 'thin' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg text-sm max-w-[85%] animate-fadeIn flex flex-col ${msg.sender === 'user' ? 'bg-gray-700/50 self-end ml-auto' : 'bg-blue-900/50 self-start'}`}>
                       {msg.text.split('\n').map((line, i) => <span key={i}>{line}</span>)}
                    </div>
                ))}
                {isLoading && (
                    <div className="p-3 bg-blue-900/50 rounded-lg self-start max-w-xs animate-fadeIn flex items-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1.5" style={{animationDelay: '0s'}}></div>
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1.5" style={{animationDelay: '0.1s'}}></div>
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    id="chat-input" 
                    placeholder={t.toolAiPlaceholder} 
                    className="flex-grow bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition disabled:bg-gray-500" disabled={isLoading}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    );
};

const ToolDetailView: React.FC<{
    t: any;
    tool: Tool;
    onBack: () => void;
    language: LanguageCode;
}> = ({ t, tool, onBack, language }) => {
    return (
        <main className="container mx-auto px-4 py-12 animate-fadeIn">
            <div className="mb-8">
                <button onClick={onBack} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition">&larr; {t.detailGoBack}</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 bg-black/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10">
                    <img src={tool.image_url} alt={t[tool.titleKey]} className="rounded-lg mb-6 w-full object-cover max-h-96" />
                    
                    <h2 className="text-3xl font-extrabold mb-2 text-blue-400">{t.toolDetailPageTitle}</h2>
                    <p className="text-lg text-gray-300 mb-8">{t.toolDetailPageDesc}</p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-l-4 border-red-500 pl-4">{t.toolFeaturesTitle}</h3>
                            <p className="text-gray-300 mb-3">{t.toolFeaturesDesc}</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-200 pl-4">
                                <li><strong className="text-white">{t.featureAllCoding.split(':')[0]}:</strong> {t.featureAllCoding.split(':')[1]}</li>
                                <li><strong className="text-white">{t.featureActivations.split(':')[0]}:</strong> {t.featureActivations.split(':')[1]}</li>
                                <li><strong className="text-white">{t.featureRetrofits.split(':')[0]}:</strong> {t.featureRetrofits.split(':')[1]}</li>
                                <li><strong className="text-white">{t.featureEvoHDD.split(':')[0]}:</strong> {t.featureEvoHDD.split(':')[1]}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-l-4 border-red-500 pl-4">{t.toolUpgradeTitle}</h3>
                            <p className="text-gray-300 mb-3">{t.toolUpgradeDesc}</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-200 pl-4">
                                <li><strong className="text-white">{t.featureFlashID4.split(':')[0]}:</strong> {t.featureFlashID4.split(':')[1]}</li>
                                <li><strong className="text-white">{t.featureEvoImage.split(':')[0]}:</strong> {t.featureEvoImage.split(':')[1]}</li>
                                <li><strong className="text-white">{t.featureFileTransfer.split(':')[0]}:</strong> {t.featureFileTransfer.split(':')[1]}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-l-4 border-red-500 pl-4">{t.toolMessageTitle}</h3>
                            <p className="text-gray-300 mb-3">{t.toolMessageDesc}</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-200 pl-4">
                               <li><strong className="text-white">{t.featureCC.split(':')[0]}:</strong> {t.featureCC.split(':')[1]}</li>
                               <li><strong className="text-white">{t.featureCopyText.split(':')[0]}:</strong> {t.featureCopyText.split(':')[1]}</li>
                               <li><strong className="text-white">{t.featureEsys.split(':')[0]}:</strong> {t.featureEsys.split(':')[1]}</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-l-4 border-red-500 pl-4">{t.toolPackageTitle}</h3>
                            <p className="text-gray-300 mb-4">{t.toolPackageDesc}</p>
                            <div className="flex flex-wrap items-center gap-6 bg-black/20 p-4 rounded-lg">
                                <img src="https://scontent.ftlv18-1.fna.fbcdn.net/v/t39.30808-6/518278183_745775568102956_1712913012265848888_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=cYhef8BS9I4Q7kNvwGvK9qO&_nc_oc=Adl218Adq0NqV4QbGqEVCwH5aZdn211MlgWROSjGkcxZf3-0RRlsTxN414J5xjJPXMU&_nc_zt=23&_nc_ht=scontent.ftlv18-1.fna&_nc_gid=-kObJVcn5hWoPoYQ1eeCbQ&oh=00_AfQCd7q572QjBLObZV3SMY-Ntcl_4Aa_f1PkXUOeM5JwaQ&oe=687C3B9E" className="w-32 h-32 object-cover rounded-lg border-2 border-white/20" alt="imageTool"/>
                                <ul className="list-disc list-inside space-y-2 text-gray-200">
                                   {t.toolList.map((item: string, index: number) => <li key={index}><strong className="text-blue-400">{item}</strong></li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <AiChatBox t={t} language={language} />
                    
                    <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center space-y-4 sticky top-24">
                        <h3 className="text-2xl font-bold">{t.toolGetPackage}</h3>
                        <p className="text-6xl font-extrabold text-blue-400 tracking-tighter">{t.toolPrice}</p>
                        <p className="text-gray-300 text-sm">{t.toolPaymentDesc}</p>
                        <a href="https://www.paypal.me/gopromaker" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 text-lg"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8.32 7.37C8.25 7.03 7.94 6.5 7.37 6.5H4.19c-.57 0-.94.36-.94.36-.1.25-.1.54-.04.8l1.37 6.95c.07.33.34.73.9.73h2.15c.6 0 .96-.36.96-.36.1-.25.1-.54.04-.8L8.32 7.37zm7.13-1.24c-.23-.9-1.04-1.63-2-1.63h-2.1c-.5 0-.8.25-.8.25-.15.1-.2.27-.2.42l.43 2.15.56 2.8c.08.34.36.74.9.74h.5c.6 0 .96-.36.96-.36.1-.25.1-.54.04-.8l-.8-4.04.02-.01zm5.32 1.34c-.1-.4-.44-.7-1.03-.7h-1.5L18 7.37c-.07-.33-.34-.73-.9-.73h-2.15c-.6 0-.96.36-.96-.36-.1.25-.1.54-.04.8l1.37 6.95c.07.33.34.73.9.73h2.15c.6 0 .96-.36.96-.36s.2-.18.28-.42l.2-1.04.4-2.07.13-.65.25-1.3c.03-.18.04-.37.04-.54 0-.4-.13-.7-.37-.93z"/></svg>{t.payWithPaypal}</a>
                        <a href="https://mega.nz/file/McESwRQb#Wz31bKtwTB1Yvjw2HWHWBiqldKr8KP5uMUzRQuTh3Lw" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 text-lg"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>{t.downloadSoftware}</a>
                        <a href="https://chat.whatsapp.com/HUAj4QH196hGSSeILo11Tj?mode=r_c" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 text-lg"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>{t.joinWhatsApp}</a>
                    </div>
                </div>
            </div>
        </main>
    );
};

// ===============================================================================================
// --- 🤖 مكون المساعد الذكي الجديد (BimmerBot) ---
// ===============================================================================================
const BimmerBot: React.FC<{ t: any; language: LanguageCode; }> = ({ t, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    // Initialize with a welcome message when the bot is opened for the first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: t.bimmerBotWelcome }]);
        }
    }, [isOpen, messages.length, t.bimmerBotWelcome]);
    
    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userInput = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
        setInput('');
        setIsLoading(true);

        // This prompt instructs Gemini on its role, context, and response language.
        const prompt = `You are BimmerBot, a friendly and knowledgeable expert assistant for the "AQ///bimmer" company, which specializes in BMW coding and activations. Your goal is to help users by answering their questions about available activations, features, compatibility, and pricing. Base your answers on the provided data and general BMW knowledge. Be encouraging and helpful. The user is asking: "${userInput}". Please respond in ${language}.`;

        // --- FIXED --- Using the correct API key
        const apiKey = "AIzaSyABTQjEatx39SqbuQTYT2zpLfjbz8mMdhc"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        try {
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.statusText}`);
            const data = await apiResponse.json();
            const aiResponse = data.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("BimmerBot Gemini API Error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: t.bimmerBotError }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[70%] max-h-[500px] bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <BrandName /> AI
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div ref={chatWindowRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 max-w-[85%] mr-auto">
                            <div className="p-3 rounded-2xl bg-gray-700 rounded-bl-none flex items-center">
                               <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1.5" style={{animationDelay: '0s'}}></div>
                               <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1.5" style={{animationDelay: '0.1s'}}></div>
                               <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-white/10 flex gap-2">
                    <input
                        type="text"
                        placeholder={t.bimmerBotPlaceholder}
                        className="flex-grow bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition disabled:bg-gray-500" disabled={isLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </div>

            {/* Floating Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-4 left-4 bg-gradient-to-br from-blue-600 to-red-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </button>
        </>
    );
};


// ===============================================================================================
// --- 🎨 مكون عرض تفاصيل التفعيل الجديد ---
// ===============================================================================================
const ActivationDetailView: React.FC<{
    activation: ActivationInfo;
    similarActivations: ActivationInfo[];
    selectedCar: any;
    t: any;
    language: LanguageCode;
    onBack: () => void;
    onAddToCart: (activation: ActivationInfo) => void;
    onShowDetail: (activation: ActivationInfo) => void;
}> = ({ activation, similarActivations, selectedCar, t, language, onBack, onAddToCart, onShowDetail }) => {
    
    const [benefits, techDetails] = useMemo(() => {
        const desc = activation.description?.[language] || "";
        const parts = desc.split('---');
        return [parts[0], parts[1] || null];
    }, [activation.description, language]);

    const whatsappMessage = encodeURIComponent(`${t.contactCarInquiry} BMW ${selectedCar?.modelName || ''} - ${activation.title[language]}`);
    const whatsappLink = `https://wa.me/972528180757?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen p-4 sm:p-8 animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition">&larr; {t.detailGoBack}</button>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
                            <img src={activation.image_url} alt={activation.title[language]} className="w-full h-64 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/1a1a1a/ffffff/png?text=Image+Not+Found'; }}/>
                            <div className="p-6 sm:p-8">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-400">{activation.title[language]}</h2>
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2 text-red-400">{t.detailBenefits}</h3>
                                    <p className="text-gray-200 leading-relaxed">{benefits}</p>
                                </div>
                                
                                {techDetails && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2 text-red-400">{t.detailTechDetails}</h3>
                                        <p className="text-gray-300 leading-relaxed font-mono text-sm">{techDetails}</p>
                                    </div>
                                )}
                                {activation.ecu && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2 text-red-400">{t.detailECU}</h3>
                                        <p className="text-gray-200 font-mono bg-black/20 px-3 py-1 rounded-md inline-block">{activation.ecu}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 space-y-6">
                             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 text-center">
                                <p className="text-5xl font-extrabold text-blue-300">{activation.price}₪</p>
                                <div className="flex flex-col gap-3 mt-6">
                                    <button onClick={() => onAddToCart(activation)} className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition text-lg font-bold">{t.addToCart}</button>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-md transition text-lg font-bold">{t.inquireOnWhatsApp}</a>
                                </div>
                            </div>
                            {similarActivations.length > 0 && (
                                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4">{t.detailSimilarActivations}</h3>
                                    <div className="space-y-4">
                                        {similarActivations.map(simAct => (
                                            <div key={simAct.id} onClick={() => onShowDetail(simAct)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                                                <img src={simAct.image_url} alt={simAct.title[language]} className="w-16 h-16 rounded-md object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1a1a1a/ffffff/png?text=...'; }} />
                                                <div>
                                                    <h4 className="font-semibold">{simAct.title[language]}</h4>
                                                    <p className="text-sm text-blue-400">{simAct.price}₪</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===============================================================================================
// --- 🚀 المكون الرئيسي للصفحة (HomePage) ---
// ===============================================================================================
const HomePage: React.FC = () => {
    // --- الحالات (States) ---
    const [language, setLanguage] = useState<LanguageCode>('ar');
    const [view, setView] = useState<'home' | 'activations'>('home');
    const [selectedCar, setSelectedCar] = useState<any | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentDetailedActivation, setCurrentDetailedActivation] = useState<ActivationInfo | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentTool, setCurrentTool] = useState<Tool | null>(null);
    
    // --- ✅ حالات جديدة للبيانات الديناميكية ---
    const [bmwModels, setBmwModels] = useState<any[]>([]);
    const [bmwYearsGenerations, setBmwYearsGenerations] = useState<any>({});
    const [bmwData, setBmwData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // --- المراجع (Refs) ---
    const contactRef = useRef<HTMLElement>(null);
    const t = translations[language];
    const openingStatus = getOpeningHoursStatus(language);

    // --- التأثيرات (Effects) ---
    useEffect(() => {
        document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
        document.documentElement.lang = language;
    }, [language]);

    // --- ✅ جلب البيانات عند تحميل المكون ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const repoBaseUrl = 'https://raw.githubusercontent.com/tiraUnderCode23/BMW/main/src/data';
            try {
                const [modelsRes, yearsRes, dataRes] = await Promise.all([
                    fetch(`${repoBaseUrl}/bmw_models.json`),
                    fetch(`${repoBaseUrl}/bmw_years_generations.json`),
                    fetch(`${repoBaseUrl}/bmw_data.json`)
                ]);

                if (!modelsRes.ok || !yearsRes.ok || !dataRes.ok) {
                    throw new Error('Network response was not ok');
                }

                const modelsData = await modelsRes.json();
                const yearsData = await yearsRes.json();
                const mainData = await dataRes.json();

                setBmwModels(modelsData);
                setBmwYearsGenerations(yearsData);
                setBmwData(mainData);

            } catch (error) {
                console.error("Failed to fetch BMW data:", error);
                // يمكنك عرض رسالة خطأ للمستخدم هنا
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- ✅ منطق عرض التفعيلات المُحسَّن ---
    const displayedActivations = useMemo((): ActivationInfo[] => {
        // دالة مساعدة لتحويل بيانات التفعيلات إلى الواجهة المطلوبة
        const mapActivations = (activations: any[]): ActivationInfo[] => {
            return activations.map((act: any, index: number) => ({
                id: act.id || (Date.now() + index), // استخدام ID فريد كحل بديل
                title: typeof act.title === 'string' ? { en: act.title, ar: act.title, he: act.title } : act.title,
                description: typeof act.description === 'string' ? { en: act.description, ar: act.description, he: act.description } : act.description,
                category: typeof act.category === 'string' ? { en: act.category, ar: act.category, he: act.category } : act.category,
                price: act.price,
                image_url: act.image_url,
                ecu: act.ecu,
            }));
        };

        if (!selectedCar || !selectedCar.model || !selectedCar.year || !selectedCar.generation || bmwData.length === 0) {
            return [];
        }

        const modelData = bmwData.find(m => m.model === selectedCar.model);
        if (modelData) {
            const yearData = modelData.years.find((y: any) => y.value === selectedCar.year);
            if (yearData) {
                const genData = yearData.generations.find((g: any) => g.value === selectedCar.generation);
                if (genData && genData.activations && genData.activations.length > 0) {
                    return mapActivations(genData.activations);
                }
            }
        }
        
        const family = selectedCar.model.charAt(0).toLowerCase(); // 'f' or 'g'
        for (const fallbackModel of bmwData) {
            if (fallbackModel.model.charAt(0).toLowerCase() === family) {
                for (const fallbackYear of fallbackModel.years) {
                    for (const fallbackGen of fallbackYear.generations) {
                        if (fallbackGen.activations && fallbackGen.activations.length > 0) {
                            console.log(`No exact match found. Falling back to activations from ${fallbackModel.model} for family '${family}'.`);
                            return mapActivations(fallbackGen.activations);
                        }
                    }
                }
            }
        }
        
        return [];
    }, [selectedCar, bmwData]);

    const handleSelectionChange = (selection: any) => setSelectedCar(selection);
    
    const addToCart = (activation: ActivationInfo) => {
        if (!selectedCar) { alert("Please select your car first!"); return; }
        if (cart.some(item => item.id === activation.id)) return;
        const newItem: CartItem = { 
            ...activation, 
            carModelName: selectedCar.modelName, 
            carYear: selectedCar.yearText, 
            carGeneration: selectedCar.generationText 
        };
        setCart([...cart, newItem]);
        setIsCartOpen(true); // Open cart after adding item
    };

    const showDetail = (act: ActivationInfo) => {
        setCurrentDetailedActivation(act);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id));
    
    const calculateTotal = () => cart.reduce((total, item) => total + (item.price ? parseInt(item.price.toString(), 10) : 0), 0);
    
    const showToolDetail = (tool: Tool) => {
        setCurrentTool(tool);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToMain = () => {
        setCurrentTool(null);
        setCurrentDetailedActivation(null);
        setView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const similarActivations = useMemo(() => {
        if (!currentDetailedActivation || displayedActivations.length === 0) return [];
        return displayedActivations
            .filter(act => act.category?.[language] === currentDetailedActivation.category?.[language] && act.id !== currentDetailedActivation.id)
            .slice(0, 3);
    }, [currentDetailedActivation, displayedActivations, language]);
    
    // --- ✅ عرض مؤشر التحميل ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-contain bg-center bg-no-repeat animate-pulse" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg)' }}></div>
                    <span className="text-xl">Loading Latest Activations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="fixed inset-0 -z-20 overflow-hidden">
                <img src={heroBackgroundImage} alt="Background" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            </div>
            
            <header className="bg-black/30 backdrop-blur-md p-4 shadow-lg sticky top-0 z-40">
              <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={handleBackToMain} className="flex items-center">
                            <div className="w-12 h-12 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg)' }}></div>
                            <h1 className="text-2xl mx-3"><BrandName /></h1>
                        </button>
                    </div>
                    <nav className="hidden md:flex items-center">
                        <ul className="flex items-center gap-x-6">
                            <li><button onClick={handleBackToMain} className="hover:text-blue-400 transition">{t.headerHome}</button></li>
                            <li><button onClick={() => { setCurrentDetailedActivation(null); setCurrentTool(null); setView('activations'); }} className="hover:text-blue-400 transition">{t.headerActivations}</button></li>
                            <li><button onClick={() => { const el = document.getElementById('tools'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="font-bold text-yellow-400 hover:text-yellow-300 transition">{t.headerAqTools}</button></li>
                            <li><a href="https://aqbimmer.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-green-400 hover:text-green-300 transition">{t.headerCodingVip}</a></li>
                            <li><button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 transition">{t.headerContact}</button></li>
                        </ul>
                    </nav>
                    <div className="flex items-center gap-x-4">
                        <LanguageSwitcher language={language} setLanguage={setLanguage} />
                        <button onClick={() => setIsCartOpen(true)} className="relative hover:text-blue-400 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>}
                        </button>
                        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 bg-black/50 backdrop-blur-lg">
                        <ul className="flex flex-col items-center gap-y-4 p-4">
                           <li><button onClick={() => { handleBackToMain(); setIsMobileMenuOpen(false); }} className="hover:text-blue-400 transition">{t.headerHome}</button></li>
                           <li><button onClick={() => { setCurrentDetailedActivation(null); setCurrentTool(null); setView('activations'); setIsMobileMenuOpen(false); }} className="hover:text-blue-400 transition">{t.headerActivations}</button></li>
                           <li><button onClick={() => { const el = document.getElementById('tools'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="font-bold text-yellow-400 hover:text-yellow-300 transition">{t.headerAqTools}</button></li>
                           <li><button onClick={() => { contactRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="hover:text-blue-400 transition">{t.headerContact}</button></li>
                           <li><a href="https://aqbimmer.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-green-400 hover:text-green-300 transition">{t.headerCodingVip}</a></li>
                        </ul>
                    </div>
                )}
            </header>

            {isCartOpen && <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div><div className={`absolute top-0 h-full w-full max-w-md bg-gray-900 shadow-xl transform transition-transform duration-300 ${language==='en'?'right-0':'left-0'} ${isCartOpen?'translate-x-0':(language==='en'?'translate-x-full':'-translate-x-full')}`}><div className="flex h-full flex-col"><div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6"><div className="flex items-start justify-between"><h2 className="text-lg font-medium">{t.cartTitle}</h2><button onClick={() => setIsCartOpen(false)}>&times;</button></div><div className="mt-8">{cart.length===0?(<div className="text-center py-12"><h3 className="text-lg font-medium">{t.cartEmptyTitle}</h3><p className="mt-1 text-gray-500">{t.cartEmptyMessage}</p></div>):(<ul className="-my-6 divide-y divide-gray-700">{cart.map(item=>(<li key={item.id} className="flex py-6"><div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700"><img src={item.image_url} alt={item.title?.[language]} className="h-full w-full object-cover"/></div><div className="mx-4 flex flex-1 flex-col"><div><div className="flex justify-between text-base font-medium"><h3>{item.title?.[language]}</h3><p className="ml-4 text-blue-400">{item.price}₪</p></div><p className="mt-1 text-sm text-gray-400">{`${item.carModelName} ${item.carYear} ${item.carGeneration}`}</p></div><div className="flex flex-1 items-end justify-between text-sm"><p className="text-gray-400">{item.category?.[language]}</p><button onClick={()=>removeFromCart(item.id)} className="font-medium text-red-500 hover:text-red-400">{t.cartRemove}</button></div></div></li>))}</ul>)}</div></div>{cart.length>0&&(<div className="border-t border-gray-700 py-6 px-4 sm:px-6"><div className="flex justify-between text-base font-medium"><p>{t.cartTotal}</p><p className="text-blue-400">{calculateTotal()}₪</p></div><div className="mt-6"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition">{t.cartCheckout}</button></div></div>)}</div></div></div>}
            
            {/* Main Content Router */}
            <div className="flex-grow">
                {currentDetailedActivation ? (
                    <ActivationDetailView
                        activation={currentDetailedActivation}
                        similarActivations={similarActivations}
                        selectedCar={selectedCar}
                        t={t}
                        language={language}
                        onBack={() => setCurrentDetailedActivation(null)}
                        onAddToCart={addToCart}
                        onShowDetail={showDetail}
                    />
                ) : currentTool ? (
                    <ToolDetailView 
                        t={t} 
                        tool={currentTool} 
                        onBack={() => setCurrentTool(null)}
                        language={language}
                    />
                ) : (
                    <main className="container mx-auto px-4 py-8">
                        {view === 'home' ? (
                            <HomeView setView={setView} t={t} language={language} showToolDetail={showToolDetail} />
                        ) : (
                            <ActivationsView
                                t={t}
                                selectedCar={selectedCar}
                                handleSelectionChange={handleSelectionChange}
                                displayedActivations={displayedActivations}
                                cart={cart}
                                addToCart={addToCart}
                                showDetail={showDetail}
                                language={language}
                                bmwModels={bmwModels}
                                bmwYearsGenerations={bmwYearsGenerations}
                            />
                        )}
                        <ContactSection t={t} contactRef={contactRef} language={language} openingStatus={openingStatus} />
                    </main>
                )}
            </div>

            <Footer t={t} />
            <WhatsAppWidget />
            <BimmerBot t={t} language={language} />
        </div>
    );
};

export default HomePage;
