import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import ModelSelector from '../components/bmw/ModelSelector';
import bmwModelData from '../data/bmw_data.json';
import WhatsAppWidget from '../components/WhatsAppWidget';

const translations = {
  en: {
    brandName1: "AQ", brandName2: "bimmer", headerHome: "Home", headerActivations: "Activations", headerServices: "Services", headerContact: "Contact Us", cartTitle: "Shopping Cart", cartEmptyTitle: "Your cart is empty", cartEmptyMessage: "Add some activations to your cart", cartTotal: "Subtotal", cartTaxes: "Taxes and shipping calculated at checkout.", cartCheckout: "Checkout", cartContinueShopping: "Continue Shopping", cartRemove: "Remove", welcomeTitle: "", activationsTitle: "Available Activations", activationsFor: "For", viewDetails: "View Details", addToCart: "Add to Cart", addedToCart: "Added", servicesTitle: "Our Services", service1Title: "Advanced Programming", service1Desc: "Activate all hidden features in your car professionally and safely.", service2Title: "Unlimited Warranty", service2Desc: "We offer a lifetime warranty on all programming services.", service3Title: "Online Services", service3Desc: "Remote car programming and modification over the internet.", service3Req: "Requirements", detailDescription: "Description", detailECU: "ECU", detailSteps: "Activation Steps", detailNoSteps: "No specific activation steps available for this item.", detailSimplifiedExplanation: "Simplified Explanation ✨", detailActivationMethod: "Activation Method ✨", detailLLMTitleSimplified: "Simplified Explanation", detailLLMTitleSteps: "Activation Method", detailGoBack: "Back to List", contactTitle: "Contact Us", contactInfo: "Contact Information", contactPhone: "Phone", contactEmail: "Email", contactAddress: "Address", contactSendMessage: "Send us a message", contactFullName: "Full Name", contactYourEmail: "Email Address", contactPhoneNumber: "Phone Number", contactMessage: "Message", contactSubmit: "Send Message", contactSuccess: "Your message has been sent successfully!", contactError: (status: number) => `Error sending message. Code: ${status}.`, contactNetworkError: "Network error. Please check your connection.", contactCarInquiry: "I would like to inquire about activations for the car:", contactModelYear: "model", contactGeneration: "generation", contactCartItems: "Activations in cart:", footerRights: (year: number) => `© ${year} AQ///bimmer. All rights reserved.`, footerSlogan: "Professional BMW Programming Services", businessHours: "Business Hours", hoursSundayThursday: "Sunday - Thursday: 9:00 AM - 22:00 PM", hoursFriday: "Friday: 9:00 AM - 5:00 PM", hoursSaturday: "Saturday: Closed", statusOpen: "We're Open!", statusClosed: "We're Closed.",
    selectorTitle: "Choose Your BMW", selectorSeries: "Series", selectorSelectSeries: "Select Series...", selectorYear: "Year", selectorSelectYear: "Select Year...", selectorGeneration: "Generation (Model)", selectorSelectGeneration: "Select Generation...",
    paymentSuccess: "Payment successful! Thank you for your purchase.",
    paymentError: "An error occurred during payment. Please try again.",
    paymentCancelled: "The payment was cancelled.",
    cannotCheckoutWithZero: "Cannot checkout with a total of zero."
  },
  ar: {
    brandName1: "AQ", brandName2: "bimmer", headerHome: "الرئيسية", headerActivations: "التفعيلات", headerServices: "الخدمات", headerContact: "تواصل معنا", cartTitle: "سلة التسوق", cartEmptyTitle: "سلة التسوق فارغة", cartEmptyMessage: "أضف بعض التفعيلات إلى سلتك", cartTotal: "المجموع", cartTaxes: "الضرائب والشحن تحسب عند الدفع.", cartCheckout: "اتمام الطلب", cartContinueShopping: "متابعة التسوق", cartRemove: "إزالة", welcomeTitle: "", activationsTitle: "التفعيلات المتاحة", activationsFor: "لـ", viewDetails: "عرض التفاصيل", addToCart: "إضافة للسلة", addedToCart: "تمت الإضافة", servicesTitle: "خدماتنا", service1Title: "برمجة متقدمة", service1Desc: "تفعيل جميع الخصائص المخفية في سيارتك باحترافية وأمان تام.", service2Title: "ضمان غير محدود", service2Desc: "نقدم ضمان شامل مدى الحياة على جميع خدمات البرمجة.", service3Title: "خدمات اونلاين", service3Desc: "برمجة وتعديل السيارة عن بعد من خلال الإنترنت.", service3Req: "المتطلبات", detailDescription: "الوصف", detailECU: "الوحدة (ECU)", detailSteps: "خطوات التفعيل", detailNoSteps: "لا تتوفر خطوات تفعيل محددة لهذا البند.", detailSimplifiedExplanation: "شرح مبسط ✨", detailActivationMethod: "طريقة التفعيل ✨", detailLLMTitleSimplified: "شرح مبسط للتفعيل", detailLLMTitleSteps: "طريقة التفعيل", detailGoBack: "العودة إلى القائمة", contactTitle: "تواصل معنا", contactInfo: "معلومات التواصل", contactPhone: "الهاتف", contactEmail: "البريد الإلكتروني", contactAddress: "العنوان", contactSendMessage: "أرسل لنا رسالة", contactFullName: "الاسم الكامل", contactYourEmail: "البريد الإلكتروني", contactPhoneNumber: "رقم الهاتف", contactMessage: "الرسالة", contactSubmit: "إرسال الرسالة", contactSuccess: "تم إرسال رسالتك بنجاح!", contactError: (status: number) => `حدث خطأ أثناء إرسال الرسالة. رمز الخطأ: ${status}.`, contactNetworkError: "حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت.", contactCarInquiry: "أود الاستفسار عن تفعيلات لسيارة:", contactModelYear: "موديل", contactGeneration: "جيل", contactCartItems: "التفعيلات المطلوبة في السلة:", footerRights: (year: number) => `© ${year} AQ///bimmer.`, footerSlogan: "خدمات برمجة سيارات BMW الاحترافية", businessHours: "ساعات العمل", hoursSundayThursday: "الأحد - الخميس: 9:00 ص - 22:00 م", hoursFriday: "الجمعة: 9:00 ص - 5:00 م", hoursSaturday: "السبت: مغلق", statusOpen: "نحن متواجدون الآن!", statusClosed: "نحن مغلقون الآن.",
    selectorTitle: "اختر سيارتك البي ام دبليو", selectorSeries: "السلسلة", selectorSelectSeries: "اختر السلسلة...", selectorYear: "سنة الصنع", selectorSelectYear: "اختر السنة...", selectorGeneration: "الجيل (موديل)", selectorSelectGeneration: "اختر الجيل...",
    paymentSuccess: "تم الدفع بنجاح! شكراً لشرائك.",
    paymentError: "حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى.",
    paymentCancelled: "تم إلغاء عملية الدفع.",
    cannotCheckoutWithZero: "لا يمكن إتمام الشراء بمبلغ صفر."
  },
  he: {
    brandName1: "AQ", brandName2: "bimmer", headerHome: "ראשי", headerActivations: "הפעלות", headerServices: "שירותים", headerContact: "צור קשר", cartTitle: "עגלת קניות", cartEmptyTitle: "העגלה שלך ריקה", cartEmptyMessage: "הוסף כמה הפעלות לעגלה שלך", cartTotal: "סכום ביניים", cartTaxes: "מיסים ומשלוח יחושבו בקופה.", cartCheckout: "לתשלום", cartContinueShopping: "המשך בקניות", cartRemove: "הסר", welcomeTitle: "", activationsTitle: "הפעלות זמינות", activationsFor: "עבור", viewDetails: "צפה בפרטים", addToCart: "הוסף לעגלה", addedToCart: "נוסף לעגלה", servicesTitle: "השירותים שלנו", service1Title: "תכנות מתקדם", service1Desc: "הפעל את כל התכונות הנסתרות ברכבך במקצועיות ובבטיחות מלאה.", service2Title: "אחריות ללא הגבלה", service2Desc: "אנו מציעים אחריות לכל החיים על כל שירותי התכנות.", service3Title: "שירותים מקוונים", service3Desc: "תכנות ושינוי רכבים מרחוק דרך האינטרנט.", service3Req: "דרישות", detailDescription: "תיאור", detailECU: "ECU", detailSteps: "שלבי הפעלה", detailNoSteps: "אין שלבי הפעלה ספציפיים זמינים עבור פריט זה.", detailSimplifiedExplanation: "הסבר פשוט ✨", detailActivationMethod: "שיטת הפעלה ✨", detailLLMTitleSimplified: "הסבר פשוט", detailLLMTitleSteps: "שיטת הפעלה", detailGoBack: "חזור לרשימה", contactTitle: "צור קשר", contactInfo: "פרטי התקשרות", contactPhone: "טלפון", contactEmail: "אימייל", contactAddress: "כתובת", contactSendMessage: "שלח לנו הודעה", contactFullName: "שם מלא", contactYourEmail: "כתובת אימייל", contactPhoneNumber: "מספר טלפון", contactMessage: "הודעה", contactSubmit: "שלח הודעה", contactSuccess: "הודעתך נשלחה בהצלחה!", contactError: (status: number) => `אירעה שגיאה בשליחת ההודעה. קוד שגיאה: ${status}.`, contactNetworkError: "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט.", contactCarInquiry: "ברצוני לברר לגבי הפעלות לרכב:", contactModelYear: "מודל", contactGeneration: "דור", contactCartItems: "הפעלות מבוקשות בעגלה:", footerRights: (year: number) => `© ${year} AQ///bimmer. כל הזכויות שמורות.`, footerSlogan: "שירותי תכנות מקצועיים ל-BMW", businessHours: "שעות פעילות", hoursSundayThursday: "ראשון - חמישי: 09:00 - 22:00", hoursFriday: "שישי: 09:00 - 17:00", hoursSaturday: "שבת: סגור", statusOpen: "אנחנו פתוחים!", statusClosed: "אנחנו סגורים.",
    selectorTitle: "בחר את רכב ה-BMW שלך", selectorSeries: "סדרה", selectorSelectSeries: "בחר סדרה...", selectorYear: "שנת ייצור", selectorSelectYear: "בחר שנה...", selectorGeneration: "דור (דגם)", selectorSelectGeneration: "בחר דור...",
    paymentSuccess: "התשלום בוצע בהצלחה! תודה על רכישתך.",
    paymentError: "אירעה שגיאה במהלך התשלום. אנא נסה שוב.",
    paymentCancelled: "התשלום בוטל.",
    cannotCheckoutWithZero: "לא ניתן לשלם סכום של אפס."
  },
};

const masterActivationList = [ ...new Map(bmwModelData.flatMap(model => model.years.flatMap(year => year.generations.flatMap(gen => gen.activations))).map(item => [item.id, item])).values() ];

interface ActivationInfo {
  id: number;
  title: { [key: string]: string };
  description?: { [key: string]: string };
  category?: { [key: string]: string };
  image_url?: string;
  price?: string | number;
  ecu?: string;
}

interface CartItem extends ActivationInfo {
  carModelName: string;
  carYear: string;
}

const getOpeningHoursStatus = (lang: 'ar' | 'en' | 'he') => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const t = translations[lang];
  let isOpen = false;
  // Sunday to Thursday (0-4)
  if (day >= 0 && day <= 4) {
    if (hour >= 9 && hour < 22) isOpen = true;
  } 
  // Friday (5)
  else if (day === 5) {
    if (hour >= 9 && hour <17) isOpen = true;
  }
  return { isOpen, message: isOpen ? t.statusOpen : t.statusClosed };
};

const backgroundImages = [
  'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://wallpapercave.com/wp/wp12515131.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
'https://applescoop.org/image/wallpapers/mac/bmw-m4-m-series-artwork-4k-01-11-2024-1730444935-hd-wallpaper.jpg',
];

const heroBackgroundImage = 'https://c4.wallpaperflare.com/wallpaper/335/573/302/car-vehicle-reflection-bmw-wallpaper-preview.jpg';

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en' | 'he'>('ar');
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentDetailedActivation, setCurrentDetailedActivation] = useState<ActivationInfo | null>(null);
  const [llmResponse, setLlmResponse] = useState<{ title: string; content: string } | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const activationsRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const t = translations[language];
  const openingStatus = getOpeningHoursStatus(language);

  useEffect(() => {
    document.title = "AQ Bimmer | خدمات برمجة BMW";
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const carInfo = selectedCar ? `${t.contactCarInquiry} BMW ${selectedCar.modelName} (${t.contactModelYear} ${selectedCar.yearText}, ${t.contactGeneration} ${selectedCar.generationText}).` : '';
    const cartItemsText = cart.length > 0 ? `\n\n${t.contactCartItems}\n${cart.map(item => `- ${item.title?.[language] || ''}`).join('\n')}` : '';
    setContactMessage(`${carInfo}${cartItemsText}`);
  }, [selectedCar, cart, language, t]);

  const handleSelectionChange = (selection: any) => {
    setSelectedCar(selection);
  };

  const addToCart = (activation: ActivationInfo) => {
    if (!selectedCar) {
      alert("Please select your car first!");
      return;
    }
    if (cart.some(item => item.id === activation.id)) return;
    const newItem: CartItem = { ...activation, carModelName: selectedCar.modelName, carYear: selectedCar.yearText };
    setCart([...cart, newItem]);
  };

  const showDetail = (act: ActivationInfo) => {
    setCurrentDetailedActivation(act);
    setLlmResponse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price ? parseInt(item.price.toString(), 10) : 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const BASE_WEBHOOK_URL = "https://trigger.macrodroid.com/9519b967-983a-4878-a3c7-7d9560ffa0f7/bmw";
    const queryParams = new URLSearchParams({ name: contactName, email: contactEmail, phone: contactPhone, message: contactMessage }).toString();
    try {
      const response = await fetch(`${BASE_WEBHOOK_URL}?${queryParams}`);
      alert(response.ok ? t.contactSuccess : t.contactError(response.status));
      if (response.ok) {
        setContactName('');
        setContactEmail('');
        setContactPhone('');
      }
    } catch (error) {
      alert(t.contactNetworkError);
    }
  };

  const simulateGeminiAPI = async (_prompt: string, titleKey: 'detailLLMTitleSimplified' | 'detailLLMTitleSteps') => {
    if (!currentDetailedActivation) return;
    setLlmLoading(true);
    setLlmResponse(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let simulatedContent = currentDetailedActivation.description?.[language] || t.detailNoSteps;
    setLlmResponse({ title: t[titleKey], content: simulatedContent });
    setLlmLoading(false);
  };

  const displayedActivations = useMemo(() => {
    if (!selectedCar) return masterActivationList;
    const modelData = bmwModelData.find(m => m.model === selectedCar.model);
    const yearData = modelData?.years.find(y => y.value === selectedCar.year);
    const genData = yearData?.generations.find(g => g.value === selectedCar.generation);
    return genData ? genData.activations : [];
  }, [selectedCar]);
    
  // ✨ بداية التعديل: تم نقل حاوية الخلفية الرئيسية لتشمل كل المحتوى ✨
  return (
    <div className="min-h-screen bg-transparent text-white font-sans" dir={language === 'en' ? 'ltr' : 'rtl'}>
      {/* حاوية الخلفية أصبحت الآن تشمل كل شيء */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <img
          src={backgroundImages[currentBgIndex]}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: 1 }}
        />
        <div className="absolute inset-0 bg-transparent/50"></div>
      </div>
      
      <header className="bg-transparent backdrop-blur-md p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg)' }}></div>
            <h1 className="text-2xl font-bold mx-3"><span className="text-blue-500">{t.brandName1}</span>///<span className="text-red-500">{t.brandName2}</span></h1>
          </div>
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-x-6">
              <li><button onClick={() => { setCurrentDetailedActivation(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-400 transition">{t.headerHome}</button></li>
              <li><button onClick={() => { setCurrentDetailedActivation(null); setTimeout(() => activationsRef.current?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="hover:text-blue-400 transition">{t.headerActivations}</button></li>
              <li><button onClick={() => { setCurrentDetailedActivation(null); setTimeout(() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="hover:text-blue-400 transition">{t.headerServices}</button></li>
              <li><button onClick={() => { setCurrentDetailedActivation(null); setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="hover:text-blue-400 transition">{t.headerContact}</button></li>
            </ul>
          </nav>
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2 text-sm">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>EN</button>
              <button onClick={() => setLanguage('he')} className={`px-2 py-1 rounded transition-colors ${language === 'he' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>עב</button>
              <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded transition-colors ${language === 'ar' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>AR</button>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-blue-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>
      
      {/* ✨ بداية التعديل: تم تغيير خلفية سلة التسوق لتكون شفافة ✨ */}
      {isCartOpen && <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div><div className={`absolute top-0 h-full w-full max-w-md bg-gray-900/80 backdrop-blur-lg border-white/10 shadow-xl transform transition-transform duration-300 ${language==='en'?'right-0 border-l':'left-0 border-r'} ${isCartOpen?'translate-x-0':(language==='en'?'translate-x-full':'-translate-x-full')}`}><div className="flex h-full flex-col"><div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6"><div className="flex items-start justify-between"><h2 className="text-lg font-medium">{t.cartTitle}</h2><button onClick={() => setIsCartOpen(false)}>&times;</button></div><div className="mt-8">{cart.length===0?(<div className="text-center py-12"><h3 className="text-lg font-medium">{t.cartEmptyTitle}</h3><p className="mt-1 text-gray-500">{t.cartEmptyMessage}</p></div>):(<ul className="-my-6 divide-y divide-gray-700">{cart.map(item=>(<li key={item.id} className="flex py-6"><div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700"><img src={item.image_url} alt={item.title?.[language]} className="h-full w-full object-cover"/></div><div className="mx-4 flex flex-1 flex-col"><div><div className="flex justify-between text-base font-medium"><h3>{item.title?.[language]}</h3><p className="ml-4 text-blue-400">{item.price}₪</p></div><p className="mt-1 text-sm text-gray-400">{item.carModelName} {item.carYear}</p></div><div className="flex flex-1 items-end justify-between text-sm"><p className="text-gray-400">{item.category?.[language]}</p><button onClick={()=>removeFromCart(item.id)} className="font-medium text-red-500 hover:text-red-400">{t.cartRemove}</button></div></div></li>))}</ul>)}</div></div>
      
      {cart.length>0&&(
        <div className="border-t border-gray-700 py-6 px-4 sm:px-6">
          <div className="flex justify-between text-base font-medium">
            <p>{t.cartTotal}</p>
            <p className="text-blue-400">{calculateTotal()}₪</p>
          </div>
          <div className="mt-6">
            <PayPalScriptProvider options={{ clientId: "AUVXcUrHWwZ_osRKea_eW-7t2mQmg0DuH_Zt59GHP7Y9ODx2Xfo9FBScIeSbZSaTaQ6q5tFVymHyzQ5g", currency: "ILS", "disable-funding": "card" }}>
                <PayPalButtons
                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
                    createOrder={(_data, actions) => {
                        const totalAmount = calculateTotal().toString();
                        if (parseFloat(totalAmount) <= 0) {
                            alert(t.cannotCheckoutWithZero);
                            return Promise.reject(new Error("ZERO_AMOUNT"));
                        }
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{
                                description: `AQ Bimmer Activations`,
                                amount: { value: totalAmount, currency_code: 'ILS' }
                            }]
                        });
                    }}
                    onApprove={async (_data, actions) => {
                        if (actions.order) {
                            const order = await actions.order.capture();
                            console.log("Payment successful:", order);
                            alert(t.paymentSuccess);
                            setCart([]);
                            setIsCartOpen(false);
                        }
                    }}
                    onError={(err) => { console.error("PayPal Checkout onError", err); alert(t.paymentError); }}
                    onCancel={() => { alert(t.paymentCancelled); }}
                />
            </PayPalScriptProvider>
          </div>
        </div>
      )}
      </div></div></div>}
      {/* ✨ نهاية التعديل: سلة التسوق ✨ */}

      {/* ✨ بداية التعديل: الآن هذا الجزء يعرض إما التفاصيل أو المحتوى الرئيسي ✨ */}
      {currentDetailedActivation ? (
        <div className="min-h-screen text-white font-sans p-4 sm:p-8 flex items-center justify-center">
             <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 bg-black/40 backdrop-blur-lg rounded-lg shadow-2xl animate-fadeIn border border-white/10">
                <button onClick={() => setCurrentDetailedActivation(null)} className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition">&larr; {t.detailGoBack}</button>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-400">{currentDetailedActivation.title?.[language]}</h2>
                {currentDetailedActivation.image_url && <div className="h-64 sm:h-80 w-full overflow-hidden rounded-lg mb-6"><img src={currentDetailedActivation.image_url} alt={currentDetailedActivation.title?.[language]} className="w-full h-full object-contain" /></div>}
                <div className="mb-6"><h3 className="text-xl font-semibold mb-2 text-red-400">{t.detailDescription}</h3><p className="text-gray-200 leading-relaxed">{currentDetailedActivation.description?.[language]}</p></div>
                {currentDetailedActivation.ecu && <div className="mb-6"><h3 className="text-xl font-semibold mb-2 text-red-400">{t.detailECU}</h3><p className="text-gray-200 font-mono">{currentDetailedActivation.ecu}</p></div>}
                <div className="flex flex-col sm:flex-row justify-around mt-6 mb-4 gap-4">
                    <button onClick={() => simulateGeminiAPI("", "detailLLMTitleSimplified")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition text-lg">{t.detailSimplifiedExplanation}</button>
                    <button onClick={() => simulateGeminiAPI("", "detailLLMTitleSteps")} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition text-lg">{t.detailActivationMethod}</button>
                </div>
                {llmLoading && <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}
                {llmResponse && (<div className="bg-gray-800/80 rounded-lg p-4 mt-6 border border-gray-700"><h4 className="text-xl font-semibold mb-2 text-blue-400">{llmResponse.title}</h4><p className="text-gray-300 whitespace-pre-wrap">{llmResponse.content}</p></div>)}
            </div>
        </div>
    ) : (
        <React.Fragment>
            <main>
                <section 
                    className="relative text-center py-32 px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative z-10 container mx-auto">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg"><span className="text-blue-400">{t.brandName1}</span>///<span className="text-red-500">{t.brandName2}</span></h1>
                        <p className="text-xl text-gray-200 max-w-3xl mx-auto text-shadow-md">{t.welcomeTitle}</p>
                    </div>
                </section>

                <div className="py-12 px-4">
                    <section className="mb-16">
                        <div className="container mx-auto">
                            <ModelSelector onSelectionChange={handleSelectionChange} t={t} />
                        </div>
                    </section>

                    <section ref={activationsRef} className="mb-16">
                        <div className="container mx-auto">
                            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 shadow-xl">
                                <h2 className="text-3xl font-bold mb-8 text-center">{t.activationsTitle}{selectedCar && <span className="block text-xl text-blue-300 mt-2">{t.activationsFor} {selectedCar.modelName}</span>}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {displayedActivations.map(act => {
                                        const isInCart = cart.some(item => item.id === act.id);
                                        return (
                                            <div key={act.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 flex flex-col">
                                                {act.image_url && (<div className="h-48 w-full overflow-hidden"><img src={act.image_url} alt={act.title?.[language]} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/ffffff/png?text=Image+Not+Found'; }} /></div>)}
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h3 className="text-lg font-semibold mb-2 flex-grow">{act.title?.[language]}</h3>
                                                    <p className="text-gray-300 text-sm mb-4 h-16 overflow-hidden">{act.description?.[language]}</p>
                                                    <div className="flex justify-between items-center mt-auto"></div>
                                                    <div className="flex gap-x-2 mt-4">
                                                        <button onClick={() => showDetail(act)} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md transition text-sm">{t.viewDetails}</button>
                                                        <button onClick={() => addToCart(act)} disabled={isInCart} className={`flex-1 text-white px-3 py-2 rounded-md transition text-sm ${isInCart ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>{isInCart ? t.addedToCart : t.addToCart}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section ref={servicesRef} className="mb-16">
                        <div className="container mx-auto">
                            <h2 className="text-3xl font-bold mb-8 text-center">{t.servicesTitle}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center"><h3 className="text-xl font-bold mb-2">{t.service1Title}</h3><p className="text-gray-300">{t.service1Desc}</p></div>
                                <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center"><h3 className="text-xl font-bold mb-2">{t.service2Title}</h3><p className="text-gray-300">{t.service2Desc}</p></div>
                                <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center"><h3 className="text-xl font-bold mb-2">{t.service3Title}</h3><p className="text-gray-300">{t.service3Desc}</p></div>
                            </div>
                        </div>
                    </section>

                    <section id="contact" ref={contactRef}>
                        <div className="container mx-auto">
                            <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 shadow-xl">
                                <h2 className="text-3xl font-bold mb-8 text-center">{t.contactTitle}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">{t.contactInfo}</h3>
                                            <div className="space-y-3">
                                                <p><strong>{t.contactPhone}:</strong><a href="tel:+972528180757" className="hover:text-blue-400 mx-2">+972 52 818 0757</a></p>
                                                <p><strong>{t.contactEmail}:</strong><a href="mailto:a.3cx.92@Gmail.com" className="hover:text-blue-400 mx-2">a.3cx.92@Gmail.com</a></p>
                                                <p><strong>{t.contactAddress}:</strong> الطيرة المثلث, إسرائيل</p>
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
                                        <form className="space-y-4" onSubmit={handleSubmit}>
                                            <input type="text" placeholder={t.contactFullName} className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactName} onChange={e => setContactName(e.target.value)} required />
                                            <input type="email" placeholder={t.contactYourEmail} className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                                            <input type="tel" placeholder={t.contactPhoneNumber} className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                                            <textarea rows={6} placeholder={t.contactMessage} className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required></textarea>
                                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-md transition-transform transform hover:scale-105">{t.contactSubmit}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <footer className="bg-transparent/50 backdrop-blur-md py-8">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold"><span className="text-blue-500">{t.brandName1}</span>///<span className="text-red-500">{t.brandName2}</span></h2>
                    <p className="text-gray-400 mt-2">{t.footerSlogan}</p>
                    <div className="mt-8 border-t border-gray-800 pt-6 text-gray-500 text-sm">
                        <p>{t.footerRights(new Date().getFullYear())}</p>
                    </div>
                </div>
            </footer>
        </React.Fragment>
      )}
      {/* ✨ نهاية التعديل: المحتوى الرئيسي والتفاصيل ✨ */}
      <WhatsAppWidget />
    </div>
  );
};

export default HomePage;