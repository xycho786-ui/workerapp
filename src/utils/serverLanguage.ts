import { cookies } from "next/headers";
import { translations, Language, defaultLanguage } from "@/locales";

export async function getServerLanguage() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("app_language");
  const language = (langCookie?.value as Language) || defaultLanguage;

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations[defaultLanguage];
    const keys = key.split(".");
    let value: any = dict;
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    return typeof value === "string" ? value : fallback || key;
  };

  return { language, t };
}
