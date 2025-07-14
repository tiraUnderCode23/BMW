// src/pages/ServicesPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // للتنقل

const services = [
  { title: "برمجة متقدمة", description: "تفعيل جميع الخصائص المخفية في سيارتك باحترافية وأمان تام." },
  { title: "ضمان غير محدود", description: "نقدم ضمان شامل مدى الحياة على جميع خدمات البرمجة." },
  { title: "خدمات اونلاين", description: "برمجة وتعديل السيارة عن بعد من خلال الإنترنت." },
  { title: "تحديث الخرائط", description: "تحديث خرائط نظام الملاحة لآخر إصدار." },
  { title: "فحص وتشخيص", description: "فحص شامل لأنظمة السيارة وتشخيص الأعطال باستخدام أحدث الأجهزة." }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-400">خدماتنا الإضافية</h1>
        <p className="text-lg text-gray-300 mt-2">نقدم مجموعة واسعة من الخدمات الاحترافية لسيارات BMW</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-3 text-blue-300">{service.title}</h3>
            <p className="text-gray-300">{service.description}</p>
          </div>
        ))}
      </main>

      <footer className="text-center mt-12">
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
          العودة إلى الصفحة الرئيسية
        </Link>
      </footer>
    </div>
  );
};

export default ServicesPage;