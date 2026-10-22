import React, { useState, useEffect, useMemo } from "react";
import { getFoodImageGallery, getFoodAltText } from "../data/foodImages";

interface CyclingFoodImageProps {
  title: string;
  category?: string;
  id?: string;
  existingImageUrl?: string;
  altText?: string;
  className?: string;
  containerClassName?: string;
  intervalMs?: number; // 5000ms (5 seconds) default
  showIndicators?: boolean;
}

/**
 * Responsive Food Image component that cycles through authentic, simple vegetarian Indian food photos
 * every 5 seconds with buttery-smooth crossfade transitions.
 */
export const CyclingFoodImage: React.FC<CyclingFoodImageProps> = ({
  title,
  category = "Cooked Meals",
  id,
  existingImageUrl,
  altText,
  className = "",
  containerClassName = "",
  intervalMs = 5000,
  showIndicators = true,
}) => {
  const images = useMemo(() => {
    return getFoodImageGallery(title, category, id, existingImageUrl);
  }, [title, category, id, existingImageUrl]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle to the next photo every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images, intervalMs]);

  const resolvedAltText = altText || getFoodAltText(title, category);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#E8E2D5] select-none ${containerClassName}`}>
      {/* Overlapping cross-fading photos */}
      {images.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={resolvedAltText}
            loading={index === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            } ${className}`}
          />
        );
      })}

      {/* Subtle 5-second cycle progress indicator dots */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-none px-2">
          {images.slice(0, 5).map((_, i) => {
            const isDotActive = i === (currentIndex % Math.min(images.length, 5));
            return (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 shadow-xs ${
                  isDotActive
                    ? "w-4 bg-white/95"
                    : "w-1.5 bg-white/40 backdrop-blur-xs"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
