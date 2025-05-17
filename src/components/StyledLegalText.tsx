
"use client";

import React from 'react'; // Changed from "import type React from 'react';"

interface StyledLegalTextProps {
  text: string;
}

const HIGHLIGHT_PHRASE = "YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL.";

export const StyledLegalText: React.FC<StyledLegalTextProps> = ({ text }) => {
  if (!text) return null;

  const renderSegment = (segment: string) => {
    // Split by **markdown** capturing the content inside **
    // Regex: splits by **, keeps the content between ** as odd elements in the array
    // e.g., "abc **bold** def" -> ["abc ", "bold", " def"]
    const parts = segment.split(/\*\*(.*?)\*\*/g);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) { // Content between **
        return <strong key={index}>{part}</strong>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>; // Regular text
    });
  };

  // Split the main text by the highlight phrase, keeping the highlight phrase
  // Using a regex with a capturing group to keep the delimiter (highlight phrase)
  const mainSegments = text.split(new RegExp(`(${HIGHLIGHT_PHRASE})`, 'gi'));

  return (
    <>
      {mainSegments.map((segment, index) => {
        if (segment.toUpperCase() === HIGHLIGHT_PHRASE.toUpperCase()) {
          return (
            <span key={index} className="bg-accent/30 px-1 py-0.5 rounded">
              {/* Render the segment itself, in case it had markdown (unlikely for this specific phrase) */}
              {renderSegment(segment)}
            </span>
          );
        }
        return renderSegment(segment);
      })}
    </>
  );
};
