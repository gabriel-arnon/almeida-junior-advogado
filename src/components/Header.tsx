import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-gray/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <div className="section-shell flex min-h-24 flex-col gap-4 py-4 lg:min-h-28 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <BrandMark />
            <p className="ml-[4.5rem] text-xs font-semibold uppercase tracking-[0.16em] text-graphite-soft md:ml-[4.75rem]">
              {siteConfig.barRegistration}
            </p>
          </div>
          <a
            href="#formulario-contato"
            className="hidden min-h-11 items-center justify-center rounded-sm border border-navy px-4 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white focus-visible:bg-navy focus-visible:text-white sm:flex lg:hidden"
          >
            Solicitar contato
          </a>
        </div>
        <div className="flex items-center gap-4 lg:gap-5">
          <nav aria-label="Navegação principal" className="-mx-1 overflow-x-auto pb-1 lg:mx-0 lg:overflow-visible lg:pb-0">
            <ul className="flex min-w-max gap-1 text-[0.92rem] font-semibold text-graphite-soft lg:justify-end lg:gap-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                    className="block min-h-11 rounded-sm px-3 py-3 transition hover:bg-light-gray/35 hover:text-navy focus-visible:bg-light-gray/35 focus-visible:text-navy lg:px-3.5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
          <a
            href="#formulario-contato"
            className="hidden min-h-12 shrink-0 items-center justify-center rounded-sm bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy/92 focus-visible:bg-navy/92 lg:flex"
          >
            Solicitar contato
          </a>
        </div>
      </div>
    </header>
  );
}
