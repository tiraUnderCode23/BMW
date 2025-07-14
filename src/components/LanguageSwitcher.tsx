import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'ar', name: 'AR' },
  { code: 'he', name: 'HE' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = i18n.dir(lng); // تحديث اتجاه الصفحة
  };

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-1 rounded-full">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${
            i18n.language === lang.code
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-white/20'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;