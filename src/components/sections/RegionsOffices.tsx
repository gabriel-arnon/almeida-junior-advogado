import { offices, serviceRegions } from "@/content/offices";
import { siteConfig } from "@/content/site";

export function RegionsOffices() {
  return (
    <section id="regioes" className="section-y scroll-mt-36 bg-light-gray/30">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Regiões e escritórios
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Atendimento presencial em dois endereços confirmados
          </h2>
          <p className="mt-4 text-base leading-7 text-graphite-soft">
            {siteConfig.regionalPositioning}
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {offices.map((office) => (
            <address key={office.city} className="not-italic border border-light-gray bg-white p-5 md:p-6">
              <h3 className="text-xl font-semibold text-navy">{office.city}</h3>
              <p className="mt-2 text-sm text-graphite-soft">Atendimento presencial por agendamento.</p>
              <div className="mt-4 space-y-1.5 leading-7 text-graphite">
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </address>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-navy">Áreas de atuação regional</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {serviceRegions.map((region) => (
              <li key={region} className="border border-light-gray bg-white px-3 py-2 text-sm text-graphite">
                {region}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-graphite-soft">
            A lista indica cobertura regional e não representa existência de escritório físico em
            cada cidade.
          </p>
        </div>
      </div>
    </section>
  );
}
