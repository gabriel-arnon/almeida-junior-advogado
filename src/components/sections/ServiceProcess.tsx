import { serviceSteps } from "@/content/services";

export function ServiceProcess() {
  return (
    <section className="section-y bg-[linear-gradient(180deg,rgba(210,220,223,0.2),rgba(210,220,223,0.42))]">
      <div className="section-shell">
        <div id="como-funciona" className="max-w-3xl">
          <p className="section-kicker text-gold" data-reveal>
            Como funciona
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-navy md:text-5xl" data-reveal>
            Atendimento objetivo, com cuidado desde o primeiro contato
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceSteps.map((step, index) => (
            <li
              key={step.title}
              className="interactive-card relative overflow-hidden rounded-2xl border border-light-gray/80 bg-white p-6 shadow-[0_10px_30px_rgba(1,39,61,0.04)]"
              data-reveal
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-semibold text-white shadow-[0_8px_20px_rgba(1,39,61,0.2)]">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-graphite-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
