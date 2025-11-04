/**
 * Mensagens do bot
 * Centraliza todas as mensagens enviadas pelo chatbot
 */

const { config } = require('../config/environment');
const { bold, formatMenu, separator } = require('../utils/messageFormatter');
const { getNextBusinessTime, getNextBusinessDate, getBusinessHoursDescription } = require('../utils/timeValidator');

const messages = {
  /**
   * Mensagem de boas-vindas
   */
  welcome: () => {
    return `Olá! Bem vindo(a) à ${bold('Molas Taguatinga')}! 🚚

Desde ${bold('1992')} cuidando da suspensão do seu veículo com qualidade, experiência e confiança! São mais de ${bold('30 anos')} de tradição servindo o Distrito Federal e região. ✨

Estamos aqui para oferecer as melhores soluções em suspensão automotiva para você!

Como posso te ajudar hoje?`;
  },

  /**
   * Mensagem quando fora do horário de atendimento
   */
  outsideBusinessHours: () => {
    return `No momento estamos fora do horário de atendimento.

${bold('Horário de funcionamento:')}
${getBusinessHoursDescription()}

Obrigado por escolher a ${bold('Molas Taguatinga')}! Retornaremos seu contato em ${bold(getNextBusinessDate())}.

Caso prefira, deixe sua mensagem que responderemos assim que possível!`;
  },

  /**
   * Menu principal
   */
  mainMenu: () => {
    return `Digite o número da opção desejada:

1 - Serviços
2 - Vendas
3 - Financeiro
4 - Falar com atendente`;
  },

  /**
   * Menu de serviços
   */
  servicesMenu: () => {
    return `${bold('SERVIÇOS')}

Digite o número do serviço desejado:

${formatMenu([
      { key: '1', label: 'Reforçar veículo' },
      { key: '2', label: 'Molas (troca/arquear)' },
      { key: '3', label: 'Suporte (troca)' },
      { key: '4', label: 'Balança (troca)' },
      { key: '5', label: 'Tirante' },
      { key: '6', label: 'Outros serviços' },
      { key: '0', label: 'Voltar ao menu principal' }
    ])}`;
  },

  /**
   * Submenu de molas - escolha do tipo
   */
  springsMenu: () => {
    return `${bold('SERVIÇO DE MOLAS')}

Digite o número da opção desejada:

${formatMenu([
      { key: '1', label: 'Troca de mola' },
      { key: '2', label: 'Arquear mola' },
      { key: '0', label: 'Voltar' }
    ])}`;
  },

  /**
   * Submenu de suporte
   */
  supportMenu: () => {
    return `${bold('SERVIÇO DE SUPORTE')}

Digite o número da opção desejada:

${formatMenu([
      { key: '1', label: 'Troca de suporte' },
      { key: '0', label: 'Voltar' }
    ])}`;
  },

  /**
   * Submenu de balança
   */
  balanceMenu: () => {
    return `${bold('SERVIÇO DE BALANÇA')}

Digite o número da opção desejada:

${formatMenu([
      { key: '1', label: 'Troca de balança' },
      { key: '0', label: 'Voltar' }
    ])}`;
  },

  /**
   * Submenu de tirante
   */
  tieRodMenu: () => {
    return `${bold('SERVIÇO DE TIRANTE')}

Digite o número da opção desejada:

${formatMenu([
      { key: '1', label: 'Troca de bucha' },
      { key: '2', label: 'Troca de tirante' },
      { key: '0', label: 'Voltar' }
    ])}`;
  },

  /**
   * Solicitações de informações
   */
  requests: {
    vehicleModel: () => `Por favor, informe o ${bold('modelo do veículo')}:

Exemplo: Ford Cargo, Mercedes-Benz Accelo, Volkswagen Delivery, Iveco Daily, etc.`,

    vehicleYear: () => `Qual o ${bold('ano do veículo')}?

Exemplo: 2015, 2020, etc.`,

    partName: () => `Por favor, informe o ${bold("nome da peça")}:`,

    location: () => `Informe a ${bold('localização')} da peça:

Exemplos:
• Dianteiro esquerdo
• Traseiro direito
• Dianteiro
• Traseiro`,

    quantity: () => `Qual a ${bold('quantidade')} necessária?`,

    photo: () => `Por favor, envie uma ${bold('foto')} da peça ou do local onde será instalada.

Se não tiver foto no momento, pode digitar ${bold('"pular"')} para continuar.`,

    tieRodType: () => `Digite o número do ${bold('tipo')} do tirante:

${formatMenu([
      { key: '1', label: 'Fixo' },
      { key: '2', label: 'Regulagem' }
    ])}`,

    size: () => `Informe o ${bold('tamanho')} do tirante:`,

    description: () => `Não encontrou o que procurava?

Descreva o serviço ou peça que você precisa:`,

    financialOption: () => `${bold('FINANCEIRO')}

Como podemos ajudar?

• Segunda via de boleto
• Segunda via de nota fiscal
• Outras questões financeiras

Por favor, descreva sua necessidade:`
  },

  /**
   * Confirmações
   */
  confirmations: {
    budgetReceived: () => `Perfeito! Recebemos sua solicitação de orçamento.

Nossa equipe analisará as informações e retornaremos com o orçamento em até ${bold(`${config.budgetResponseTime} minutos`)}.

Aceitamos pagamentos em ${bold('pix')}, ${bold('dinheiro')} ou ${bold('cartão')}. 💳

Aguarde nosso contato!`,

    transferringToHuman: () => `Sua solicitação foi encaminhada para nossa equipe de atendimento.

Um de nossos especialistas entrará em contato em breve!`,

    dataReceived: () => 'Informação registrada!'
  },

  /**
   * Mensagens de erro
   */
  errors: {
    invalidOption: () => `Opção inválida. Por favor, escolha uma das opções disponíveis no menu.`,

    invalidInput: () => `Entrada inválida. Por favor, tente novamente.`,

    generic: () => `Desculpe, ocorreu um erro. Por favor, tente novamente ou digite ${bold('"menu"')} para voltar ao início.`
  },

  /**
   * Mensagens auxiliares
   */
  helpers: {
    backToMenu: () => `\n\nDigite ${bold('"menu"')} a qualquer momento para voltar ao início.`,

    confirmationSummary: (data) => {
      let summary = `\n${bold("Resumo da sua solicitação:")}\n\n`;

      if (data.serviceType) summary += `• Serviço: ${data.serviceType}\n`;
      if (data.partName) summary += `• Peça: ${data.partName}\n`;
      if (data.location) summary += `• Localização: ${data.location}\n`;
      if (data.quantity) summary += `• Quantidade: ${data.quantity}\n`;
      if (data.size) summary += `• Tamanho: ${data.size}\n`;
      if (data.type) summary += `• Tipo: ${data.type}\n`;
      if (data.hasPhoto) summary += `• Foto: Enviada\n`;

      summary += `\nDigite o número da opção desejada:\n\n`;
      summary += `1 - Confirmar pedido\n`;
      summary += `2 - Recomeçar do início`;

      return summary;
    }
  }
};

module.exports = messages;
