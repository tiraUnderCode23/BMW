// src/pages/AQSoftwaresPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AQSoftwaresPage: React.FC = () => {
  return (
    <div className="min-h-screen animated-bg text-white p-8 flex items-center justify-center">
      <div className="text-center bg-black/50 backdrop-blur-lg p-10 rounded-xl shadow-2xl">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-blue-500">AQ</span>///<span className="text-red-500">Softwares</span>
        </h1>
        <p className="text-2xl text-gray-200 mb-8">
          حلول برمجية مبتكرة في عالم السيارات. قريباً...
        </p>
        <Link to="/" className="bg-white text-black font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
          العودة
        </Link>
      </div>
    </div>
  );
};

export default AQSoftwaresPage;