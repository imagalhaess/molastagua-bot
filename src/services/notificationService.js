/**
 * Serviço de notificações
 * Gerencia notificações para atendentes humanos
 */

const { config } = require('../config/environment');
const ConversationContext = require('./conversationContext');

class NotificationService {
  /**
   * Notifica atendente sobre nova solicitação
   * @param {Object} client - Cliente WhatsApp
   * @param {string} chatId - ID do chat do cliente
   * @param {string} type - Tipo de solicitação
   */
  static async notifyHumanSupport(client, chatId, type) {
    if (!config.humanSupportNumber) {
      console.warn('⚠️  Número de atendente não configurado');
      return;
    }

    try {
      const summary = ConversationContext.generateSummary(chatId);
      const allData = ConversationContext.getAllData(chatId);

      let notification = `*NOVA SOLICITAÇÃO*\n\n`;
      notification += `Cliente: ${chatId}\n`;
      notification += `Tipo: ${type}\n\n`;
      notification += summary;

      // Envia notificação para o número do atendente
      const supportChatId = `${config.humanSupportNumber}@c.us`;
      await client.sendMessage(supportChatId, notification);

      // Se houver foto, encaminha também
      if (allData.photoMessage) {
        await client.sendMessage(supportChatId, 'Foto enviada pelo cliente:');
        // A foto seria encaminhada aqui
      }

      console.log(`Notificação enviada para atendente - Chat: ${chatId}`);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Registra log de atendimento
   * @param {string} chatId - ID do chat
   * @param {string} action - Ação realizada
   */
  static logAction(chatId, action) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Chat: ${chatId} | Action: ${action}`);

    // Em produção, isso seria salvo em banco de dados
    ConversationContext.addToHistory(chatId, `Action: ${action}`);
  }
}

module.exports = NotificationService;
