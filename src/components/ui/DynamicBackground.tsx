import React, { useState, useEffect } from 'react';

interface DynamicBackgroundProps {
  images: string[];
  interval?: number;
  children: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  images, 
  interval = 8000, 
  children 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); // زمن التلاشي
      
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, nextImageIndex]);

  if (images.length === 0) {
    return <div className="bg-gradient-to-br from-blue-900 to-black">{children}</div>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* الخلفية الحالية */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      
      {/* الخلفية التالية (تظهر أثناء الانتقال) */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${images[nextImageIndex]})` }}
      />
      
      {/* طبقة التعتيم */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-black/90" />
      
      {/* المحتوى */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;
