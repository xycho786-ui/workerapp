"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, defaultLanguage } from '@/locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode, initialLanguage: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = event.reason?.message || '';
      const isAuthError = 
        errorMsg.includes('Refresh token is not valid') || 
        errorMsg.includes('refresh_token') || 
        errorMsg.includes('AuthApiError') ||
        (event.reason?.name === 'AuthApiError');
      
      if (isAuthError) {
        console.warn('Suppressed unhandled AuthApiError (invalid refresh token):', event.reason);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    // Write cookie for server-side layout rendering
    document.cookie = `app_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Sync to database
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      });
    } catch (e) {
      console.error('Failed to sync language to database', e);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations[defaultLanguage];
    const keys = key.split('.');
    let value: any = dict;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    return typeof value === 'string' ? value : (fallback || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
