/**
 * Handler de coleta de dados
 * Gerencia a coleta de informações do cliente
 */

const { CONVERSATION_STATES } = require('../config/constants');
const ConversationContext = require('../services/conversationContext');
const NotificationService = require('../services/notificationService');
const messages = require('../flows/messages');

class DataCollectionHandler {
  /**
   * Coleta nome da peça
   */
  static async collectPartName(client, message, chatId) {
    const partName = message.body.trim();
    ConversationContext.setData(chatId, 'partName', partName);

    const serviceType = ConversationContext.getData(chatId, 'serviceType');

    // Tirante tem fluxo diferente (precisa do tipo)
    if (serviceType && serviceType.toLowerCase().includes('tirante')) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_TIE_ROD_TYPE);
      await client.sendMessage(chatId, messages.confirmations.dataReceived());
      await client.sendMessage(chatId, messages.requests.tieRodType());
    }
    // Balança não precisa de localização
    else if (serviceType && serviceType.toLowerCase().includes('balança')) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_QUANTITY);
      await client.sendMessage(chatId, messages.confirmations.dataReceived());
      await client.sendMessage(chatId, messages.requests.quantity());
    }
    // Outros serviços precisam de localização
    else {
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_LOCATION);
      await client.sendMessage(chatId, messages.confirmations.dataReceived());
      await client.sendMessage(chatId, messages.requests.location());
    }
  }

  /**
   * Coleta localização da peça
   */
  static async collectLocation(client, message, chatId) {
    const location = message.body.trim();
    ConversationContext.setData(chatId, 'location', location);

    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_QUANTITY);
    await client.sendMessage(chatId, messages.confirmations.dataReceived());
    await client.sendMessage(chatId, messages.requests.quantity());
  }

  /**
   * Coleta quantidade
   */
  static async collectQuantity(client, message, chatId) {
    const quantity = message.body.trim();
    ConversationContext.setData(chatId, 'quantity', quantity);

    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PHOTO);
    await client.sendMessage(chatId, messages.confirmations.dataReceived());
    await client.sendMessage(chatId, messages.requests.photo());
  }

  /**
   * Coleta foto ou pula se não tiver
   */
  static async collectPhoto(client, message, chatId) {
    const hasPhoto = message.hasMedia;
    const textResponse = message.body.trim().toLowerCase();

    if (hasPhoto) {
      ConversationContext.setData(chatId, 'hasPhoto', true);
      ConversationContext.setData(chatId, 'photoMessage', message);
      await client.sendMessage(chatId, 'Foto recebida!');
    } else if (textResponse === 'pular') {
      ConversationContext.setData(chatId, 'hasPhoto', false);
      await client.sendMessage(chatId, 'Ok, continuando sem foto.');
    } else {
      await client.sendMessage(chatId, 'Por favor, envie uma foto ou digite "pular" para continuar.');
      return;
    }

    await this.finalizeBudgetRequest(client, chatId);
  }

  /**
   * Coleta tipo de tirante
   */
  static async collectTieRodType(client, message, chatId) {
    const option = message.body.trim();

    let type = '';
    if (option === '1') {
      type = 'Fixo';
    } else if (option === '2') {
      type = 'Regulagem';
    } else {
      await client.sendMessage(chatId, messages.errors.invalidOption());
      await client.sendMessage(chatId, messages.requests.tieRodType());
      return;
    }

    ConversationContext.setData(chatId, 'type', type);
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_SIZE);
    await client.sendMessage(chatId, messages.confirmations.dataReceived());
    await client.sendMessage(chatId, messages.requests.size());
  }

  /**
   * Coleta tamanho (para tirante)
   */
  static async collectSize(client, message, chatId) {
    const size = message.body.trim();
    ConversationContext.setData(chatId, 'size', size);

    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_QUANTITY);
    await client.sendMessage(chatId, messages.confirmations.dataReceived());
    await client.sendMessage(chatId, messages.requests.quantity());
  }

  /**
   * Coleta descrição livre (para outros serviços)
   */
  static async collectDescription(client, message, chatId) {
    const description = message.body.trim();
    ConversationContext.setData(chatId, 'description', description);

    await this.finalizeBudgetRequest(client, chatId);
  }

  /**
   * Finaliza solicitação de orçamento
   */
  static async finalizeBudgetRequest(client, chatId) {
    const allData = ConversationContext.getAllData(chatId);
    const serviceType = allData.serviceType || 'Serviço';

    // Mostra resumo
    const summary = messages.helpers.confirmationSummary(allData);
    await client.sendMessage(chatId, summary);

    // Confirma recebimento
    await client.sendMessage(chatId, messages.confirmations.budgetReceived());

    // Notifica atendente
    await NotificationService.notifyHumanSupport(client, chatId, serviceType);

    // Log da ação
    NotificationService.logAction(chatId, `Budget request completed: ${serviceType}`);

    // Reseta para menu principal
    ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
  }
}

module.exports = DataCollectionHandler;
