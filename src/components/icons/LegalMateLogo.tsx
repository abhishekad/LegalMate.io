import Image from 'next/image';
import type React from 'react';

// IMPORTANT: User needs to place their logo at public/images/lexa-logo.png
// If your logo has a different name or path, update logoPath below.
const logoPath = '/images/lexa-logo.png'; 
const logoName = "Lexa"; // App Name
const logoTagline = "simplify the legalese"; // App Tagline
const logoTextColor = "hsl(var(--primary))"; // Using themed primary color for text
const taglineTextColor = "hsl(var(--muted-foreground))"; // Using themed muted color for tagline

interface LexaLogoProps {
  className?: string;
  collapsed?: boolean;
  imageSize?: number; // Controls the width and height of the image
}

export const LegalMateLogo: React.FC<LexaLogoProps> = ({ 
  className, 
  collapsed = false,
  imageSize = 40 // Default size for the image (e.g., height & width)
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Image
        src={logoPath}
        alt={`${logoName} Logo`}
        width={imageSize} // Consider this the target width for the image
        height={imageSize} // Consider this the target height for the image
        // To maintain aspect ratio and prevent distortion:
        // - Ensure 'width' and 'height' props match your image's aspect ratio,
        //   OR use these values as a bounding box and rely on 'object-contain'.
        // - For best results, provide the actual width and height of your PNG file if known,
        //   and next/image will optimize it.
        className="object-contain" // This will ensure the image fits within the width/height box without cropping and maintains its aspect ratio.
        priority // Good for LCP elements like logos, consider removing if not LCP.
      />
      {!collapsed && (
        <>
          <span 
            className="mt-1 text-2xl font-bold" 
            style={{ color: logoTextColor, letterSpacing: '-0.02em', lineHeight: '1' }}
          >
            {logoName}
          </span>
          <span 
            className="text-[10px]" 
            style={{ color: taglineTextColor }}
          >
            {logoTagline}
          </span>
        </>
      )}
    </div>
  );
};
