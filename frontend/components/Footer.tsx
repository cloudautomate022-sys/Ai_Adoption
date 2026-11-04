"use client";

import { useI18n } from "@/lib/i18n";

const CONTACT = {
  website: "https://cloudautomate022-sys.github.io/Cloudautomate/",
  phone: "+39 352 044 3750",
  email: "cloudautomate022@gmail.com",
};

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-line/10 bg-recessed">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-ink">
              IA
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-fg">IA-Day-0</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                {t("brand.tagline")}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {t("why.title")}.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">
            {t("footer.contact")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg/80 transition hover:text-accent"
              >
                {CONTACT.website}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="text-fg/80 transition hover:text-accent"
              >
                Call: {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-fg/80 transition hover:text-accent"
              >
                Email: {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">
            {t("footer.built")}
          </p>
          <p className="mt-4 text-sm text-muted">
            © {new Date().getFullYear()} Cloud Automate. {t("footer.rights")}
          </p>
          <p className="mt-2 text-xs text-faint">
            IA-Day-0 Assessment Engine · By Cloud Automate
          </p>
        </div>
      </div>
    </footer>
  );
}
