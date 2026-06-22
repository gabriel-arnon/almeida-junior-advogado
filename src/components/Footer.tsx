import { siteConfig } from "@/content/site";
import { offices } from "@/content/offices";

export function Footer() {
  return (
    <footer className="border-t border-light-gray bg-navy text-white">
      <div className="section-shell grid gap-8 py-9 md:grid-cols-[1.15fr_0.9fr_1fr_0.8fr] md:items-start">
        <div>
          <p className="font-serif text-2xl font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-white/78">
            {siteConfig.lawyerName} · {siteConfig.barRegistration}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/72">
            Conteúdo informativo. A análise jurídica depende das circunstâncias de cada caso.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-white/78">
            <li>
              <a className="underline-offset-4 hover:underline" href={siteConfig.whatsappHref}>
                WhatsApp: {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={siteConfig.phoneHref}>
                Telefone: {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={siteConfig.instagramHref}>
                {siteConfig.instagram}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Escritórios</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-white/78">
            {offices.map((office) => (
              <li key={office.city}>
                <span className="font-semibold text-white">{office.city}</span>
                <span className="block">{office.lines.at(-1)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Informações</p>
          <ul className="mt-3 space-y-2 text-sm text-white/78">
            <li>
              <a href="/politica-de-privacidade" className="underline-offset-4 hover:underline">
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="/aviso-legal" className="underline-offset-4 hover:underline">
                Aviso Legal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
