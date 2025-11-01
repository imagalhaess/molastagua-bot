/**
 * Formatador de mensagens
 * Padroniza a formatação de mensagens enviadas pelo bot
 */

/**
 * Formata texto com negrito
 * @param {string} text - Texto a ser formatado
 * @returns {string} - Texto formatado
 */
const bold = (text) => `*${text}*`;

/**
 * Formata texto com itálico
 * @param {string} text - Texto a ser formatado
 * @returns {string} - Texto formatado
 */
const italic = (text) => `_${text}_`;

/**
 * Cria uma lista numerada
 * @param {Array<string>} items - Itens da lista
 * @returns {string} - Lista formatada
 */
const numberedList = (items) => {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
};

/**
 * Cria separador visual
 * @returns {string} - Linha separadora
 */
const separator = () => '\n━━━━━━━━━━━━━━━━━━\n';

/**
 * Formata opções de menu
 * @param {Array<{key: string, label: string}>} options - Opções do menu
 * @returns {string} - Menu formatado
 */
const formatMenu = (options) => {
  return options.map(opt => `${bold(opt.key)} - ${opt.label}`).join('\n');
};

/**
 * Formata lista de informações coletadas
 * @param {Object} data - Dados coletados
 * @returns {string} - Resumo formatado
 */
const formatCollectedData = (data) => {
  const lines = [];

  if (data.serviceType) lines.push(`${bold('Serviço:')} ${data.serviceType}`);
  if (data.partName) lines.push(`${bold('Peça:')} ${data.partName}`);
  if (data.location) lines.push(`${bold('Localização:')} ${data.location}`);
  if (data.quantity) lines.push(`${bold('Quantidade:')} ${data.quantity}`);
  if (data.size) lines.push(`${bold('Tamanho:')} ${data.size}`);
  if (data.type) lines.push(`${bold('Tipo:')} ${data.type}`);
  if (data.description) lines.push(`${bold('Descrição:')} ${data.description}`);
  if (data.hasPhoto) lines.push(`${bold('Foto:')} Enviada ✓`);

  return lines.join('\n');
};

module.exports = {
  bold,
  italic,
  numberedList,
  separator,
  formatMenu,
  formatCollectedData
};
