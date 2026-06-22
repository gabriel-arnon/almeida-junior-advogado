import { VisualContactForm } from "@/components/VisualContactForm";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section className="border-b border-light-gray bg-light-gray/20">
      <div className="section-shell grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_31rem] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_34rem]">
        <div className="max-w-3xl pt-2 lg:pt-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Direito Bancário e do Consumidor
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] text-navy md:text-5xl xl:text-[3.6rem]">
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
              className="flex min-h-12 items-center justify-center rounded-sm bg-navy px-6 font-semibold text-white transition hover:bg-navy/92"
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
          <dl className="mt-9 grid gap-3 text-sm text-graphite-soft sm:grid-cols-3">
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
        <VisualContactForm />
      </div>
    </section>
  );
}
