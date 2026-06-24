import { serviceSteps } from "@/content/services";

export function ServiceProcess() {
  return (
    <section className="section-y bg-light-gray/30">
      <div className="section-shell">
        <div id="como-funciona" className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Como funciona
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Atendimento objetivo, com cuidado desde o primeiro contato
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceSteps.map((step, index) => (
            <li key={step.title} className="relative border border-light-gray bg-white p-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-graphite-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
