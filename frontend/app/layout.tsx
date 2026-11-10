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

// Render the layout per request so API_URL is read at runtime, not baked in.
export const dynamic = "force-dynamic";

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('ia_day0_theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

/**
 * Backend URL resolved on the Next.js server at runtime.
 *
 * `API_URL` is read when the container starts, so a Render/Vercel deployment
 * can point to any backend without rebuilding. `NEXT_PUBLIC_API_URL` remains
 * supported as a build-time fallback for static exports.
 */
function resolveApiUrl(): string {
  const raw =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";
  const clean = raw.trim().replace(/\/+$/, "");
  if (!clean) return "http://localhost:8000";
  if (/^https?:\/\//i.test(clean)) return clean;
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(clean)
    ? `http://${clean}`
    : `https://${clean}`;
}

const RUNTIME_CONFIG_SCRIPT = `window.__IA_DAY0_CONFIG__=${JSON.stringify({
  apiUrl: resolveApiUrl(),
}).replace(/</g, "\\u003c")};`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: RUNTIME_CONFIG_SCRIPT }} />
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
