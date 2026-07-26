import { initialSteps, usefulDocuments } from "@/content/services";

export function DocumentsSteps() {
  return (
    <section className="section-y bg-white">
      <div className="section-shell grid items-stretch gap-8 md:grid-cols-2">
        <div id="documentos" className="flex flex-col md:h-full">
          <p className="section-kicker text-gold" data-reveal>
            Preparação
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-navy md:text-5xl" data-reveal>
            Documentos úteis para a análise inicial
          </h2>
          <p className="mt-4 text-base leading-7 text-graphite-soft">
            A lista serve como referência para a análise inicial. Documentos não devem ser enviados
            pelo formulário de contato e podem ser solicitados depois por canal adequado.
          </p>
          <ul className="mt-6 flex flex-col gap-3 md:flex-1" data-reveal>
            {usefulDocuments.map((item) => (
              <li
                key={item}
                className="interactive-card rounded-xl border border-light-gray/80 bg-white px-4 py-3 leading-7 text-graphite shadow-[0_8px_24px_rgba(1,39,61,0.035)] md:flex md:flex-1 md:items-start"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:h-full">
          <p className="section-kicker text-gold" data-reveal>
            Primeiros cuidados
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-navy md:text-5xl" data-reveal>
            Antes de buscar orientação
          </h2>
          <ol className="mt-6 flex flex-col gap-3 md:flex-1 md:justify-between" data-reveal>
            {initialSteps.map((item, index) => (
              <li
                key={item}
                className="interactive-card flex gap-4 rounded-xl border border-light-gray/80 bg-light-gray/20 px-4 py-3 leading-7 text-graphite md:items-start"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
