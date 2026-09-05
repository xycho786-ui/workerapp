import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/locales";
import "./globals.css";

const geistSans = { variable: "font-sans" };
const geistMono = { variable: "font-mono" };

export const metadata: Metadata = {
  title: "WBSP - Find Skilled Workers",
  description: "Connect with nearby skilled workers instantly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialLanguage: Language = "en";
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("app_language")?.value;
    if (lang) {
      initialLanguage = lang as Language;
    }
  } catch (e) {
    // Ignore static compilation cookies error during build time
  }

  return (
    <html
      lang={initialLanguage}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex justify-center bg-gray-50 text-gray-900">
        <LanguageProvider initialLanguage={initialLanguage}>
          <div className="w-full max-w-md min-h-screen bg-white shadow-xl relative flex flex-col pb-20">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
