/**
 * Configurações de ambiente
 * Gerencia variáveis de ambiente e validações
 */

require('dotenv').config();

const validateEnv = () => {
  const requiredVars = [
    'COMPANY_NAME',
    'COMPANY_ADDRESS',
    'PAYMENT_METHODS',
    'WEEKDAY_START',
    'WEEKDAY_END',
    'SATURDAY_START',
    'SATURDAY_END'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }
};

const config = {
  company: {
    name: process.env.COMPANY_NAME || 'MolasTag',
    address: process.env.COMPANY_ADDRESS || '',
    paymentMethods: process.env.PAYMENT_METHODS || ''
  },
  businessHours: {
    weekday: {
      start: process.env.WEEKDAY_START || '08:00',
      end: process.env.WEEKDAY_END || '17:00',
      days: [1, 2, 3, 4, 5] // Segunda a Sexta
    },
    saturday: {
      start: process.env.SATURDAY_START || '08:00',
      end: process.env.SATURDAY_END || '12:00',
      day: 6 // Sábado
    }
  },
  budgetResponseTime: parseInt(process.env.BUDGET_RESPONSE_TIME || '45', 10),
  humanSupportNumber: process.env.HUMAN_SUPPORT_NUMBER || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = {
  config,
  validateEnv
};
