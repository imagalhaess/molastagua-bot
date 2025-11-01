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
    'BUSINESS_HOURS_START',
    'BUSINESS_HOURS_END',
    'BUSINESS_DAYS'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }
};

const config = {
  company: {
    name: process.env.COMPANY_NAME || 'Molas Tágua',
    address: process.env.COMPANY_ADDRESS || '',
    paymentMethods: process.env.PAYMENT_METHODS || ''
  },
  businessHours: {
    start: process.env.BUSINESS_HOURS_START || '08:00',
    end: process.env.BUSINESS_HOURS_END || '18:00',
    days: process.env.BUSINESS_DAYS
      ? process.env.BUSINESS_DAYS.split(',').map(Number)
      : [1, 2, 3, 4, 5, 6] // Segunda a Sábado
  },
  budgetResponseTime: parseInt(process.env.BUDGET_RESPONSE_TIME || '45', 10),
  humanSupportNumber: process.env.HUMAN_SUPPORT_NUMBER || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = {
  config,
  validateEnv
};
