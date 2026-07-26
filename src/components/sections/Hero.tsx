import Image from "next/image";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section className="hero-surface border-b border-light-gray" data-motion-hero>
      <div className="section-shell grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] lg:items-center lg:gap-14 lg:py-20">
        <div className="max-w-4xl">
          <p className="section-kicker text-gold" data-hero-item>
            Direito Bancário e do Consumidor
          </p>
          <h1
            className="mt-5 max-w-[54rem] text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.025em] text-navy md:text-[4rem] xl:text-[4.7rem]"
            data-hero-item
          >
            Problemas com operações, cobranças ou contratos bancários?
          </h1>
          <p
            className="mt-6 max-w-[42rem] text-lg leading-8 text-graphite-soft md:text-xl md:leading-9"
            data-hero-item
          >
            {siteConfig.siteDescription}
          </p>
          <p
            className="mt-5 max-w-[42rem] border-l-2 border-gold pl-4 text-base leading-7 text-graphite"
            data-hero-item
          >
            {siteConfig.regionalPositioning}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#formulario-contato"
              className="group flex min-h-12 items-center justify-center rounded-full bg-navy px-7 font-semibold text-white shadow-[0_12px_30px_rgba(1,39,61,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-navy/92 hover:shadow-[0_16px_35px_rgba(1,39,61,0.24)] focus-visible:bg-navy/92"
            >
              Solicitar contato <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href={siteConfig.whatsappHref}
              className="flex min-h-12 items-center justify-center rounded-full border border-navy/35 bg-white/65 px-7 font-semibold text-navy backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white"
            >
              Falar pelo WhatsApp
            </a>
          </div>
          <dl
            className="mt-8 grid max-w-3xl gap-3 text-sm text-graphite-soft sm:grid-cols-3"
            data-hero-item
          >
            <div className="rounded-xl border border-light-gray/80 bg-white/75 px-4 py-3 shadow-[0_8px_24px_rgba(1,39,61,0.04)] backdrop-blur-sm">
              <dt className="font-semibold text-navy">Profissional</dt>
              <dd>{siteConfig.lawyerName}</dd>
            </div>
            <div className="rounded-xl border border-light-gray/80 bg-white/75 px-4 py-3 shadow-[0_8px_24px_rgba(1,39,61,0.04)] backdrop-blur-sm">
              <dt className="font-semibold text-navy">Registro</dt>
              <dd>{siteConfig.barRegistration}</dd>
            </div>
            <div className="rounded-xl border border-light-gray/80 bg-white/75 px-4 py-3 shadow-[0_8px_24px_rgba(1,39,61,0.04)] backdrop-blur-sm">
              <dt className="font-semibold text-navy">Retorno</dt>
              <dd>{siteConfig.responseTime}</dd>
            </div>
          </dl>
        </div>
        <aside
          id="perfil"
          className="relative grid gap-5 overflow-hidden rounded-[1.75rem] border border-gold/45 bg-navy p-4 text-white shadow-[0_30px_70px_rgba(1,39,61,0.22)] sm:grid-cols-[12rem_1fr] sm:items-center md:p-5 lg:grid-cols-1 lg:gap-4"
          data-motion-portrait
        >
          <div className="relative aspect-[4/5] w-full max-w-[18rem] justify-self-center overflow-hidden rounded-[1.25rem] border border-gold/60 bg-white/8 sm:max-w-none lg:max-w-[19rem]">
            <Image
              src="/images/grimaldo-almeida-junior.webp"
              alt="Grimaldo de Almeida Junior, advogado inscrito na OAB/SP 424.479"
              fill
              sizes="(min-width: 1024px) 19rem, (min-width: 640px) 12rem, min(18rem, calc(100vw - 2rem))"
              className="object-cover object-[52%_50%] transition duration-700 hover:scale-[1.025]"
              data-motion-portrait-image
            />
          </div>
          <div>
            <p className="section-kicker text-gold">
              Advogado
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
              {siteConfig.lawyerName}
            </h2>
            <p className="mt-2 inline-flex rounded-full border border-gold/55 px-3 py-1.5 text-sm font-semibold text-white/88">
              {siteConfig.barRegistration}
            </p>
            <p className="mt-3 text-base leading-7 text-white/82">
              Advogado com aproximadamente 10 anos de atuação profissional, com atendimento voltado
              à análise individual e orientação jurídica em conflitos bancários e relações de
              consumo.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
