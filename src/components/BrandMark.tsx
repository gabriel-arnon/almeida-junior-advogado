import Link from "next/link";
import { siteConfig } from "@/content/site";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="flex min-h-14 items-center gap-4 rounded-sm text-navy outline-offset-4"
      aria-label={`${siteConfig.name} - página inicial`}
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-sm border border-gold/70 bg-white shadow-[0_10px_28px_rgba(1,39,61,0.08)]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 48" className="h-10 w-10" role="img">
          <path
            d="M24 7v30M14 15h20M11 20 5 31h12L11 20Zm26 0-6 11h12L37 20ZM17 40h14M20 36h8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.7"
          />
          <circle cx="24" cy="15" r="3" fill="#C9A459" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-2xl font-semibold tracking-normal md:text-[1.7rem]">
          Almeida Junior
        </span>
        <span className="block text-xs font-bold uppercase tracking-[0.24em] text-graphite-soft">
          ADVOGADO
        </span>
      </span>
    </Link>
  );
}
