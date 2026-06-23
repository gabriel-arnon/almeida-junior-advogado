import Image from "next/image";

import { siteConfig } from "@/content/site";

export function LawyerProfile() {
  return (
    <section id="perfil" className="section-y scroll-mt-36 bg-navy text-white">
      <div className="section-shell grid gap-8 md:grid-cols-[18rem_1fr] md:items-center lg:grid-cols-[21rem_1fr]">
        <div className="relative aspect-[4/5] w-full max-w-[22rem] justify-self-center overflow-hidden rounded-md border border-gold/45 bg-white/8 md:max-w-none md:justify-self-auto">
          <Image
            src="/images/grimaldo-almeida-junior.webp"
            alt="Grimaldo de Almeida Junior, advogado inscrito na OAB/SP 424.479"
            fill
            sizes="(min-width: 1024px) 21rem, (min-width: 768px) 18rem, min(22rem, calc(100vw - 2rem))"
            className="object-cover object-[52%_50%]"
          />
        </div>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Perfil profissional
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
            {siteConfig.lawyerName}
          </h2>
          <p className="mt-3 inline-flex border border-gold/45 px-3 py-1.5 text-sm font-semibold text-white/86">
            {siteConfig.barRegistration}
          </p>
          <p className="mt-7 text-lg leading-8 text-white/84 md:text-xl md:leading-9">
            Advogado com aproximadamente 10 anos de atuação profissional, com atendimento voltado à
            análise individual e orientação jurídica em conflitos bancários e relações de consumo.
          </p>
        </div>
      </div>
    </section>
  );
}
