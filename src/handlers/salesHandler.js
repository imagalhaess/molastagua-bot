/**
 * Handler de vendas
 * Gerencia o fluxo de vendas de peças
 */

const { CONVERSATION_STATES } = require('../config/constants');
const ConversationContext = require('../services/conversationContext');
const NotificationService = require('../services/notificationService');
const messages = require('../flows/messages');

class SalesHandler {
  /**
   * Inicia fluxo de vendas
   */
  static async handleSales(client, chatId) {
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
    ConversationContext.setData(chatId, 'serviceType', 'Venda de peça');

    await client.sendMessage(chatId, `*VENDAS*

Qual peça você está procurando?

Por favor, informe o *nome da peça*:`);
  }

  /**
   * Finaliza processo de venda
   */
  static async finalizeSalesRequest(client, chatId) {
    const allData = ConversationContext.getAllData(chatId);

    // Mostra resumo e aguarda confirmação
    const summary = messages.helpers.confirmationSummary(allData);
    await client.sendMessage(chatId, summary);

    // Muda estado para aguardar confirmação
    ConversationContext.setState(chatId, CONVERSATION_STATES.AWAITING_CONFIRMATION);
  }
}

module.exports = SalesHandler;
