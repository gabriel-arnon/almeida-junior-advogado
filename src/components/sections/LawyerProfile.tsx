import { siteConfig } from "@/content/site";

export function LawyerProfile() {
  return (
    <section id="perfil" className="section-y scroll-mt-36 bg-navy text-white">
      <div className="section-shell grid gap-8 md:grid-cols-[18rem_1fr] md:items-center lg:grid-cols-[21rem_1fr]">
        <div
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-gold/45 bg-white/8 p-6"
          aria-label="Monograma temporário de Grimaldo de Almeida Junior"
        >
          <div className="absolute inset-6 border border-white/12" aria-hidden="true" />
          <span className="font-serif text-7xl font-semibold text-white/88 md:text-8xl">GA</span>
          <span className="absolute bottom-6 h-px w-20 bg-gold" aria-hidden="true" />
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
          <p className="mt-5 text-base leading-7 text-white/72">
            Esta apresentação utiliza apenas informações confirmadas. Novas credenciais devem ser
            incluídas somente após revisão e confirmação documental.
          </p>
        </div>
      </div>
    </section>
  );
}
