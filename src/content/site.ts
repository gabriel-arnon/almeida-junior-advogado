export const siteConfig = {
  name: "Almeida Junior Advogado",
  lawyerName: "Grimaldo de Almeida Junior",
  barRegistration: "OAB/SP 424.479",
  phoneDisplay: "+55 13 97410-9024",
  phoneHref: "tel:+5513974109024",
  whatsappHref:
    "https://wa.me/5513974109024?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica.",
  email: "grimaldoalmeida.oab@gmail.com",
  instagram: "@drgrimaldoalmeida",
  instagramHref: "https://www.instagram.com/drgrimaldoalmeida",
  responseTime: "até 24 horas úteis",
  siteDescription:
    "Orientação jurídica para consumidores em situações envolvendo fraudes, empréstimos, cobranças e contratos bancários.",
  regionalPositioning:
    "Atendimento presencial em Santos e Bertioga, com atuação na Baixada Santista, Litoral Sul e Grande São Paulo. Atendimento on-line mediante agendamento.",
  navItems: [
    { href: "#situacoes", label: "Situações" },
    { href: "#como-funciona", label: "Atendimento" },
    { href: "#perfil", label: "Perfil" },
    { href: "#documentos", label: "Documentos" },
    { href: "#regioes", label: "Regiões" },
    { href: "#faq", label: "FAQ" }
  ]
} as const;

export type NavItem = (typeof siteConfig.navItems)[number];
