import type React from 'react';

const logoBlue = "#4A72D3"; // Main blue from the provided Lexa logo image
const taglineColor = "#8898C7"; // Tagline color from the Lexa logo image
const whiteColor = "#FFFFFF";

export const LegalMateLogo: React.FC<{ className?: string; collapsed?: boolean }> = ({ className, collapsed = false }) => {
  // This component now renders the "Lexa" logo.
  // The `collapsed` prop determines if the compact version (icon only) or full version is rendered.
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        width={collapsed ? "32" : "56"} // Adjusted size for better proportion, icon part is smaller
        height={collapsed ? "32" : "35"} // Adjusted size
        viewBox="0 0 70 45" // Adjusted viewBox for the icon part
        preserveAspectRatio="xMidYMid meet"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Lexa visual icon"
        className={!collapsed ? "mb-0.5" : ""} 
      >
        {/* Arc */}
        <path 
          d="M5 40 C 5 5, 65 5, 65 40" // Adjusted arc for new viewBox
          stroke={logoBlue} 
          strokeWidth="2" 
          fill="none" 
        />
        {/* Person Icon */}
        <g transform="translate(13 2) scale(0.7)"> {/* Adjusted transform for viewBox */}
          <circle cx="18" cy="12" r="6" fill={logoBlue} />
          <path d="M11 19 H25 L22 35 H14 Z" fill={logoBlue} />
          <path d="M18 22 L16 28 L20 28 Z" fill={whiteColor} />
        </g>
        {/* Document Icon */}
        <g transform="translate(37 9) scale(0.30)"> {/* Adjusted transform for viewBox */}
          <rect x="1" y="1" width="18" height="22" rx="1.5" fill={whiteColor} stroke={logoBlue} strokeWidth="2.5"/>
          <path d="M12 1 L19 8 V1 H12 Z" fill={logoBlue} />
          <text x="3" y="17" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill={logoBlue}>DOC</text>
        </g>
      </svg>
      
      {!collapsed && (
        <>
          <span className="text-2xl font-bold -mt-1" style={{ color: logoBlue, letterSpacing: '-0.02em', lineHeight: '1' }}>
            Lexa
          </span>
          <span className="text-[10px]" style={{ color: taglineColor }}>
            simplify the legalese
          </span>
        </>
      )}
    </div>
  );
};
