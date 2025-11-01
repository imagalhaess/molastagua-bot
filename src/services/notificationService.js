/**
 * Serviço de notificações
 * Gerencia notificações para atendentes humanos
 *
 * IMPORTANTE: O bot e o atendente humano compartilham o mesmo número.
 * As notificações são apenas logs internos para que o atendente saiba
 * quando precisa assumir manualmente a conversa.
 */

const ConversationContext = require('./conversationContext');

class NotificationService {
  /**
   * Registra solicitação de atendimento humano
   * Gera log detalhado para o atendente assumir a conversa
   * @param {Object} client - Cliente WhatsApp
   * @param {string} chatId - ID do chat do cliente
   * @param {string} type - Tipo de solicitação
   */
  static async notifyHumanSupport(client, chatId, type) {
    try {
      const summary = ConversationContext.generateSummary(chatId);
      const allData = ConversationContext.getAllData(chatId);
      const phoneNumber = chatId.replace('@c.us', '');

      // Log detalhado no console para o atendente
      console.log('\n' + '='.repeat(60));
      console.log('ATENDIMENTO HUMANO SOLICITADO');
      console.log('='.repeat(60));
      console.log(`Cliente: ${phoneNumber}`);
      console.log(`Tipo: ${type}`);
      console.log(`Horário: ${new Date().toLocaleString('pt-BR')}`);
      console.log('-'.repeat(60));
      console.log('CONTEXTO DA CONVERSA:');
      console.log(summary);

      if (allData.photoMessage) {
        console.log('-'.repeat(60));
        console.log('MÍDIA: Cliente enviou foto(s)');
      }

      console.log('='.repeat(60));
      console.log('AÇÃO: Atendente deve assumir a conversa manualmente');
      console.log('='.repeat(60) + '\n');

      // Marca no contexto que está aguardando atendente
      ConversationContext.setData(chatId, 'awaitingHumanSupport', true);
      ConversationContext.setData(chatId, 'humanSupportRequestedAt', new Date().toISOString());

    } catch (error) {
      console.error('Erro ao registrar solicitação de atendimento humano:', error);
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
