import type { Metadata } from "next";
import Link from "next/link";
import { legalContentMeta } from "@/content/legal";
import { siteConfig } from "@/content/site";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Aviso Legal",
  description:
    "Aviso Legal do Almeida Junior Advogado sobre finalidade informativa, atendimento profissional e limites do conteúdo publicado.",
  path: "/aviso-legal"
});

function LegalSection({
  title,
  children
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="border-b border-light-gray pb-8">
      <h2 className="text-2xl font-semibold text-navy">{title}</h2>
      <div className="mt-3 space-y-4 leading-8 text-graphite-soft">{children}</div>
    </section>
  );
}

export default function LegalNoticePage() {
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
      <article className="section-shell py-12 md:py-16">
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
            Este aviso apresenta limites de uso e interpretação das informações publicadas no site{" "}
            {siteConfig.name}.
          </p>

          <div className="mt-10 grid gap-8">
            <LegalSection title="1. Identificação">
              <p>
                {siteConfig.name} é o site profissional de Grimaldo de Almeida Junior, advogado
                inscrito na OAB/SP 424.479.
              </p>
            </LegalSection>

            <LegalSection title="2. Finalidade informativa">
              <p>
                O conteúdo publicado tem caráter geral, educativo e informativo. Ele não substitui
                análise jurídica individual, pois cada situação depende de fatos, documentos,
                histórico, provas e contexto próprio.
              </p>
            </LegalSection>

            <LegalSection title="3. Ausência de relação automática advogado-cliente">
              <p>
                Navegar pelo site, enviar uma mensagem pelo formulário ou receber uma resposta
                inicial não estabelece, por si só, contratação profissional. A atuação depende de
                verificação de conflitos, aceitação do caso e formalização adequada quando cabível.
              </p>
            </LegalSection>

            <LegalSection title="4. Ausência de garantia de resultado">
              <p>
                Nenhum conteúdo do site promete resultado, êxito, reembolso, cancelamento,
                indenização ou qualquer desfecho específico. Resultados dependem dos fatos, das
                provas, da legislação aplicável, de autoridades administrativas e do Poder
                Judiciário, quando houver processo.
              </p>
            </LegalSection>

            <LegalSection title="5. Sigilo e formulário de contato">
              <p>
                No primeiro contato, informe apenas uma descrição breve do ocorrido. Não envie
                senhas, tokens, credenciais bancárias completas, códigos de segurança ou documentos
                sensíveis desnecessários.
              </p>
              <p>
                O envio espontâneo de informações pelo site não significa que toda comunicação
                enviada sem solicitação já esteja automaticamente protegida como relação profissional
                formalizada.
              </p>
            </LegalSection>

            <LegalSection title="6. Atualidade e precisão das informações">
              <p>
                Há esforço razoável para manter as informações corretas e atuais. Ainda assim, normas
                jurídicas, interpretações e entendimentos podem mudar. A data de publicação ou
                atualização não substitui a verificação específica do caso concreto.
              </p>
            </LegalSection>

            <LegalSection title="7. Links de terceiros">
              <p>
                Links para Google Maps, WhatsApp, Instagram, e-mail e outros serviços externos são
                disponibilizados para conveniência do visitante. Esses serviços possuem seus próprios
                termos de uso, políticas de privacidade e práticas de segurança.
              </p>
            </LegalSection>

            <LegalSection title="8. Propriedade intelectual">
              <p>
                Textos originais, identidade visual e materiais publicados neste site são protegidos
                na forma aplicável. O compartilhamento comum do link do site é permitido, desde que
                não haja alteração indevida, uso enganoso ou atribuição falsa.
              </p>
            </LegalSection>

            <LegalSection title="9. Conformidade profissional e ética">
              <p>
                O conteúdo tem finalidade informativa. Não há promessa de resultado, comercialização
                de êxito, comparação com outros profissionais ou solicitação indevida de clientela.
                Toda demanda exige análise individual.
              </p>
            </LegalSection>

            <LegalSection title="10. Disponibilidade e segurança">
              <p>
                O site pode sofrer interrupções, indisponibilidades temporárias ou erros técnicos.
                Não há garantia de disponibilidade ininterrupta ou funcionamento permanentemente
                livre de falhas.
              </p>
            </LegalSection>

            <LegalSection title="11. Lei aplicável e contato">
              <p>
                Este aviso é interpretado conforme a legislação brasileira aplicável. Dúvidas podem
                ser encaminhadas para{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-navy underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="12. Política de Privacidade">
              <p>
                Para informações sobre tratamento de dados pessoais no site, consulte a{" "}
                <Link href="/politica-de-privacidade" className="font-semibold text-navy underline">
                  Política de Privacidade
                </Link>
                .
              </p>
            </LegalSection>
          </div>

          <Link
            href="/"
            className="mt-10 inline-flex min-h-11 items-center border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white focus-visible:bg-navy focus-visible:text-white"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </article>
    </main>
  );
}
