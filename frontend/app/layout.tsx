import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "IA-Day-0 Assessment Engine — By Cloud Automate",
  description:
    "Trilingual AI adoption assessment: 90-day roadmap, technology stack, low-risk pilot and change management plan. By Cloud Automate.",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('ia_day0_theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
