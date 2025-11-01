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

    await client.sendMessage(chatId, `*VENDAS* 🛒

Qual peça você está procurando?

Por favor, informe o *nome da peça*:`);
  }

  /**
   * Finaliza processo de venda
   */
  static async finalizeSalesRequest(client, chatId) {
    const allData = ConversationContext.getAllData(chatId);

    const summary = messages.helpers.confirmationSummary(allData);
    await client.sendMessage(chatId, summary);

    await client.sendMessage(chatId, messages.confirmations.budgetReceived());

    await NotificationService.notifyHumanSupport(client, chatId, 'Venda de peça');
    NotificationService.logAction(chatId, 'Sales request completed');

    ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
  }
}

module.exports = SalesHandler;
