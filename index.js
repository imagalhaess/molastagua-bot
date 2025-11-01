/**
 * MolasTagua Bot
 * Chatbot para atendimento automatizado via WhatsApp
 *
 * Este é o ponto de entrada da aplicação
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const { config, validateEnv } = require('./src/config/environment');
const MessageRouter = require('./src/middlewares/messageRouter');
const ConversationContext = require('./src/services/conversationContext');
const { getBusinessHoursDescription } = require('./src/utils/timeValidator');

// Valida variáveis de ambiente
try {
  validateEnv();
  console.log('✅ Variáveis de ambiente validadas com sucesso');
} catch (error) {
  console.error('❌ Erro nas variáveis de ambiente:', error.message);
  console.log('\n💡 Dica: Copie o arquivo .env.example para .env e configure os valores');
  process.exit(1);
}

// Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Evento: QR Code gerado
client.on('qr', (qr) => {
  console.log('\nQR Code gerado! Escaneie com seu WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nDica: Abra o WhatsApp > Aparelhos conectados > Conectar um aparelho\n');
});

// Evento: Cliente autenticado
client.on('authenticated', () => {
  console.log('Autenticação realizada com sucesso!');
});

// Evento: Falha na autenticação
client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação:', msg);
  process.exit(1);
});

// Evento: Cliente pronto
client.on('ready', () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Bot inicializado com sucesso!');
  console.log(`Empresa: ${config.company.name}`);
  console.log('Horário de funcionamento:');
  console.log(`  ${getBusinessHoursDescription().replace('\n', '\n  ')}`);
  console.log(`Ambiente: ${config.nodeEnv}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Aguardando mensagens...\n');
});

// Evento: Nova mensagem recebida
client.on('message', async (message) => {
  try {
    // Ignora mensagens de status e grupos
    if (message.from === 'status@broadcast') return;
    if (message.from.includes('@g.us')) return;

    // Ignora mensagens enviadas pelo próprio bot
    if (message.fromMe) return;

    const chatId = message.from;
    const messageBody = message.body;

    console.log(`\nNova mensagem de ${chatId}:`);
    console.log(`   Conteúdo: ${messageBody || '[mídia]'}`);

    // Roteia a mensagem para o handler apropriado
    await MessageRouter.route(client, message);

  } catch (error) {
    console.error('Erro ao processar mensagem:', error);

    try {
      await client.sendMessage(
        message.from,
        'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou digite "menu".'
      );
    } catch (sendError) {
      console.error('Erro ao enviar mensagem de erro:', sendError);
    }
  }
});

// Evento: Desconectado
client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
  console.log('Tentando reconectar...');
});

// Limpeza de conversas inativas (executa a cada 6 horas)
cron.schedule('0 */6 * * *', () => {
  console.log('Executando limpeza de conversas inativas...');
  ConversationContext.cleanupInactive();
  console.log('Limpeza concluída');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});

process.on('SIGINT', async () => {
  console.log('\n\nEncerrando bot...');
  await client.destroy();
  console.log('Bot encerrado com sucesso');
  process.exit(0);
});

// Inicia o cliente
console.log('Iniciando bot...\n');
client.initialize();
