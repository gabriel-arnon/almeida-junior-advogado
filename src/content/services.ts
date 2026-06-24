export const bankingSituations = [
  "Pix ou transferências bancárias não reconhecidas",
  "Empréstimos não autorizados",
  "Compras no cartão não reconhecidas",
  "Fraude ou invasão de conta bancária",
  "Cobranças ou descontos indevidos",
  "Negativação indevida",
  "Golpes envolvendo boleto ou link falso",
  "Bloqueio ou encerramento de conta",
  "Juros bancários e discussões contratuais",
  "Financiamento de veículos",
  "Outros"
] as const;

export const commonSituationCards = [
  ...bankingSituations,
  "Disputas envolvendo cartão de crédito consignado",
  "Tarifas bancárias questionadas",
  "Serviços agregados não solicitados",
  "Renegociação ou acordo com banco",
  "Contestação de débito automático",
  "Problemas com portabilidade de crédito",
  "Cobrança após quitação de contrato",
  "Limite de crédito ou cheque especial questionado"
] as const;

export const serviceSteps = [
  {
    title: "Primeiro contato",
    text: "Você relata o ocorrido de forma breve, sem enviar senhas, códigos ou dados bancários completos."
  },
  {
    title: "Análise inicial",
    text: "As informações são avaliadas individualmente para entender o contexto e os próximos caminhos possíveis."
  },
  {
    title: "Orientação jurídica",
    text: "O atendimento indica quais documentos podem ser úteis e quais medidas podem ser consideradas no caso concreto."
  },
  {
    title: "Acompanhamento",
    text: "Quando houver contratação, os próximos passos são tratados com organização, clareza e comunicação objetiva."
  }
] as const;

export const usefulDocuments = [
  "Protocolos de atendimento do banco ou da instituição financeira",
  "Comprovantes de Pix, transferências, cobranças ou descontos questionados",
  "Notificações, mensagens ou e-mails relacionados ao problema",
  "Contrato, fatura ou demonstrativo disponível, quando existir",
  "Comprovante de negativação, se houver"
] as const;

export const initialSteps = [
  "Registre protocolos de atendimento e guarde os comprovantes disponíveis.",
  "Evite compartilhar senhas, códigos, tokens ou números completos de cartão e conta.",
  "Organize datas, valores aproximados e canais usados para contato com a instituição.",
  "Procure orientação individual antes de assumir novos compromissos ou aceitar propostas."
] as const;
