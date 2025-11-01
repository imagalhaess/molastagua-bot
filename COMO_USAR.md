#  Como Usar o MolasTag Bot

##  Configuração Inicial

### 1. Edite o arquivo `.env`

Abra o arquivo `.env` e configure com os dados reais da sua empresa:

```bash
# Configurações da Oficina
COMPANY_NAME=MolasTag
COMPANY_ADDRESS=Sua Rua Real, 123 - Bairro - Cidade/UF
PAYMENT_METHODS=Dinheiro, PIX, Cartão de Crédito/Débito, Boleto

# Horário de Atendimento (formato 24h)
# Segunda a Sexta: 08:00 - 17:00
WEEKDAY_START=08:00
WEEKDAY_END=17:00

# Sábado: 08:00 - 12:00
SATURDAY_START=08:00
SATURDAY_END=12:00

# Tempo de resposta para orçamentos (em minutos)
BUDGET_RESPONSE_TIME=45

# Ambiente
NODE_ENV=production
```

### 2. Instale as Dependências (se ainda não fez)

```bash
npm install
```

### 3. Inicie o Bot

```bash
npm start
```

### 4. Escaneie o QR Code

1. Um QR Code aparecerá no terminal
2. Abra o WhatsApp no celular
3. Vá em: **Menu > Aparelhos conectados**
4. Clique em: **Conectar um aparelho**
5. Escaneie o QR Code que apareceu no terminal
6. Aguarde a mensagem: **Bot inicializado com sucesso!**

---

##  Como Funciona

### Para Clientes

1. **Cliente envia mensagem** para o número conectado
2. **Bot responde** com boas-vindas e informações da empresa
3. **Verifica horário** - Se fora do expediente, informa quando retorna
4. **Menu interativo** aparece com 4 opções:
   - `1` - Serviços
   - `2` - Vendas
   - `3` - Financeiro
   - `4` - Falar com atendente

5. **Coleta informações** de forma guiada
6. **Confirma recebimento** e informa tempo de resposta
7. **Notifica atendente** automaticamente

### Comandos Especiais

- Digite `menu` a qualquer momento para voltar ao início

---

##  Fluxos Disponíveis

### 1️⃣ Serviços

Opções disponíveis:
- **Orçamento** - Reforçar veículo
- **Molas** - Troca ou arquear
  - Coleta: nome da peça, localização, quantidade, foto
- **Suporte** - Troca ou recuperação
  - Coleta: nome da peça, localização, quantidade, foto
- **Balança** - Troca ou recuperação
  - Coleta: nome da peça, quantidade, foto
- **Tirante** - Troca de bucha ou tirante completo
  - Coleta: nome da peça, tipo (fixo/regulagem), tamanho, quantidade, foto
- **Outros** - Serviços não listados
  - Coleta: descrição livre

### 2️⃣ Vendas

- Coleta informações sobre a peça desejada
- Localização, quantidade e foto

### 3️⃣ Financeiro

- Segunda via de boleto
- Segunda via de nota fiscal
- Outras questões financeiras

### 4️⃣ Atendimento Humano

- Transfere imediatamente para atendente
- Envia contexto da conversa

---

##  Sistema de Notificações

Quando um cliente solicita algo, o bot:

1. ✅ Coleta todas as informações
2. ✅ Gera um resumo estruturado
3. ✅ Envia notificação para o número configurado em `HUMAN_SUPPORT_NUMBER`
4. ✅ Inclui histórico da conversa

**Exemplo de notificação:**

```
🔔 NOVA SOLICITAÇÃO

📱 Cliente: 5511988887777@c.us
📋 Tipo: Troca de mola

📋 RESUMO DO ATENDIMENTO

⏰ Iniciado em: 01/11/2025 18:30:15

Informações coletadas:
• serviceType: Troca de mola
• partName: Mola dianteira Fiat Uno
• location: dianteiro esquerdo
• quantity: 1
• hasPhoto: true
```

---

##  Personalização

### Alterar Mensagens

Edite o arquivo: `src/flows/messages.js`

```javascript
// Exemplo: Mudar boas-vindas
welcome: () => {
  return `Olá! Bem-vindo à ${bold(config.company.name)}! 👋

Sua mensagem personalizada aqui...`;
}
```

### Adicionar Novos Serviços

Siga o guia em: `GUIA_APRENDIZADO.md` seção "Como Expandir o Projeto"

### Alterar Horários

Edite o arquivo: `.env`

```env
# Segunda a Sexta
WEEKDAY_START=09:00
WEEKDAY_END=19:00

# Sábado
SATURDAY_START=09:00
SATURDAY_END=13:00
```

---

## 🐛 Resolução de Problemas

### Bot não conecta

**Problema:** QR Code não aparece ou não conecta

**Solução:**
1. Certifique-se que o Node.js está atualizado (v14+)
2. Limpe a sessão: `rm -rf .wwebjs_auth`
3. Reinicie o bot: `npm start`

---

### Não vejo os logs de atendimento

**Problema:** Logs não aparecem no console

**Solução:**
1. Certifique-se de que o bot está rodando no terminal
2. Logs aparecem quando cliente solicita atendimento humano
3. Verifique se o console não está ocultando saídas

---

### Mensagens fora de ordem

**Problema:** Bot responde mensagens antigas

**Solução:**
1. Reinicie o bot
2. Se persistir, limpe contextos antigos
3. Verifique logs no console

---

### Erro "Cannot find module"

**Problema:** Erro ao iniciar

**Solução:**
```bash
rm -rf node_modules
npm install
npm start
```

---

##  Monitoramento

### Logs

O bot exibe logs no console:

```
✅ Aguardando mensagens...

📨 Nova mensagem de 5511988887777@c.us:
   Conteúdo: Olá

[2025-11-01T18:30:15.123Z] Chat: 5511988887777@c.us | Action: Budget request completed
```

### Limpeza Automática

- Conversas inativas são limpas a cada 6 horas
- Libera memória automaticamente
- Mantém apenas conversas ativas

---

##  Segurança

### Dados Sensíveis

✅ **Protegidos:**
- Arquivo `.env` não vai para o GitHub (`.gitignore`)
- Token de autenticação local (`.wwebjs_auth`)

❌ **NUNCA faça:**
- Commitar arquivo `.env`
- Compartilhar sessão do WhatsApp
- Expor credenciais em código

---

## 🚀 Colocando em Produção

### Opção 1: VPS (Servidor Próprio)

1. Alugue um servidor (DigitalOcean, AWS, etc)
2. Instale Node.js
3. Clone o repositório
4. Configure `.env`
5. Use PM2 para manter rodando:

```bash
npm install -g pm2
pm2 start index.js --name molastagua-bot
pm2 save
pm2 startup
```

### Opção 2: Docker

```dockerfile
# Dockerfile (criar na raiz)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
```

```bash
docker build -t molastagua-bot .
docker run -d --name bot molastagua-bot
```

---

##  Melhorias Futuras

### Banco de Dados

Substitua o Map por MongoDB:

```bash
npm install mongodb
```

```javascript
// Exemplo
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL);

// Substituir Map por coleção MongoDB
await client.db('chatbot').collection('conversations').insertOne({
  chatId,
  state,
  data,
  createdAt: new Date()
});
```

### Dashboard Web

Adicione interface administrativa:

```bash
npm install express ejs
```

Crie rotas para visualizar:
- Conversas ativas
- Histórico de atendimentos
- Estatísticas

### Inteligência Artificial

Integre com OpenAI para respostas inteligentes:

```bash
npm install openai
```

---

##  Suporte

- **GitHub Issues:** https://github.com/imagalhaess/molastagua-bot/issues
- **Documentação:** `README.md`
- **Guia de Aprendizado:** `GUIA_APRENDIZADO.md`

---

##  Checklist de Produção

Antes de colocar em produção:

- [ ] `.env` configurado com dados reais
- [ ] `HUMAN_SUPPORT_NUMBER` correto e testado
- [ ] Horários de atendimento ajustados
- [ ] Mensagens personalizadas
- [ ] Testado todos os fluxos manualmente
- [ ] Servidor/VPS preparado
- [ ] PM2 ou Docker configurado
- [ ] Backup da sessão WhatsApp
- [ ] Monitoramento de logs ativo
- [ ] Número do atendente salvo no WhatsApp

---

**🎉 Pronto! Seu bot está pronto para uso!**

Qualquer dúvida, consulte `GUIA_APRENDIZADO.md` ou abra uma issue no GitHub.

---

## Sistema de Notificação para Atendimento Humano

### Como Funciona

O bot e o atendente humano **compartilham o mesmo número do WhatsApp**. Quando um cliente precisa de atendimento humano:

1. **Bot coleta informações** do cliente (nome da peça, localização, quantidade, fotos, etc.)
2. **Bot confirma recebimento** para o cliente
3. **Bot registra LOG DETALHADO no console** com todo o contexto
4. **Atendente visualiza o log** e assume a conversa manualmente
5. **Atendente responde** diretamente no WhatsApp como faria normalmente

### Exemplo de Uso Prático

**Situação:** Cliente solicita orçamento de mola

1. Cliente conversa com o bot
2. Bot coleta: tipo de serviço, nome da peça, localização, quantidade, foto
3. Console exibe:
   ```
   ============================================================
   ATENDIMENTO HUMANO SOLICITADO
   ============================================================
   Cliente: 5561999887766
   Tipo: Orçamento - Troca de mola
   ...
   ```
4. Atendente vê o log no console
5. Atendente abre o WhatsApp e responde para 5561999887766
6. Atendente tem todo o contexto da conversa disponível

### Vantagens

- **Sem transferências:** Cliente continua no mesmo chat
- **Contexto preservado:** Atendente sabe tudo que foi conversado
- **Flexível:** Atendente assume quando necessário
- **Natural:** Cliente não percebe a transição bot → humano

### Logs Disponíveis

Todos os logs ficam visíveis no console onde o bot está rodando:
- Tipo de solicitação
- Dados coletados
- Horário da solicitação
- Histórico da conversa
- Indicação se há fotos anexadas

