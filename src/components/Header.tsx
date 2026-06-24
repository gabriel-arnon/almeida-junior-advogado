import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-navy text-white backdrop-blur supports-[backdrop-filter]:bg-navy/96">
      <div className="section-shell flex min-h-24 flex-col gap-4 py-4 lg:min-h-28 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <BrandMark variant="dark" />
            <p className="ml-[4.5rem] text-xs font-semibold uppercase tracking-[0.16em] text-white/72 md:ml-[4.75rem]">
              {siteConfig.barRegistration}
            </p>
          </div>
          <Link
            href="/#formulario-contato"
            className="hidden min-h-11 items-center justify-center rounded-sm border border-gold bg-gold px-4 text-sm font-semibold text-navy transition hover:bg-white hover:text-navy focus-visible:bg-white focus-visible:text-navy sm:flex lg:hidden"
          >
            Solicitar contato
          </Link>
        </div>
        <div className="flex items-center gap-4 lg:gap-5">
          <nav
            aria-label="Navegação principal"
            className="-mx-1 overflow-x-auto pb-1 lg:mx-0 lg:overflow-visible lg:pb-0"
          >
            <ul className="flex min-w-max gap-1 text-[0.92rem] font-semibold text-white/82 lg:justify-end lg:gap-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block min-h-11 rounded-sm border-b-2 border-transparent px-3 py-3 transition duration-150 hover:border-gold hover:bg-white/10 hover:text-white focus-visible:border-white focus-visible:bg-white focus-visible:text-navy lg:px-3.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/#formulario-contato"
            className="hidden min-h-12 shrink-0 items-center justify-center rounded-sm bg-gold px-5 text-sm font-semibold text-navy transition hover:bg-white focus-visible:bg-white lg:flex"
          >
            Solicitar contato
          </Link>
        </div>
      </div>
    </header>
  );
}
