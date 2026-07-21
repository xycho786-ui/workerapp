"use client";

import { useEffect, useState } from "react";

interface BookOpenWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function BookOpenWrapper({ children, title, subtitle }: BookOpenWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Stagger opening sequence on mount
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="book-viewport">
      <div className={`book-container ${isOpen ? "is-open" : ""}`}>
        {/* Left Page of Cover */}
        <div className="book-page book-page-left">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-4xl">📖</span>
            <h2 className="text-xl font-bold tracking-tight text-white/95">{title}</h2>
          </div>
        </div>

        {/* Right Page of Cover */}
        <div className="book-page book-page-right">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">WBSP Platform</span>
            <p className="text-xs text-white/70 max-w-[150px]">{subtitle}</p>
          </div>
        </div>

        {/* Real Form Content Inside */}
        <div className="book-content-inside">
          {children}
        </div>
      </div>
    </div>
  );
}
