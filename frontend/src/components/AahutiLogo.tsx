import React from "react";

export interface AahutiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showTagline?: boolean;
  showMeaning?: boolean;
  theme?: "light" | "dark";
}

export const AahutiLogo: React.FC<AahutiLogoProps> = ({
  className = "",
  size = "md",
  showWordmark = true,
  showTagline = false,
  showMeaning = false,
  theme = "light",
}) => {
  const iconSize = size === "sm" ? 30 : size === "lg" ? 46 : 38;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";

  const isDark = theme === "dark";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Sacred Offering / Diya Motif in Ink Black (#171914) & Terracotta Accent (#A65F43) */}
      <div
        className={`relative flex items-center justify-center rounded-xl shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105 border ${
          isDark
            ? "bg-[#242721] border-[#D8CDBA]/20"
            : "bg-[#171914] border-[#D8CDBA]"
        }`}
        style={{ width: iconSize, height: iconSize }}
        title="Aahuti — Sacred Offering"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Diya / Offering Vessel Base in Warm Parchment */}
          <path
            d="M9 22C9 26 13 28 18 28C23 28 27 26 27 22C27 20.5 25 20 18 20C11 20 9 20.5 9 22Z"
            fill="#F3EEE4"
          />
          {/* Base Stand in Sandstone */}
          <path
            d="M14.5 28L13 30.5H23L21.5 28H14.5Z"
            fill="#D8CDBA"
          />
          {/* Sacred Flame (Agni) / Offering Spark in Terracotta */}
          <path
            d="M18 6C18 6 22.5 12 22.5 16C22.5 18.5 20.5 20.5 18 20.5C15.5 20.5 13.5 18.5 13.5 16C13.5 12 18 6 18 6Z"
            fill="#A65F43"
          />
          {/* Inner Flame Glow */}
          <path
            d="M18 11C18 11 20.5 14.5 20.5 17C20.5 18.4 19.4 19.5 18 19.5C16.6 19.5 15.5 18.4 15.5 17C15.5 14.5 18 11 18 11Z"
            fill="#F3EEE4"
          />
          {/* Subtle spark accent */}
          <circle cx="27" cy="10" r="1.5" fill="#A65F43" />
        </svg>
      </div>

      {/* Editorial Serif Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-serif tracking-tight font-bold ${textSize} ${
                isDark ? "text-[#F3EEE4]" : "text-[#171914]"
              }`}
            >
              Aahuti
            </span>
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-md font-sans tracking-normal border ${
                isDark
                  ? "bg-[#A65F43] text-white border-transparent"
                  : "bg-[#E8E2D5] text-[#74785B] border-[#D8CDBA]"
              }`}
              title="Aahuti in Devanagari script"
            >
              आहुति
            </span>
          </div>

          {showTagline && (
            <span
              className={`text-[11px] font-sans font-medium tracking-tight mt-0.5 ${
                isDark ? "text-[#D8CDBA]" : "text-[#5D6057]"
              }`}
            >
              From Surplus to Someone's Supper. Aahuti — Every offering matters.
            </span>
          )}

          {showMeaning && (
            <span
              className={`text-[10px] font-serif italic tracking-tight ${
                isDark ? "text-[#D8CDBA]/80" : "text-[#74785B]"
              }`}
            >
              “An offering or a sacred contribution”
            </span>
          )}
        </div>
      )}
    </div>
  );
};
