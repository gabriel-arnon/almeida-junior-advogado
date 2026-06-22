const differentiators = [
  "Identificação profissional verificável pelo nome e registro na OAB/SP.",
  "Atendimento presencial confirmado em Santos e Bertioga, mediante agendamento.",
  "Comunicação direta, com orientação para não enviar dados bancários sensíveis no primeiro contato.",
  "Foco em conflitos bancários e relações de consumo, sempre com análise do caso concreto."
] as const;

export function Differentiators() {
  return (
    <section className="section-y bg-white" aria-labelledby="diferenciais">
      <div className="section-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Diferenciais verificáveis
          </p>
          <h2 id="diferenciais" className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Clareza, identificação e atendimento responsável
          </h2>
        </div>
        <ul className="grid gap-3">
          {differentiators.map((item) => (
            <li key={item} className="border-l-2 border-gold bg-light-gray/25 px-5 py-4 leading-7 text-graphite">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
