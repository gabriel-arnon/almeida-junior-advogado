import { faqItems } from "@/content/faq";

export function Faq() {
  return (
    <section id="faq" className="section-y scroll-mt-36 bg-white">
      <div className="section-shell max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
          Perguntas frequentes
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
          Respostas objetivas para o primeiro contato
        </h2>
        <div className="mt-8 divide-y divide-light-gray border-y border-light-gray">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-navy">
                {item.question}
                <span className="text-gold transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="pb-2 pt-3 text-base leading-7 text-graphite-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
