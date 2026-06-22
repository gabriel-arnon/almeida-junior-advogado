import { bankingSituations } from "@/content/services";

function SituationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" aria-hidden="true">
      <path
        d="M5 7.5h14M7 7.5V19m10-11.5V19M4.5 19h15M8 11h2m4 0h2m-8 4h2m4 0h2M12 4l7 3.5H5L12 4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function CommonSituations() {
  return (
    <section id="situacoes" className="section-y scroll-mt-36 bg-white">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Situações comuns
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Conflitos bancários que exigem análise individual
          </h2>
          <p className="mt-4 text-base leading-7 text-graphite-soft">
            A página inicial organiza os temas mais frequentes sem prometer resultado. Cada caso
            depende de documentos, contexto e avaliação jurídica própria.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bankingSituations.map((item) => (
            <li
              key={item}
              className="flex min-h-24 gap-3 border border-light-gray bg-white p-4 text-sm font-semibold leading-6 text-graphite transition hover:border-gold/55"
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10">
                <SituationIcon />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
