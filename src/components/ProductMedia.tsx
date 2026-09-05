"use client";

import { useState } from "react";
import { Package, Film, Image as ImageIcon } from "lucide-react";

interface ProductMediaProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  isDetail?: boolean;
}

export default function ProductMedia({
  src,
  alt = "Product media",
  className = "",
  containerClassName = "",
  isDetail = false,
}: ProductMediaProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-amber-50/70 text-amber-600 ${containerClassName}`}>
        <Package size={isDetail ? 48 : 28} className="opacity-70 stroke-[1.5]" />
        {isDetail && (
          <span className="text-[11px] font-bold text-amber-700/80 mt-2 uppercase tracking-wider">
            {alt || "Product Item"}
          </span>
        )}
      </div>
    );
  }

  // Normalize source URL string
  let normSrc = src.trim();

  // If it's a short emoji string like "🍞", "🧼", "🥛", "📦", render directly as emoji icon
  if (normSrc.length <= 4 && !normSrc.includes("/") && !normSrc.includes(".")) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${containerClassName}`}>
        <span className={isDetail ? "text-[80px]" : "text-4xl"}>{normSrc}</span>
      </div>
    );
  }

  // Prepend missing leading slash for relative paths
  if (!normSrc.startsWith("http://") && !normSrc.startsWith("https://") && !normSrc.startsWith("data:") && !normSrc.startsWith("/")) {
    normSrc = `/${normSrc}`;
  }

  // Detect Video
  const isVideo =
    normSrc.match(/\.(mp4|webm|ogg|mov|m4v|avi)(\?.*)?$/i) ||
    normSrc.includes("/videos/") ||
    normSrc.startsWith("data:video/");

  if (isVideo) {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-black ${containerClassName}`}>
        <video
          src={normSrc}
          controls
          playsInline
          className={`w-full h-full object-cover ${className}`}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Image rendering
  return (
    <img
      src={normSrc}
      alt={alt}
      className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
