/**
 * Handler de serviços
 * Gerencia o fluxo de serviços (molas, suporte, balança, tirante, etc)
 */

const { MENU_OPTIONS, CONVERSATION_STATES } = require('../config/constants');
const ConversationContext = require('../services/conversationContext');
const NotificationService = require('../services/notificationService');
const messages = require('../flows/messages');

class ServicesHandler {
  /**
   * Processa menu principal de serviços
   */
  static async handleServicesMenu(client, message, chatId) {
    const option = message.body.trim();

    switch (option) {
      case MENU_OPTIONS.SERVICES.BUDGET:
        return this.handleBudgetRequest(client, chatId);

      case MENU_OPTIONS.SERVICES.SPRINGS:
        ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_SPRINGS);
        await client.sendMessage(chatId, messages.springsMenu());
        break;

      case MENU_OPTIONS.SERVICES.SUPPORT:
        ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_SUPPORT);
        await client.sendMessage(chatId, messages.supportMenu());
        break;

      case MENU_OPTIONS.SERVICES.BALANCE:
        ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_BALANCE);
        await client.sendMessage(chatId, messages.balanceMenu());
        break;

      case MENU_OPTIONS.SERVICES.TIE_ROD:
        ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_TIE_ROD);
        await client.sendMessage(chatId, messages.tieRodMenu());
        break;

      case MENU_OPTIONS.SERVICES.OTHER:
        ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_DESCRIPTION);
        ConversationContext.setData(chatId, 'serviceType', 'Outros serviços');
        await client.sendMessage(chatId, messages.requests.description());
        break;

      case MENU_OPTIONS.SERVICES.BACK:
        ConversationContext.setState(chatId, CONVERSATION_STATES.MAIN_MENU);
        await client.sendMessage(chatId, messages.mainMenu());
        break;

      default:
        await client.sendMessage(chatId, messages.errors.invalidOption());
        await client.sendMessage(chatId, messages.servicesMenu());
    }
  }

  /**
   * Processa solicitação de orçamento
   */
  static async handleBudgetRequest(client, chatId) {
    ConversationContext.setData(chatId, 'serviceType', 'Orçamento - Reforçar veículo');
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_DESCRIPTION);

    await client.sendMessage(chatId, 'Por favor, descreva o que você precisa para reforçar seu veículo:');
  }

  /**
   * Processa submenu de molas - escolha do tipo (troca ou arquear)
   */
  static async handleSpringsSubmenu(client, message, chatId) {
    const option = message.body.trim();

    if (option === MENU_OPTIONS.SERVICES.BACK) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_MENU);
      await client.sendMessage(chatId, messages.servicesMenu());
      return;
    }

    let serviceType = '';
    let needsDetails = false;

    if (option === MENU_OPTIONS.SERVICE_DETAILS.SPRINGS_TYPE.EXCHANGE) {
      serviceType = 'Troca de mola';
      needsDetails = true; // Troca precisa de detalhes
    } else if (option === MENU_OPTIONS.SERVICE_DETAILS.SPRINGS_TYPE.ARCH) {
      serviceType = 'Arquear mola';
      needsDetails = false; // Arquear não precisa de detalhes
    } else {
      await client.sendMessage(chatId, messages.errors.invalidOption());
      await client.sendMessage(chatId, messages.springsMenu());
      return;
    }

    ConversationContext.setData(chatId, 'serviceType', serviceType);

    if (needsDetails) {
      // Troca: coleta detalhes
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
      await client.sendMessage(chatId, messages.requests.partName());
    } else {
      // Arquear: finaliza direto
      await this.finalizeBudgetWithoutDetails(client, chatId);
    }
  }

  /**
   * Finaliza orçamento sem coletar detalhes adicionais
   */
  static async finalizeBudgetWithoutDetails(client, chatId) {
    const allData = ConversationContext.getAllData(chatId);
    const serviceType = allData.serviceType || 'Serviço';

    await client.sendMessage(chatId, messages.confirmations.budgetReceived());

    await NotificationService.notifyHumanSupport(client, chatId, serviceType);
    NotificationService.logAction(chatId, `Budget request completed: ${serviceType}`);

    ConversationContext.setState(chatId, CONVERSATION_STATES.WAITING_HUMAN);
  }

  /**
   * Processa submenu de suporte
   */
  static async handleSupportSubmenu(client, message, chatId) {
    const option = message.body.trim();

    if (option === MENU_OPTIONS.SERVICES.BACK) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_MENU);
      await client.sendMessage(chatId, messages.servicesMenu());
      return;
    }

    if (option === MENU_OPTIONS.SERVICE_DETAILS.SUPPORT.EXCHANGE) {
      ConversationContext.setData(chatId, 'serviceType', 'Troca de suporte');
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
      await client.sendMessage(chatId, messages.requests.partName());
    } else {
      await client.sendMessage(chatId, messages.errors.invalidOption());
      await client.sendMessage(chatId, messages.supportMenu());
    }
  }

  /**
   * Processa submenu de balança
   */
  static async handleBalanceSubmenu(client, message, chatId) {
    const option = message.body.trim();

    if (option === MENU_OPTIONS.SERVICES.BACK) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_MENU);
      await client.sendMessage(chatId, messages.servicesMenu());
      return;
    }

    if (option === MENU_OPTIONS.SERVICE_DETAILS.BALANCE.EXCHANGE) {
      ConversationContext.setData(chatId, 'serviceType', 'Troca de balança');
      ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
      await client.sendMessage(chatId, messages.requests.partName());
    } else {
      await client.sendMessage(chatId, messages.errors.invalidOption());
      await client.sendMessage(chatId, messages.balanceMenu());
    }
  }

  /**
   * Processa submenu de tirante
   */
  static async handleTieRodSubmenu(client, message, chatId) {
    const option = message.body.trim();

    if (option === MENU_OPTIONS.SERVICES.BACK) {
      ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_MENU);
      await client.sendMessage(chatId, messages.servicesMenu());
      return;
    }

    let serviceType = '';
    if (option === MENU_OPTIONS.SERVICE_DETAILS.TIE_ROD.BUSHING_EXCHANGE) {
      serviceType = 'Troca de bucha de tirante';
    } else if (option === MENU_OPTIONS.SERVICE_DETAILS.TIE_ROD.FULL_EXCHANGE) {
      serviceType = 'Troca de tirante';
    } else {
      await client.sendMessage(chatId, messages.errors.invalidOption());
      await client.sendMessage(chatId, messages.tieRodMenu());
      return;
    }

    ConversationContext.setData(chatId, 'serviceType', serviceType);
    ConversationContext.setState(chatId, CONVERSATION_STATES.COLLECTING_PART_NAME);
    await client.sendMessage(chatId, messages.requests.partName());
  }
}

module.exports = ServicesHandler;
