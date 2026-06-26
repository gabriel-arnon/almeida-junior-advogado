"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/content/site";

const mobileMenuId = "mobile-navigation";

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {isOpen ? (
        <path
          d="M6 6l12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      ) : (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const unlockBodyScroll = useCallback(() => {
    if (previousBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;
    previousBodyOverflowRef.current = null;
  }, []);

  const closeMobileMenu = useCallback(() => {
    unlockBodyScroll();
    setIsMobileMenuOpen(false);
  }, [unlockBodyScroll]);

  const closeMobileMenuForNavigation = useCallback(() => {
    unlockBodyScroll();
    requestAnimationFrame(() => setIsMobileMenuOpen(false));
  }, [unlockBodyScroll]);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      return;
    }

    setIsMobileMenuOpen(true);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Node && !headerRef.current?.contains(target)) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      unlockBodyScroll();
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [closeMobileMenu, isMobileMenuOpen, unlockBodyScroll]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-gold/25 bg-navy text-white backdrop-blur supports-[backdrop-filter]:bg-navy/96"
    >
      <div className="section-shell relative flex min-h-20 flex-col gap-4 py-3 md:min-h-24 md:py-4 lg:min-h-28 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <BrandMark variant="dark" />
            <p className="ml-[4.5rem] text-xs font-semibold uppercase tracking-[0.16em] text-white/72 md:ml-[4.75rem]">
              {siteConfig.barRegistration}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold/55 text-white transition duration-150 hover:bg-white/10 focus-visible:border-white focus-visible:bg-white focus-visible:text-navy md:hidden"
            aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={toggleMobileMenu}
          >
            <MenuIcon isOpen={isMobileMenuOpen} />
          </button>
          <Link
            href="/#formulario-contato"
            className="hidden min-h-11 items-center justify-center rounded-sm border border-gold bg-gold px-4 text-sm font-semibold text-navy transition hover:bg-white hover:text-navy focus-visible:bg-white focus-visible:text-navy md:flex lg:hidden"
          >
            Solicitar contato
          </Link>
        </div>
        <div className="flex items-center gap-4 lg:gap-5">
          <nav
            aria-label="Navegação principal"
            className="-mx-1 hidden overflow-x-auto pb-1 md:block lg:mx-0 lg:overflow-visible lg:pb-0"
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
        {isMobileMenuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-x-0 bottom-0 top-[var(--sticky-header-height-mobile)] z-40 bg-navy/20 md:hidden"
              aria-label="Fechar menu ao tocar fora"
              onClick={closeMobileMenu}
            />
            <nav
              id={mobileMenuId}
              aria-label="Navegação principal mobile"
              className="fixed inset-x-4 top-[calc(var(--sticky-header-height-mobile)_-_0.25rem)] z-50 max-h-[calc(100dvh_-_var(--sticky-header-height-mobile)_+_0.25rem)] overflow-hidden border border-gold/25 bg-navy opacity-100 shadow-[0_20px_40px_rgba(1,39,61,0.24)] transition-[opacity,transform] duration-200 md:hidden"
            >
              <div className="max-h-[calc(100dvh_-_var(--sticky-header-height-mobile)_+_0.25rem)] overflow-y-auto p-2">
                <ul className="grid gap-1 text-base font-semibold text-white/88">
                  {siteConfig.navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block min-h-12 rounded-sm px-3 py-3 transition duration-150 hover:bg-white/10 hover:text-white focus-visible:bg-white focus-visible:text-navy"
                        onClick={closeMobileMenuForNavigation}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1">
                    <Link
                      href="/#formulario-contato"
                      className="flex min-h-12 items-center justify-center rounded-sm bg-gold px-4 py-3 text-sm font-semibold text-navy transition hover:bg-white focus-visible:bg-white"
                      onClick={closeMobileMenuForNavigation}
                    >
                      Solicitar contato
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </>
        ) : null}
      </div>
    </header>
  );
}
