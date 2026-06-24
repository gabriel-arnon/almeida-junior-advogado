import Image from "next/image";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section className="border-b border-light-gray bg-light-gray/20">
      <div className="section-shell grid gap-9 py-9 md:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] lg:items-center lg:gap-10 lg:py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Direito Bancário e do Consumidor
          </p>
          <h1 className="mt-5 max-w-[54rem] text-4xl font-semibold leading-[1.08] text-navy md:text-5xl xl:text-[3.45rem]">
            Problemas com operações, cobranças ou contratos bancários?
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-8 text-graphite-soft md:text-xl md:leading-9">
            {siteConfig.siteDescription}
          </p>
          <p className="mt-5 max-w-[42rem] border-l-2 border-gold pl-4 text-base leading-7 text-graphite">
            {siteConfig.regionalPositioning}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#formulario-contato"
              className="flex min-h-12 items-center justify-center rounded-sm bg-navy px-6 font-semibold text-white transition hover:bg-navy/92 focus-visible:bg-navy/92"
            >
              Solicitar contato
            </a>
            <a
              href={siteConfig.whatsappHref}
              className="flex min-h-12 items-center justify-center rounded-sm border border-navy px-6 font-semibold text-navy transition hover:bg-navy hover:text-white"
            >
              Falar pelo WhatsApp
            </a>
          </div>
          <dl className="mt-8 grid max-w-3xl gap-3 text-sm text-graphite-soft sm:grid-cols-3">
            <div className="border border-light-gray bg-white px-4 py-3">
              <dt className="font-semibold text-navy">Profissional</dt>
              <dd>{siteConfig.lawyerName}</dd>
            </div>
            <div className="border border-light-gray bg-white px-4 py-3">
              <dt className="font-semibold text-navy">Registro</dt>
              <dd>{siteConfig.barRegistration}</dd>
            </div>
            <div className="border border-light-gray bg-white px-4 py-3">
              <dt className="font-semibold text-navy">Retorno</dt>
              <dd>{siteConfig.responseTime}</dd>
            </div>
          </dl>
        </div>
        <aside
          id="perfil"
          className="grid gap-5 border border-gold/45 bg-navy p-4 text-white sm:grid-cols-[12rem_1fr] sm:items-center md:p-5 lg:grid-cols-1 lg:gap-4"
        >
          <div className="relative aspect-[4/5] w-full max-w-[18rem] justify-self-center overflow-hidden rounded-md border border-gold/60 bg-white/8 sm:max-w-none lg:max-w-[19rem]">
            <Image
              src="/images/grimaldo-almeida-junior.webp"
              alt="Grimaldo de Almeida Junior, advogado inscrito na OAB/SP 424.479"
              fill
              sizes="(min-width: 1024px) 19rem, (min-width: 640px) 12rem, min(18rem, calc(100vw - 2rem))"
              className="object-cover object-[52%_50%]"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              Advogado
            </p>
            <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
              {siteConfig.lawyerName}
            </h2>
            <p className="mt-2 inline-flex border border-gold/55 px-3 py-1.5 text-sm font-semibold text-white/88">
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
