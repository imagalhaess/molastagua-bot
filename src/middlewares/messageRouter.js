/**
 * Roteador de mensagens
 * Direciona mensagens para os handlers apropriados baseado no estado da conversa
 */

const { MENU_OPTIONS, CONVERSATION_STATES } = require("../config/constants");
const ConversationContext = require("../services/conversationContext");
const { isBusinessHours, getNextBusinessDay } = require("../utils/timeValidator");
const messages = require("../flows/messages");

const ServicesHandler = require("../handlers/servicesHandler");
const DataCollectionHandler = require("../handlers/dataCollectionHandler");
const SalesHandler = require("../handlers/salesHandler");
const FinancialHandler = require("../handlers/financialHandler");
const VehicleDataHandler = require("../handlers/vehicleDataHandler");

class MessageRouter {
  /**
   * Processa mensagem recebida
   */
  static async route(client, message) {
    const chatId = message.from;
    const messageBody = message.body.trim().toLowerCase();

    // Comando especial para voltar ao menu
    if (messageBody === "menu") {
      ConversationContext.reset(chatId);
      await this.handleInitialContact(client, chatId);
      return;
    }

    const currentState = ConversationContext.getState(chatId);

    // Roteamento baseado no estado atual
    switch (currentState) {
      case CONVERSATION_STATES.INITIAL:
        await this.handleInitialContact(client, chatId);
        break;

      case CONVERSATION_STATES.MAIN_MENU:
        await this.handleMainMenu(client, message, chatId);
        break;

      // Coleta de dados do veículo
      case CONVERSATION_STATES.COLLECTING_VEHICLE_MODEL:
        await VehicleDataHandler.collectVehicleModel(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_VEHICLE_YEAR:
        await VehicleDataHandler.collectVehicleYear(client, message, chatId);
        break;

      // Coleta de dados do veículo para vendas
      case CONVERSATION_STATES.SALES_COLLECTING_VEHICLE_MODEL:
        await VehicleDataHandler.collectVehicleModel(client, message, chatId);
        break;

      case CONVERSATION_STATES.SALES_COLLECTING_VEHICLE_YEAR:
        await VehicleDataHandler.collectVehicleYear(client, message, chatId);
        break;

      // Menus de serviços
      case CONVERSATION_STATES.SERVICES_MENU:
        await ServicesHandler.handleServicesMenu(client, message, chatId);
        break;

      case CONVERSATION_STATES.SERVICES_SPRINGS:
        await ServicesHandler.handleSpringsSubmenu(client, message, chatId);
        break;

      case CONVERSATION_STATES.SERVICES_SUPPORT:
        await ServicesHandler.handleSupportSubmenu(client, message, chatId);
        break;

      case CONVERSATION_STATES.SERVICES_BALANCE:
        await ServicesHandler.handleBalanceSubmenu(client, message, chatId);
        break;

      case CONVERSATION_STATES.SERVICES_TIE_ROD:
        await ServicesHandler.handleTieRodSubmenu(client, message, chatId);
        break;

      // Coleta de dados específicos
      case CONVERSATION_STATES.COLLECTING_PART_NAME:
        await DataCollectionHandler.collectPartName(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_LOCATION:
        await DataCollectionHandler.collectLocation(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_QUANTITY:
        await DataCollectionHandler.collectQuantity(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_PHOTO:
        await DataCollectionHandler.collectPhoto(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_TIE_ROD_TYPE:
        await DataCollectionHandler.collectTieRodType(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_SIZE:
        await DataCollectionHandler.collectSize(client, message, chatId);
        break;

      case CONVERSATION_STATES.COLLECTING_DESCRIPTION:
        const serviceType = ConversationContext.getData(chatId, "serviceType");
        if (serviceType === "Financeiro") {
          await FinancialHandler.finalizeFinancialRequest(
            client,
            message,
            chatId
          );
        } else {
          await DataCollectionHandler.collectDescription(
            client,
            message,
            chatId
          );
        }
        break;

      case CONVERSATION_STATES.SALES:
        await DataCollectionHandler.collectPartName(client, message, chatId);
        break;

      case CONVERSATION_STATES.AWAITING_CONFIRMATION:
        await DataCollectionHandler.handleConfirmation(client, message, chatId);
        break;

      case CONVERSATION_STATES.WAITING_HUMAN:
        await this.handleWaitingHuman(client, message, chatId);
        break;

      default:
        // Se chegou aqui sem estado definido, é um erro de lógica
        // Não envia mensagens automaticamente para evitar spam
        console.warn(`Estado desconhecido para ${chatId}: ${currentState}`);
        break;
    }
  }

  /**
   * Gerencia contato inicial
   */
  static async handleInitialContact(client, chatId) {
    // Envia boas-vindas
    await client.sendMessage(chatId, messages.welcome());

    // Verifica horário de atendimento
    if (!isBusinessHours()) {
      await client.sendMessage(chatId, messages.outsideBusinessHours());
      ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
      return;
    }

    // Envia menu principal
    ConversationContext.setState(chatId, CONVERSATION_STATES.MAIN_MENU);
    await client.sendMessage(chatId, messages.mainMenu());
  }

  /**
   * Gerencia menu principal
   */
  static async handleMainMenu(client, message, chatId) {
    const option = message.body.trim();

    switch (option) {
      case MENU_OPTIONS.MAIN.SERVICES:
        // Inicia coleta de dados do veículo para serviços
        await VehicleDataHandler.startServicesVehicleCollection(client, chatId);
        break;

      case MENU_OPTIONS.MAIN.SALES:
        // Inicia coleta de dados do veículo para vendas
        await VehicleDataHandler.startSalesVehicleCollection(client, chatId);
        break;

      case MENU_OPTIONS.MAIN.FINANCIAL:
        ConversationContext.setState(chatId, CONVERSATION_STATES.FINANCIAL);
        await FinancialHandler.handleFinancial(client, chatId);
        break;

      case MENU_OPTIONS.MAIN.HUMAN_SUPPORT:
        await client.sendMessage(
          chatId,
          messages.confirmations.transferringToHuman()
        );
        ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
        const {
          NotificationService,
        } = require("../services/notificationService");
        await NotificationService.notifyHumanSupport(
          client,
          chatId,
          "Solicitação de atendimento humano"
        );
        break;

      default:
        await client.sendMessage(chatId, messages.errors.invalidOption());
        await client.sendMessage(chatId, messages.mainMenu());
    }
  }

  /**
   * Gerencia estado de aguardando atendimento humano
   */
  static async handleWaitingHuman(client, message, chatId) {
    const option = message.body.trim();
    const nextDay = getNextBusinessDay();
    const contactTime = nextDay === 'em breve' ? nextDay : `na ${nextDay}`;

    if (option === '1') {
      // Mostra o pedido atual
      const allData = ConversationContext.getAllData(chatId);
      const summary = messages.helpers.confirmationSummary(allData);

      // Remove as opções de confirmação do resumo e mostra apenas os dados
      const summaryWithoutOptions = summary.split('\nDigite o número')[0];

      await client.sendMessage(chatId, summaryWithoutOptions);
      await client.sendMessage(chatId, messages.confirmations.waitingHumanOptions(contactTime));
    } else if (option === '2') {
      // Limpa dados e volta ao menu principal
      ConversationContext.clearData(chatId);
      ConversationContext.setState(chatId, CONVERSATION_STATES.MAIN_MENU);
      await client.sendMessage(chatId, messages.mainMenu());
    } else {
      // Opção inválida, mostra as opções novamente
      await client.sendMessage(chatId, messages.confirmations.waitingHumanOptions(contactTime));
    }
  }
}

module.exports = MessageRouter;
