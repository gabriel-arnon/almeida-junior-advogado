import { offices } from "@/content/offices";
import { siteConfig } from "@/content/site";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function officeMapsUrl(office: (typeof offices)[number]) {
  return "mapsUrl" in office ? office.mapsUrl : mapsUrl(office.address);
}

const footerLinkClass =
  "underline-offset-4 transition hover:text-white hover:underline focus-visible:text-white focus-visible:underline";

function compactOfficeLabel(office: (typeof offices)[number]) {
  return `${office.city} — Centro`;
}

export function Footer() {
  return (
    <footer className="border-t border-light-gray bg-navy text-white">
      <div className="section-shell grid gap-9 py-10 md:grid-cols-[1.15fr_0.9fr_1fr_0.8fr] md:items-start">
        <div>
          <p className="font-serif text-2xl font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-[0.95rem] text-white/78">
            {siteConfig.lawyerName} · {siteConfig.barRegistration}
          </p>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-white/72">
            Conteúdo informativo. A análise jurídica depende das circunstâncias de cada caso.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Contato</p>
          <ul className="mt-4 space-y-3 text-[0.95rem] text-white/78">
            <li>
              <a
                className={footerLinkClass}
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href={siteConfig.phoneHref}>
                Telefone: {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                className={footerLinkClass}
                href={siteConfig.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.instagram}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Escritórios</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-6 text-white/78">
            {offices.map((office) => (
              <li key={office.city}>
                <a
                  href={officeMapsUrl(office)}
                  className={`font-semibold text-white ${footerLinkClass}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${compactOfficeLabel(office)} no Google Maps: ${office.address}`}
                  title={office.address}
                >
                  {compactOfficeLabel(office)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Informações
          </p>
          <ul className="mt-4 space-y-3 text-[0.95rem] text-white/78">
            <li>
              <a href="/politica-de-privacidade" className={footerLinkClass}>
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="/aviso-legal" className={footerLinkClass}>
                Aviso Legal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
