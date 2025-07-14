import React from 'react';

// SVG Icon for WhatsApp
const WhatsAppIcon = () => (
  <svg
    width="448"
    height="512"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-8 h-8"
    fill="currentColor"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 .9c34.9 0 67.7 13.5 92.8 38.6 25.1 25.1 38.6 57.9 38.6 92.8 0 99.4-80.8 180.2-180.2 180.2-34.9 0-67.7-13.5-92.8-38.6-25.1-25.1-38.6-57.9-38.6-92.8 0-99.4 80.8-180.2 180.2-180.2zm108.8 148.2c-6.9-3.4-41.2-20.3-47.6-22.7-6.4-2.4-11.1-3.4-15.8 3.4-4.7 6.9-18 22.7-22.1 27.2-4.1 4.6-8.2 5.1-15 1.7-6.9-3.4-28.7-10.6-54.7-33.8-20.2-18.1-34-40.4-37.9-47.2-3.9-6.9-.4-10.7 3-14.1 3.1-3.1 6.9-8.2 10.3-12.2 3.4-4.1 4.6-6.9 6.9-11.6 2.3-4.6 1.1-8.7-1.1-12.2-2.3-3.4-15.8-38.1-21.6-52.2-5.7-14.1-11.6-12.2-15.8-12.2-3.9 0-8.7-.5-13.3-.5-4.6 0-12.2 1.7-18.6 8.7-6.4 6.9-25.1 24.5-25.1 59.8 0 35.4 25.6 69.4 29.2 74.2 3.6 4.7 50.7 77.2 124.1 109.2 17.7 7.6 33.6 12.2 45.4 15.7 11.8 3.5 22.7 3 31.5 1.7 9.9-1.2 28.7-11.6 32.7-22.7 4.1-11.1 4.1-20.6 2.8-22.7s-6.9-3.4-13.9-6.9z" />
  </svg>
);

const WhatsAppWidget: React.FC = () => {
  const phoneNumber = "972528180757";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
};

export default WhatsAppWidget;