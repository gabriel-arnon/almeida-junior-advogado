import { siteConfig } from "@/content/site";

export function FinalCta() {
  return (
    <section className="section-y bg-light-gray/35" aria-labelledby="cta-final">
      <div className="section-shell">
        <div className="relative grid gap-7 overflow-hidden rounded-[1.75rem] border border-gold/30 bg-navy p-7 text-white shadow-[0_26px_70px_rgba(1,39,61,0.18)] md:p-10 lg:grid-cols-[1fr_auto] lg:items-center" data-reveal>
          <div>
            <p className="section-kicker text-gold">Próximo passo</p>
            <h2
              id="cta-final"
              className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl"
            >
              Relate o ocorrido com segurança e aguarde orientação sobre a análise inicial.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
              Não envie senhas, tokens ou dados bancários completos. Para contato nesta fase, use os
              canais diretos abaixo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-80 lg:flex-col">
            <a
              href={siteConfig.whatsappHref}
              className="flex min-h-12 items-center justify-center rounded-full bg-gold px-6 font-semibold text-navy transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Falar pelo WhatsApp
            </a>
            <a
              href={siteConfig.phoneHref}
              className="flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-navy"
            >
              Ligar para {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
