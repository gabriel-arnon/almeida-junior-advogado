import { initialSteps, usefulDocuments } from "@/content/services";

export function DocumentsSteps() {
  return (
    <section id="documentos" className="section-y scroll-mt-36 bg-white">
      <div className="section-shell grid items-stretch gap-8 md:grid-cols-2">
        <div className="flex flex-col md:h-full">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Preparação
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Documentos úteis para a análise inicial
          </h2>
          <ul className="mt-6 flex flex-col gap-3 md:flex-1">
            {usefulDocuments.map((item) => (
              <li
                key={item}
                className="border border-light-gray bg-white px-4 py-3 leading-7 text-graphite md:flex md:flex-1 md:items-start"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:h-full">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Primeiros cuidados
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Antes de buscar orientação
          </h2>
          <ol className="mt-6 flex flex-col gap-3 md:flex-1">
            {initialSteps.map((item, index) => (
              <li
                key={item}
                className="flex gap-4 border border-light-gray bg-light-gray/20 px-4 py-3 leading-7 text-graphite md:flex-1 md:items-start"
              >
                <span className="font-semibold text-gold">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
