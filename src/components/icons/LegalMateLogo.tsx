import { Scale } from 'lucide-react';
import type React from 'react';

export const LegalMateLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <Scale className="h-7 w-7" />
      <span className="text-xl font-semibold">LegalMate</span>
    </div>
  );
};
