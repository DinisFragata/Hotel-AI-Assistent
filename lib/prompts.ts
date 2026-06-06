import type { LogEntry } from "@/lib/types"

export const CHAT_SYSTEM_PROMPT = `És um chatbot de atendimento ao cliente para um hotel. O teu objetivo é ajudar os hóspedes de forma rápida, amigável e eficiente, respondendo a perguntas comuns e resolvendo problemas relacionados com a estadia.
O nome do hóspede é Dinis. Responde sempre em português europeu (Portugal).
Sê calorosa, prestável e concisa (máximo 2–4 frases).
Tratas de: horários de check-in/check-out, estacionamento, Wi-Fi, pequeno-almoço, pedidos de housekeeping, política de animais, transfers para o aeroporto, recomendações locais.
Nunca digas "Não sei" — oferece-te para contactar a receção.
Não uses listas com marcadores a menos que listes 3 ou mais itens. Mantém as respostas curtas e amigáveis.`

export const SUMMARY_SYSTEM_PROMPT = `És um assistente de operações hoteleiras. Resume a conversa com o hóspede em 1–2 frases em português europeu (Portugal).
Foca-te no que foi pedido e no que foi resolvido. Factual, terceira pessoa, tempo passado. Só texto simples.`

export const EMAIL_SYSTEM_PROMPT = `Redige um email interno breve para a equipa de operações do hotel sobre um pedido de hóspede.
Escreve o assunto primeiro com o prefixo "Assunto: ", depois o corpo do email. Máximo 100 palavras. Em português europeu (Portugal).
Profissional mas conciso. O nome do hóspede é Dinis.`

export const TICKET_SYSTEM_PROMPT = `Extrai da conversa o pedido principal do hóspede e o seu nível de prioridade.
Devolve APENAS JSON válido sem texto extra: {"request": "<máx 5 palavras descrevendo o pedido>", "priority": "<High|Medium|Low>"}
Guia de prioridade: High = urgente/reclamação/necessidade imediata, Medium = pedido para o mesmo dia, Low = questão ou dúvida geral.`

// Mock responses for when there is no API key
export const MOCK_RESPONSES: Record<string, { reply: string; request: string; priority: "High" | "Medium" | "Low" }> = {
  "check-in tardio": {
    reply: "O check-in tardio está disponível — somos flexíveis até à meia-noite. Receberá um guia de chegada detalhado com instruções de acesso 24 horas antes da sua estadia. Posso ajudar com mais alguma coisa?",
    request: "Pedido de check-in tardio",
    priority: "Medium",
  },
  "23h": {
    reply: "Acomodamos chegadas tardias até à meia-noite. Garantiremos que a receção esteja preparada para a sua chegada e enviaremos os detalhes de acesso por SMS antes de chegar. Posso ajudar com mais alguma coisa?",
    request: "Check-in tardio 23h",
    priority: "Medium",
  },
  "tarde": {
    reply: "Acomodamos chegadas tardias até à meia-noite. Garantiremos que a receção esteja preparada para a sua chegada e enviaremos os detalhes de acesso por SMS antes de chegar. Posso ajudar com mais alguma coisa?",
    request: "Check-in tardio",
    priority: "Medium",
  },
  "estacionamento": {
    reply: "O hotel oferece estacionamento gratuito a 2 minutos da propriedade. Os lugares estão disponíveis por ordem de chegada e se pretender podemos reservar um para si. Quer que eu envie um pedido de reserva?",
    request: "Disponibilidade de estacionamento",
    priority: "Low",
  },
  "wi-fi": {
    reply: "Sim disponibilizamos rede Wi-Fi. O nome da rede é: Hotel_Premium e a palavra-passe é: Hotel2026. A velocidade chega aos 200 Mbps em toda a propriedade, incluindo o terraço e área da piscina. Posso ajudar com mais alguma coisa?",
    request: "Pedido de password Wi-Fi",
    priority: "Low",
  },
  "wifi": {
    reply: "Sim disponibilizamos rede Wi-Fi. O nome da rede é: Hotel_Premium e a palavra-passe é: Hotel2026. A velocidade chega aos 200 Mbps em toda a propriedade, incluindo o terraço e área da piscina. Posso ajudar com mais alguma coisa?",
    request: "Pedido de password Wi-Fi",
    priority: "Low",
  },
  "password": {
    reply: "Sim disponibilizamos rede Wi-Fi. O nome da rede é: Hotel_Premium e a palavra-passe é: Hotel2026. A velocidade chega aos 200 Mbps em toda a propriedade, incluindo o terraço e área da piscina. Posso ajudar com mais alguma coisa?",
    request: "Pedido de password Wi-Fi",
    priority: "Low",
  },
  "pequeno-almoço": {
    reply: "O pequeno-almoço no hotel é servido diariamente das 7h30 às 10h30 na Sala do Jardim no rés-do-chão. Oferecemos um buffet mediterrânico com pastelaria fresca, queijos locais, ovos ao gosto e fruta da época. Temos opções para necessidades alimentares específicas — basta informar-nos! Posso ajudar com mais alguma coisa?",
    request: "Horário do pequeno-almoço",
    priority: "Low",
  },
  "toalha": {
    reply: "Com certeza, Dinis! Foi enviado um pedido para entregar toalhas extra no quarto 204, deverá recebê-las nos próximos 20 minutos. Precisa de mais alguma coisa para o seu quarto?",
    request: "Toalhas extra quarto 204",
    priority: "Medium",
  },
  "cão": {
    reply: "Ótimas notícias — o hotel aceita animais! Cães pequenos (até 10 kg) são muito bem-vindos. Há uma taxa de limpeza única de €25 e pedimos que os animais não fiquem sozinhos nos quartos. Também temos um jardim encantador para passeios. Posso registar o seu cão na reserva?",
    request: "Consulta sobre animais de estimação",
    priority: "Low",
  },
  "animal": {
    reply: "Ótimas notícias — o hotel aceita animais! Cães pequenos (até 10 kg) são muito bem-vindos. Há uma taxa de limpeza única de €25 e pedimos que os animais não fiquem sozinhos nos quartos. Também temos um jardim encantador para passeios. Posso registar o seu cão na reserva?",
    request: "Consulta sobre animais de estimação",
    priority: "Low",
  },
  "transfer": {
    reply: "Claro! Posso arranjar um transfer privado para o aeroporto amanhã de manhã às 8h. A viagem até ao Aeroporto Internacional de Malta demora aproximadamente 25 minutos. O preço é €35 para uma viatura privada. Posso confirmar esta reserva, Dinis?",
    request: "Transfer aeroporto 8h",
    priority: "High",
  },
  "aeroporto": {
    reply: "Claro! Posso arranjar um transfer privado para o aeroporto amanhã de manhã às 8h. A viagem até ao Aeroporto Internacional de Malta demora aproximadamente 25 minutos. O preço é €35 para uma viatura privada. Posso confirmar esta reserva, Dinis?",
    request: "Pedido de transfer aeroporto",
    priority: "High",
  },
}

export const DEFAULT_MOCK_REPLY = "Obrigado pela sua mensagem, Dinis! Infelizmente não consigo ajudar com isso. Contudo, vou contactar a nossa equipa de receção que poderá ter uma resposta diretamente. Entretanto, posso ajudar com outras perguntas que tenha!"

export const buildMockNotifications = () => [
  `Email enviado para dinisfragata2@gmail.com`,
  `Pedido registado no PMS #${Math.floor(4800 + Math.random() * 200)}`,
  `Duty manager notificado via Slack`,
]

export const getMockResponse = (message: string): { reply: string; request: string; priority: "High" | "Medium" | "Low" } => {
  const lower = message.toLowerCase()
  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(keyword)) return response
  }
  return { reply: DEFAULT_MOCK_REPLY, request: "Questão geral", priority: "Low" }
}

export function buildMockEmail(guestMessage: string, request: string): { subject: string; body: string } {
  const time = new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
  const lower = guestMessage.toLowerCase()

  if (lower.includes("toalha")) {
    return {
      subject: "Pedido de Housekeeping — Quarto 204",
      body: `Olá equipa,\n\nO hóspede Dinis (Quarto 204) solicitou toalhas extra. Por favor, organizem a entrega nos próximos 20 minutos.\n\nRegistado às ${time}. Prioridade: Média.\n\nRegistado,\nChabot`,
    }
  }
  if (lower.includes("transfer") || lower.includes("aeroporto")) {
    return {
      subject: "Reserva de Transfer — Hóspede Dinis",
      body: `Olá equipa,\n\nO hóspede Dinis solicitou um transfer privado para o aeroporto amanhã às 8h. Por favor, confirmem a disponibilidade do motorista.\n\nRegistado às ${time}. Prioridade: Alta.\n\nRegistado,\nChatbot`,
    }
  }
  if (lower.includes("check-in") || lower.includes("23h") || lower.includes("tarde")) {
    return {
      subject: "Pedido de Check-in Tardio — Hóspede Dinis",
      body: `Olá equipa,\n\nO hóspede Dinis solicitou um check-in tardio esta noite. Por favor, garantam que a propriedade está acessível.\n\nRegistado às ${time}.\n\nRegistado,\nChatbot`,
    }
  }

  return {
    subject: `Pedido do Hóspede — ${request}`,
    body: `Olá equipa,\n\nO hóspede Dinis submeteu um pedido às ${time}:\n\n"${guestMessage.slice(0, 100)}"\n\nPor favor, façam o acompanhamento necessário.\n\nRegistado,\nChatbot`,
  }
}

export const MOCK_LOG_ROWS: LogEntry[] = [
  {
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    guestName: "Dinis",
    guestMessage: "Podem arranjar um transfer para o aeroporto amanhã de manhã às 8h?",
    request: "Transfer aeroporto 8h",
    priority: "High",
    aiReply: "Claro! Posso arranjar um transfer privado para o aeroporto amanhã às 8h. O preço é €35 para uma viatura privada.",
    emailSent: true,
  },
  {
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    guestName: "Dinis",
    guestMessage: "Podiam enviar toalhas extra para o quarto 204?",
    request: "Toalhas extra quarto 204",
    priority: "Medium",
    aiReply: "Com certeza, Dinis! Vou arranjar para que toalhas extra sejam entregues no quarto 204 nos próximos 20 minutos.",
    emailSent: true,
  },
  {
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    guestName: "Dinis",
    guestMessage: "Qual é a password do Wi-Fi do meu quarto?",
    request: "Pedido de password Wi-Fi",
    priority: "Low",
    aiReply: "A rede Wi-Fi é: Hotel_Premium e a palavra-passe é: Hotel2026. A velocidade chega aos 200 Mbps.",
    emailSent: false,
  },
  {
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    guestName: "Dinis",
    guestMessage: "Têm estacionamento disponível no hotel?",
    request: "Disponibilidade de estacionamento",
    priority: "Low",
    aiReply: "O hotel oferece estacionamento gratuito a 2 minutos da propriedade.",
    emailSent: false,
  },
  {
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    guestName: "Dinis",
    guestMessage: "Vou chegar tarde esta noite por volta das 23h. Está tudo bem?",
    request: "Check-in tardio 23h",
    priority: "Medium",
    aiReply: "Sem problema, Dinis! Acomodamos chegadas tardias até à meia-noite. Garantirei que a receção esteja preparada.",
    emailSent: true,
  },
]
