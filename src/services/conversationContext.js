/**
 * Gerenciador de contexto de conversação
 * Armazena temporariamente o estado e dados de cada conversa
 */

const { CONVERSATION_STATES } = require('../config/constants');

// Armazena contextos de todas as conversas ativas
// Em produção, isso deveria ser um banco de dados
const conversations = new Map();

class ConversationContext {
  /**
   * Inicializa um novo contexto de conversa
   * @param {string} chatId - ID único do chat
   */
  static initialize(chatId) {
    conversations.set(chatId, {
      state: CONVERSATION_STATES.INITIAL,
      data: {},
      history: [],
      createdAt: new Date(),
      lastInteraction: new Date()
    });
  }

  /**
   * Obtém o contexto de uma conversa
   * @param {string} chatId - ID do chat
   * @returns {Object} - Contexto da conversa
   */
  static get(chatId) {
    if (!conversations.has(chatId)) {
      this.initialize(chatId);
    }
    return conversations.get(chatId);
  }

  /**
   * Atualiza o estado da conversa
   * @param {string} chatId - ID do chat
   * @param {string} newState - Novo estado
   */
  static setState(chatId, newState) {
    const context = this.get(chatId);
    context.state = newState;
    context.lastInteraction = new Date();
    this.addToHistory(chatId, `State changed to: ${newState}`);
  }

  /**
   * Obtém o estado atual da conversa
   * @param {string} chatId - ID do chat
   * @returns {string} - Estado atual
   */
  static getState(chatId) {
    return this.get(chatId).state;
  }

  /**
   * Armazena dados coletados durante a conversa
   * @param {string} chatId - ID do chat
   * @param {string} key - Chave do dado
   * @param {any} value - Valor do dado
   */
  static setData(chatId, key, value) {
    const context = this.get(chatId);
    context.data[key] = value;
    context.lastInteraction = new Date();
    this.addToHistory(chatId, `Data collected: ${key} = ${value}`);
  }

  /**
   * Obtém um dado específico do contexto
   * @param {string} chatId - ID do chat
   * @param {string} key - Chave do dado
   * @returns {any} - Valor do dado
   */
  static getData(chatId, key) {
    return this.get(chatId).data[key];
  }

  /**
   * Obtém todos os dados coletados
   * @param {string} chatId - ID do chat
   * @returns {Object} - Todos os dados
   */
  static getAllData(chatId) {
    return this.get(chatId).data;
  }

  /**
   * Adiciona entrada ao histórico da conversa
   * @param {string} chatId - ID do chat
   * @param {string} entry - Entrada de histórico
   */
  static addToHistory(chatId, entry) {
    const context = this.get(chatId);
    context.history.push({
      timestamp: new Date(),
      entry
    });
  }

  /**
   * Reseta o contexto da conversa
   * @param {string} chatId - ID do chat
   */
  static reset(chatId) {
    this.initialize(chatId);
  }

  /**
   * Remove conversas inativas (mais de 24 horas)
   * Útil para gerenciamento de memória
   */
  static cleanupInactive() {
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    for (const [chatId, context] of conversations.entries()) {
      if (now - context.lastInteraction > twentyFourHours) {
        conversations.delete(chatId);
      }
    }
  }

  /**
   * Gera resumo do contexto para transferência a atendente humano
   * @param {string} chatId - ID do chat
   * @returns {string} - Resumo formatado
   */
  static generateSummary(chatId) {
    const context = this.get(chatId);
    const data = context.data;

    let summary = '*RESUMO DO ATENDIMENTO*\n\n';
    summary += `Iniciado em: ${context.createdAt.toLocaleString('pt-BR')}\n\n`;

    if (Object.keys(data).length > 0) {
      summary += '*Informações coletadas:*\n';
      for (const [key, value] of Object.entries(data)) {
        summary += `• ${key}: ${value}\n`;
      }
    }

    return summary;
  }
}

module.exports = ConversationContext;
