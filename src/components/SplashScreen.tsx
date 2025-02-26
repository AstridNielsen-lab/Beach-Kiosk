import React, { useEffect, useState } from 'react';
import { UmbrellaIcon } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

interface SplashScreenProps {
  onComplete: () => void;
  isRest?: boolean;
}

export function SplashScreen({ onComplete, isRest = false }: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isRest) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [onComplete, isRest]);

  const handleClick = () => {
    if (isRest) {
      setShow(false);
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 bg-blue-500 flex items-center justify-center transition-opacity duration-500 z-50 cursor-pointer ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-white text-center">
        <UmbrellaIcon 
          size={64} 
          className="mx-auto mb-4 animate-[bounce_2s_ease-in-out_infinite]" 
        />
        <AnimatedText
          text={isRest ? "Beach Kiosk PDV" : "Beach Kiosk"}
          className="text-4xl font-bold"
        />
      </div>
    </div>
  );
}
