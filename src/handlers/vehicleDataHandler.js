/**
 * Handler de dados do veículo
 * Gerencia a coleta de modelo e ano do veículo
 */

const { CONVERSATION_STATES } = require('../config/constants');
const ConversationContext = require('../services/conversationContext');
const messages = require('../flows/messages');

class VehicleDataHandler {
  /**
   * Inicia coleta de dados do veículo para serviços
   */
  static async startServicesVehicleCollection(client, chatId) {
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_VEHICLE_MODEL);
    ConversationContext.setData(chatId, 'flow', 'services');
    await client.sendMessage(chatId, messages.requests.vehicleModel());
  }

  /**
   * Inicia coleta de dados do veículo para vendas
   */
  static async startSalesVehicleCollection(client, chatId) {
    ConversationContext.setState(chatId, CONVERSATION_STATES.SALES_COLLECTING_VEHICLE_MODEL);
    ConversationContext.setData(chatId, 'flow', 'sales');
    await client.sendMessage(chatId, messages.requests.vehicleModel());
  }

  /**
   * Coleta modelo do veículo
   */
  static async collectVehicleModel(client, message, chatId) {
    const vehicleModel = message.body.trim();
    ConversationContext.setData(chatId, 'vehicleModel', vehicleModel);

    const flow = ConversationContext.getData(chatId, 'flow');

    if (flow === 'services') {
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_VEHICLE_YEAR);
    } else if (flow === 'sales') {
      ConversationContext.setState(chatId, CONVERSATION_STATES.SALES_COLLECTING_VEHICLE_YEAR);
    }

    await client.sendMessage(chatId, messages.confirmations.dataReceived());
    await client.sendMessage(chatId, messages.requests.vehicleYear());
  }

  /**
   * Coleta ano do veículo e redireciona para próxima etapa
   */
  static async collectVehicleYear(client, message, chatId) {
    const vehicleYear = message.body.trim();
    ConversationContext.setData(chatId, 'vehicleYear', vehicleYear);

    await client.sendMessage(chatId, messages.confirmations.dataReceived());

    const flow = ConversationContext.getData(chatId, 'flow');

    if (flow === 'services') {
      // Mostra menu de serviços
      ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_MENU);
      await client.sendMessage(chatId, messages.servicesMenu());
    } else if (flow === 'sales') {
      // Inicia coleta de dados para vendas
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
      ConversationContext.setData(chatId, 'serviceType', 'Venda de peça');
      await client.sendMessage(chatId, messages.requests.partName());
    }
  }
}

module.exports = VehicleDataHandler;
