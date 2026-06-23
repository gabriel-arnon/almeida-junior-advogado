import type { Metadata } from "next";
import Link from "next/link";
import { legalContentMeta } from "@/content/legal";
import { siteConfig } from "@/content/site";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Política de Privacidade",
  description:
    "Política de Privacidade do Almeida Junior Advogado para o uso do site e do formulário de contato.",
  path: "/politica-de-privacidade"
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

export default function PrivacyPolicyPage() {
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
      <article className="section-shell py-12 md:py-16">
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
            Esta Política de Privacidade explica, em linguagem direta, como o site{" "}
            {siteConfig.name} trata dados pessoais enviados por visitantes.
          </p>

          <div className="mt-10 grid gap-8">
            <LegalSection title="1. Identificação do responsável pelo tratamento">
              <p>
                O responsável pelo tratamento dos dados pessoais coletados por este site é Grimaldo
                de Almeida Junior, advogado inscrito na OAB/SP 424.479, vinculado ao site e à marca{" "}
                {siteConfig.name}.
              </p>
              <p>
                O contato profissional para assuntos de privacidade é{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-navy underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </LegalSection>

            <LegalSection title="2. Escopo da política">
              <p>
                Esta política se aplica ao uso deste site, incluindo a navegação pelas páginas e o
                envio de informações pelo formulário de contato. Ela não substitui contratos,
                procurações, comunicações profissionais específicas ou políticas de serviços de
                terceiros acessados por links externos.
              </p>
            </LegalSection>

            <LegalSection title="3. Dados coletados pelo formulário de contato">
              <p>O formulário de contato pode coletar:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>nome completo;</li>
                <li>telefone ou WhatsApp;</li>
                <li>cidade;</li>
                <li>categoria do assunto informado;</li>
                <li>breve descrição fornecida pelo visitante;</li>
                <li>confirmação de ciência sobre privacidade;</li>
                <li>
                  dados técnicos necessários para segurança e limitação de abuso, como endereço IP
                  ou metadados da requisição, quando usados para prevenção de spam, fraude ou uso
                  excessivo.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Dados que o site não solicita">
              <p>O site não solicita, no formulário de contato:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>CPF ou RG;</li>
                <li>senhas;</li>
                <li>tokens bancários;</li>
                <li>números completos de cartão, conta ou agência;</li>
                <li>códigos de segurança;</li>
                <li>extratos bancários ou envio de documentos por upload.</li>
              </ul>
              <p>
                O visitante deve enviar apenas uma descrição breve no primeiro contato, sem anexar
                ou informar dados sensíveis desnecessários.
              </p>
            </LegalSection>

            <LegalSection title="5. Finalidades do tratamento">
              <p>Os dados podem ser utilizados para:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>receber e responder solicitações de contato;</li>
                <li>compreender o assunto geral apresentado pelo visitante;</li>
                <li>organizar atendimento, quando apropriado;</li>
                <li>prevenir abuso, spam e incidentes de segurança;</li>
                <li>cumprir obrigações legais ou regulatórias, quando aplicável.</li>
              </ul>
            </LegalSection>

            <LegalSection title="6. Bases legais">
              <p>
                Conforme o contexto, o tratamento pode se apoiar em procedimentos preliminares
                solicitados pelo titular antes de eventual contratação, em legítimo interesse para
                segurança essencial e prevenção de abuso, no cumprimento de obrigação legal ou
                regulatória quando aplicável, e em consentimento apenas quando a implementação
                efetivamente depender dessa manifestação.
              </p>
            </LegalSection>

            <LegalSection title="7. Compartilhamento">
              <p>
                Os dados podem ser compartilhados com provedores de infraestrutura e hospedagem,
                provedores técnicos estritamente necessários à operação, provedor de e-mail
                transacional quando o envio por e-mail estiver ativado, e autoridades públicas
                quando houver obrigação legal.
              </p>
              <p>
                O site não deve usar os dados enviados pelo formulário para publicidade ou
                comercialização de listas.
              </p>
            </LegalSection>

            <LegalSection title="8. Tratamento internacional">
              <p>
                Serviços de infraestrutura, hospedagem ou operação técnica podem processar dados
                fora do Brasil, conforme a arquitetura dos fornecedores utilizados. Quando isso
                ocorrer, devem ser observadas as salvaguardas legais aplicáveis.
              </p>
            </LegalSection>

            <LegalSection title="9. Retenção">
              <p>
                Os dados são mantidos pelo tempo razoavelmente necessário para as finalidades
                descritas, eventual defesa de direitos e cumprimento de obrigações obrigatórias. Não
                há, nesta política, prazo fechado formalmente aprovado para todos os cenários.
              </p>
              <p>
                O site atual não mantém conta pública de usuário nem base de dados visível ao
                visitante.
              </p>
            </LegalSection>

            <LegalSection title="10. Segurança">
              <p>
                São adotadas medidas técnicas e administrativas razoáveis para reduzir riscos de
                acesso indevido, uso abusivo e exposição desnecessária. Nenhum sistema, porém, pode
                ser apresentado como absolutamente seguro.
              </p>
            </LegalSection>

            <LegalSection title="11. Direitos do titular">
              <p>Nos termos da LGPD, o titular pode solicitar, quando aplicável:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>confirmação da existência de tratamento e acesso aos dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação, quando cabível;</li>
                <li>portabilidade, quando legalmente aplicável;</li>
                <li>informações sobre compartilhamento;</li>
                <li>revogação de consentimento, quando essa for a base aplicável;</li>
                <li>oposição ou pedido de revisão em hipóteses previstas em lei;</li>
                <li>petição perante a ANPD.</li>
              </ul>
            </LegalSection>

            <LegalSection title="12. Como exercer direitos">
              <p>
                Solicitações relacionadas a dados pessoais podem ser enviadas para{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-navy underline">
                  {siteConfig.email}
                </a>
                . A resposta poderá exigir informações mínimas para confirmar a identidade do
                solicitante e localizar a solicitação, sempre evitando coleta excessiva.
              </p>
            </LegalSection>

            <LegalSection title="13. Cookies e analytics">
              <p>
                O site não informa uso atual de cookies publicitários, pixels de rastreamento ou
                plataforma de analytics. Mecanismos técnicos essenciais podem existir para a
                operação normal, segurança, proteção contra abuso e funcionamento do serviço.
              </p>
            </LegalSection>

            <LegalSection title="14. Links para terceiros">
              <p>
                O site pode conter links para Google Maps, WhatsApp, Instagram, e-mail e outros
                serviços externos. Esses serviços possuem seus próprios termos, políticas e práticas
                de privacidade.
              </p>
            </LegalSection>

            <LegalSection title="15. Crianças e adolescentes">
              <p>
                O site não é direcionado especificamente a crianças ou adolescentes e não cria coleta
                adicional de idade para verificação. Recomenda-se que responsáveis legais acompanhem
                qualquer contato quando aplicável.
              </p>
            </LegalSection>

            <LegalSection title="16. Atualizações da política">
              <p>
                Esta política pode ser atualizada para refletir alterações no site, na operação ou em
                exigências legais. A data de atualização indicada no topo permite identificar a versão
                vigente publicada.
              </p>
            </LegalSection>

            <LegalSection title="17. Contato">
              <p>
                Para dúvidas sobre esta política ou tratamento de dados pessoais, escreva para{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-navy underline">
                  {siteConfig.email}
                </a>
                .
              </p>
              <p>
                Consulte também o{" "}
                <Link href="/aviso-legal" className="font-semibold text-navy underline">
                  Aviso Legal
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
