import type { Metadata } from "next";
import Link from "next/link";
import { legalContentMeta, privacySections } from "@/content/legal";
import { siteConfig } from "@/content/site";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbStructuredData } from "@/lib/structured-data";
import { isIndexingEnabled } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Política de Privacidade",
  description:
    "Política de privacidade provisória para a página de contato de Almeida Junior Advogado.",
  path: "/politica-de-privacidade"
});

export default function PrivacyPolicyPage() {
  const showReviewNotice = !isIndexingEnabled();

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbStructuredData([
              { name: "Início", path: "/" },
              { name: "Política de Privacidade", path: "/politica-de-privacidade" }
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
            Privacidade
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-navy">Política de Privacidade</h1>
          <p className="mt-3 text-sm font-semibold text-graphite-soft">
            Última atualização: {legalContentMeta.lastUpdated}
          </p>
          <p className="mt-5 text-base leading-8 text-graphite-soft">
            Este texto descreve, de forma preliminar, como os dados do futuro formulário de contato
            deverão ser tratados para análise e resposta à solicitação enviada pelo visitante.
        </p>
          {showReviewNotice ? (
            <div className="mt-6 border-l-2 border-gold bg-gold/10 p-4 text-sm leading-6 text-navy">
              Ambiente de desenvolvimento: conteúdo pendente de revisão final antes da publicação.
            </div>
          ) : null}
          <div className="mt-10 grid gap-5">
            {privacySections.map((section) => (
              <section key={section.title} className="border-b border-light-gray pb-6">
                <h2 className="text-2xl font-semibold text-navy">{section.title}</h2>
                <p className="mt-3 leading-8 text-graphite-soft">{section.text}</p>
              </section>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-gold bg-light-gray/35 p-5">
            <h2 className="text-xl font-semibold text-navy">Contato sobre privacidade</h2>
            <p className="mt-2 leading-7 text-graphite-soft">
              Solicitações relacionadas a dados pessoais podem ser enviadas para{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-navy underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
