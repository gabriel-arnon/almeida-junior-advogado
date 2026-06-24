import { VisualContactForm } from "@/components/VisualContactForm";
import { commonSituationCards } from "@/content/services";

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
    <section className="section-y bg-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.78fr)] lg:items-start xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div>
          <div id="situacoes" className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              Situações comuns
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
              Conflitos bancários que exigem análise individual
            </h2>
          </div>
          <ul className="mt-8 grid items-stretch gap-3 sm:grid-cols-2 lg:gap-4">
            {commonSituationCards.map((item) => (
              <li
                key={item}
                tabIndex={0}
                className="flex min-h-20 gap-3 border border-light-gray bg-white p-3.5 text-sm font-semibold leading-6 text-graphite transition duration-150 hover:border-gold/70 hover:bg-gold/5 hover:shadow-[0_8px_22px_rgba(1,39,61,0.06)] focus-visible:border-gold focus-visible:bg-gold/5"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/10">
                  <SituationIcon />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:sticky lg:top-[9.5rem]">
          <span id="formulario-contato" className="anchor-marker" aria-hidden="true" />
          <VisualContactForm />
        </div>
      </div>
    </section>
  );
}
