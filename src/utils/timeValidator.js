/**
 * Validador de horário de atendimento
 * Verifica se está dentro do horário de funcionamento
 * Segunda a Sexta: 08:00 - 17:00
 * Sábado: 08:00 - 12:00
 */

const { config } = require('../config/environment');

/**
 * Obtém os horários de funcionamento para um dia específico
 * @param {number} dayOfWeek - Dia da semana (0-6, 0 = Domingo)
 * @returns {Object|null} - Objeto com start e end ou null se não funciona
 */
const getScheduleForDay = (dayOfWeek) => {
  // Segunda a Sexta (1-5)
  if (config.businessHours.weekday.days.includes(dayOfWeek)) {
    return {
      start: config.businessHours.weekday.start,
      end: config.businessHours.weekday.end
    };
  }

  // Sábado (6)
  if (dayOfWeek === config.businessHours.saturday.day) {
    return {
      start: config.businessHours.saturday.start,
      end: config.businessHours.saturday.end
    };
  }

  // Domingo (0) - Fechado
  return null;
};

/**
 * Verifica se o horário atual está dentro do período de atendimento
 * @param {Date} date - Data a ser verificada (opcional, default: agora)
 * @returns {boolean} - true se está em horário de atendimento
 */
const isBusinessHours = (date = new Date()) => {
  const dayOfWeek = date.getDay();
  const currentTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const schedule = getScheduleForDay(dayOfWeek);

  // Se não há horário para este dia, está fechado
  if (!schedule) {
    return false;
  }

  // Verifica se está dentro do horário
  return currentTime >= schedule.start && currentTime <= schedule.end;
};

/**
 * Formata a descrição do horário de funcionamento
 * @returns {string} - Descrição formatada dos horários
 */
const getBusinessHoursDescription = () => {
  const weekdayStart = config.businessHours.weekday.start;
  const weekdayEnd = config.businessHours.weekday.end;
  const saturdayStart = config.businessHours.saturday.start;
  const saturdayEnd = config.businessHours.saturday.end;

  return `Segunda a Sexta: ${weekdayStart} às ${weekdayEnd}\nSábado: ${saturdayStart} às ${saturdayEnd}`;
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

  const todaySchedule = getScheduleForDay(currentDay);

  // Se hoje é dia de atendimento mas já passou o horário
  if (todaySchedule && currentTime > todaySchedule.end) {
    const nextDay = findNextBusinessDay(currentDay);
    const nextSchedule = getScheduleForDay(nextDay);
    return `${daysOfWeek[nextDay]} às ${nextSchedule.start}`;
  }

  // Se hoje não é dia de atendimento
  if (!todaySchedule) {
    const nextDay = findNextBusinessDay(currentDay);
    const nextSchedule = getScheduleForDay(nextDay);
    return `${daysOfWeek[nextDay]} às ${nextSchedule.start}`;
  }

  // Se ainda não começou o expediente hoje
  if (currentTime < todaySchedule.start) {
    return `hoje às ${todaySchedule.start}`;
  }

  // Se está em horário de atendimento
  return `hoje até às ${todaySchedule.end}`;
};

/**
 * Encontra o próximo dia útil de atendimento
 * @param {number} currentDay - Dia da semana atual (0-6)
 * @returns {number} - Próximo dia útil
 */
const findNextBusinessDay = (currentDay) => {
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const schedule = getScheduleForDay(nextDay);
    if (schedule) {
      return nextDay;
    }
  }
  // Fallback para segunda-feira
  return 1;
};

module.exports = {
  isBusinessHours,
  getNextBusinessTime,
  getBusinessHoursDescription,
  getScheduleForDay
};
