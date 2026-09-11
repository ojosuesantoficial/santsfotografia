import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'light',
}) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeMap[size]} relative flex items-center justify-center flex-shrink-0 drop-shadow-sm`}>
        <img
          src="/logo_s.svg"
          alt="Logo Sants Fotograf.ia"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div className="text-left">
          <span className={`font-display font-bold text-xl leading-none block tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#221F1B]'}`}>
            Sants Fotograf.ia
          </span>
          <span className="text-[9px] font-bold tracking-[0.28em] text-[#A6825B] uppercase block mt-1">
            Fotos IA
          </span>
        </div>
      )}
    </div>
  );
};
