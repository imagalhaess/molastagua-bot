/**
 * Validador de horário de atendimento
 * Verifica se está dentro do horário de funcionamento
 */

const { config } = require('../config/environment');

/**
 * Verifica se o horário atual está dentro do período de atendimento
 * @param {Date} date - Data a ser verificada (opcional, default: agora)
 * @returns {boolean} - true se está em horário de atendimento
 */
const isBusinessHours = (date = new Date()) => {
  const dayOfWeek = date.getDay();
  const currentTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  // Verifica se é dia de funcionamento
  if (!config.businessHours.days.includes(dayOfWeek)) {
    return false;
  }

  // Verifica se está dentro do horário
  return currentTime >= config.businessHours.start && currentTime <= config.businessHours.end;
};

/**
 * Retorna a próxima data/hora de atendimento disponível
 * @returns {string} - Descrição da próxima data/hora de atendimento
 */
const getNextBusinessTime = () => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const daysOfWeek = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  // Se hoje é dia de atendimento mas já passou o horário
  if (config.businessHours.days.includes(currentDay) && currentTime > config.businessHours.end) {
    const nextDay = findNextBusinessDay(currentDay);
    return `${daysOfWeek[nextDay]} às ${config.businessHours.start}`;
  }

  // Se hoje não é dia de atendimento
  if (!config.businessHours.days.includes(currentDay)) {
    const nextDay = findNextBusinessDay(currentDay);
    return `${daysOfWeek[nextDay]} às ${config.businessHours.start}`;
  }

  // Se ainda não começou o expediente hoje
  return `hoje às ${config.businessHours.start}`;
};

/**
 * Encontra o próximo dia útil de atendimento
 * @param {number} currentDay - Dia da semana atual (0-6)
 * @returns {number} - Próximo dia útil
 */
const findNextBusinessDay = (currentDay) => {
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    if (config.businessHours.days.includes(nextDay)) {
      return nextDay;
    }
  }
  return config.businessHours.days[0];
};

module.exports = {
  isBusinessHours,
  getNextBusinessTime
};
