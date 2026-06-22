import type { Metadata } from "next";
import Link from "next/link";
import { legalContentMeta, legalNoticeSections } from "@/content/legal";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbStructuredData } from "@/lib/structured-data";
import { isIndexingEnabled } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Aviso Legal",
  description:
    "Aviso legal provisório sobre natureza informativa, ausência de promessa de resultado e análise individual.",
  path: "/aviso-legal"
});

export default function LegalNoticePage() {
  const showReviewNotice = !isIndexingEnabled();

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbStructuredData([
              { name: "Início", path: "/" },
              { name: "Aviso Legal", path: "/aviso-legal" }
            ])
          )
        }}
      />
      <section className="section-shell py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm font-semibold text-navy underline-offset-4 hover:underline">
            Voltar para a página inicial
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            Informação profissional
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-navy">Aviso Legal</h1>
          <p className="mt-3 text-sm font-semibold text-graphite-soft">
            Última atualização: {legalContentMeta.lastUpdated}
          </p>
          <p className="mt-5 text-base leading-8 text-graphite-soft">
            Este documento organiza limites de interpretação do conteúdo publicado e reforça que
            toda situação depende de análise individual.
          </p>
          {showReviewNotice ? (
            <div className="mt-6 border-l-2 border-gold bg-gold/10 p-4 text-sm leading-6 text-navy">
              Ambiente de desenvolvimento: conteúdo pendente de revisão final antes da publicação.
            </div>
          ) : null}
          <div className="mt-10 grid gap-5">
            {legalNoticeSections.map((section) => (
              <section key={section.title} className="border-b border-light-gray pb-6">
                <h2 className="text-2xl font-semibold text-navy">{section.title}</h2>
                <p className="mt-3 leading-8 text-graphite-soft">{section.text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
