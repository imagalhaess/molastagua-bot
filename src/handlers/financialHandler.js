/**
 * Handler financeiro
 * Gerencia solicitações financeiras (boletos, notas fiscais, etc)
 */

const { CONVERSATION_STATES } = require('../config/constants');
const ConversationContext = require('../services/conversationContext');
const NotificationService = require('../services/notificationService');
const messages = require('../flows/messages');

class FinancialHandler {
  /**
   * Inicia fluxo financeiro
   */
  static async handleFinancial(client, chatId) {
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_DESCRIPTION);
    ConversationContext.setData(chatId, 'serviceType', 'Financeiro');

    await client.sendMessage(chatId, messages.requests.financialOption());
  }

  /**
   * Finaliza solicitação financeira
   */
  static async finalizeFinancialRequest(client, message, chatId) {
    const description = message.body.trim();
    ConversationContext.setData(chatId, 'description', description);

    await client.sendMessage(chatId, `✅ Sua solicitação financeira foi recebida!

Nossa equipe do financeiro entrará em contato em breve para atendê-lo.`);

    await NotificationService.notifyHumanSupport(client, chatId, 'Financeiro');
    NotificationService.logAction(chatId, 'Financial request completed');

    ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
  }
}

module.exports = FinancialHandler;
