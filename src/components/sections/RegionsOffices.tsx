import { offices, serviceRegions } from "@/content/offices";
import { siteConfig } from "@/content/site";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function officeMapsUrl(office: (typeof offices)[number]) {
  return "mapsUrl" in office ? office.mapsUrl : mapsUrl(office.address);
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 18s5-4.9 5-9a5 5 0 0 0-10 0c0 4.1 5 9 5 9Zm0-6.8a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function RegionsOffices() {
  return (
    <section className="section-y bg-light-gray/30">
      <div className="section-shell">
        <div id="regioes" className="max-w-3xl">
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
        <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2">
          {offices.map((office) => (
            <address
              key={office.city}
              className="flex h-full flex-col border border-light-gray bg-white p-5 not-italic md:p-6"
            >
              <div>
                <h3 className="text-2xl font-semibold text-navy">{office.city}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold">
                  {office.attendance}
                </p>
              </div>
              <div className="mt-5 space-y-1.5 leading-7 text-graphite">
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <a
                  href={officeMapsUrl(office)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${office.city} no Google Maps (abre em nova aba)`}
                  className="inline-flex min-h-11 w-fit items-center gap-2 border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white focus-visible:bg-navy focus-visible:text-white"
                >
                  <MapPinIcon />
                  Ver no Google Maps
                </a>
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
