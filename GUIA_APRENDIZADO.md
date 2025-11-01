# Guia de Aprendizado - MolasTag Bot

Este documento foi criado para ajudá-lo a **aprender** com este projeto. Vamos explorar os conceitos, padrões e melhores práticas aplicadas.

---

## Objetivos de Aprendizado

Após estudar este projeto, você será capaz de:

1. Estruturar projetos Node.js de forma profissional
2. Aplicar princípios de Clean Code
3. Implementar arquitetura modular
4. Gerenciar estado de aplicação
5. Trabalhar com APIs externas (WhatsApp)
6. Usar variáveis de ambiente de forma segura
7. Documentar código profissionalmente

---

##  Arquitetura Explicada

### Por que essa estrutura?

```
src/
├── config/         # Configurações centralizadas
├── flows/          # Fluxos de conversa (UX)
├── handlers/       # Lógica de negócio (Controllers)
├── middlewares/    # Roteamento (Interceptadores)
├── services/       # Serviços reutilizáveis (Business Logic)
└── utils/          # Funções auxiliares puras
```

**Princípio aplicado:** Separation of Concerns (Separação de Responsabilidades)

Cada pasta tem uma responsabilidade clara:
- **config**: "Onde ficam as configurações?"
- **flows**: "Quais mensagens o bot envia?"
- **handlers**: "Como processar cada tipo de solicitação?"
- **services**: "Quais operações são compartilhadas?"
- **utils**: "Quais funções auxiliares preciso?"

---

##  Conceitos Importantes

### 1. Clean Code

#### Nomes Descritivos
```javascript
// ❌ Ruim
function proc(m) { ... }

// ✅ Bom
function processMessage(message) { ... }
```

#### Funções Pequenas
```javascript
// ❌ Ruim - função faz muitas coisas
function handleEverything(data) {
  validateData(data);
  saveToDatabase(data);
  sendEmail(data);
  logAction(data);
  updateCache(data);
}

// ✅ Bom - cada função faz uma coisa
function processRequest(data) {
  const validated = validateData(data);
  await saveRequest(validated);
  await notifyUser(validated);
}
```

**Veja no projeto:** `src/handlers/dataCollectionHandler.js:49` - Cada método coleta apenas um tipo de dado.

---

### 2. Gerenciamento de Estado

#### O que é Estado?
Estado é a "memória" da aplicação. No nosso bot, precisamos lembrar:
- Em que etapa da conversa o usuário está
- Quais dados já foram coletados
- Quando foi a última interação

#### Como implementamos?
```javascript
// src/services/conversationContext.js
const conversations = new Map();
```

**Map** é uma estrutura de dados que armazena pares chave-valor:
- **Chave**: ID do chat (único por usuário)
- **Valor**: Objeto com estado e dados

```javascript
{
  state: 'COLLECTING_PART_NAME',
  data: { serviceType: 'Troca de mola' },
  history: [...],
  createdAt: Date,
  lastInteraction: Date
}
```

**Por que Map e não Object?**
- Map é otimizado para adição/remoção frequente
- Chaves podem ser de qualquer tipo
- Iteração mais eficiente

---

### 3. Padrão Handler

#### O que é um Handler?
Handler = Manipulador = Controlador

É uma classe/função que **manipula** uma ação específica.

```javascript
// src/handlers/servicesHandler.js
class ServicesHandler {
  static async handleServicesMenu(client, message, chatId) {
    // Lógica específica para menu de serviços
  }
}
```

**Benefícios:**
- Código organizado por funcionalidade
- Fácil de testar individualmente
- Fácil de manter e expandir

---

### 4. Padrão Router

#### O que é um Router?
Router = Roteador = Direcionador

Recebe a mensagem e **direciona** para o handler correto.

```javascript
// src/middlewares/messageRouter.js
switch (currentState) {
  case CONVERSATION_STATES.MAIN_MENU:
    await this.handleMainMenu(client, message, chatId);
    break;

  case CONVERSATION_STATES.SERVICES_MENU:
    await ServicesHandler.handleServicesMenu(client, message, chatId);
    break;
}
```

**Analogia:** Como um atendente que encaminha ligações para o departamento correto.

---

### 5. Variáveis de Ambiente

#### Por que usar .env?

**❌ NUNCA faça isso:**
```javascript
const apiKey = "abc123xyz456"; // Exposto no código!
```

**✅ SEMPRE faça isso:**
```javascript
// .env
API_KEY=abc123xyz456

// código
const apiKey = process.env.API_KEY;
```

**Razões:**
1. **Segurança**: Credenciais não vão para o Git
2. **Flexibilidade**: Configuração diferente por ambiente
3. **Equipe**: Cada dev pode ter suas próprias configurações

---

### 6. Async/Await

#### O que é?
JavaScript é **assíncrono**: operações podem demorar (rede, disco, etc).

**Problema:**
```javascript
// ❌ Isso não funciona!
const result = sendMessage(); // Retorna Promise, não o resultado
console.log(result); // undefined ou Promise
```

**Solução:**
```javascript
// ✅ Espera completar
const result = await sendMessage();
console.log(result); // Resultado real
```

**Regra:** Funções que usam `await` devem ser `async`.

```javascript
async function myFunction() {
  const result = await someAsyncOperation();
  return result;
}
```

---

##  Fluxo de Execução Passo a Passo

Vamos seguir uma mensagem do início ao fim:

### 1. Usuário envia "Olá"

```
index.js:91
client.on('message', async (message) => { ... })
```
**O que acontece:** Evento é disparado

---

### 2. Ignora casos especiais

```javascript
if (message.from === 'status@broadcast') return;
if (message.from.includes('@g.us')) return;
```
**O que acontece:** Filtra mensagens indesejadas

---

### 3. Roteia para MessageRouter

```javascript
await MessageRouter.route(client, message);
```
**O que acontece:** Encaminha para o roteador

---

### 4. Router verifica estado

```javascript
const currentState = ConversationContext.getState(chatId);
```
**O que acontece:** Busca em qual etapa o usuário está

---

### 5. Estado é INITIAL

```javascript
case CONVERSATION_STATES.INITIAL:
  await this.handleInitialContact(client, chatId);
```
**O que acontece:** Primeira vez conversando

---

### 6. Envia boas-vindas

```javascript
await client.sendMessage(chatId, messages.welcome());
```
**O que acontece:** Bot responde com saudação

---

### 7. Verifica horário

```javascript
if (!isBusinessHours()) {
  await client.sendMessage(chatId, messages.outsideBusinessHours());
  return;
}
```
**O que acontece:** Valida se está no expediente

---

### 8. Muda estado para MAIN_MENU

```javascript
ConversationContext.setState(chatId, CONVERSATION_STATES.MAIN_MENU);
```
**O que acontece:** Marca que usuário está no menu principal

---

### 9. Envia menu

```javascript
await client.sendMessage(chatId, messages.mainMenu());
```
**O que acontece:** Mostra opções para o usuário

---

### 10. Usuário responde "1"

Processo recomeça, mas agora o estado é **MAIN_MENU**, então o router direciona para outro handler!

---

##  Como Expandir o Projeto

### Adicionar novo serviço "Alinhamento"

#### 1. Adicione constante
```javascript
// src/config/constants.js
SERVICES: {
  ALIGNMENT: '7',  // Novo!
  // ... outros
}
```

#### 2. Crie estado
```javascript
CONVERSATION_STATES: {
  SERVICES_ALIGNMENT: 'SERVICES_ALIGNMENT',  // Novo!
  // ... outros
}
```

#### 3. Adicione mensagem
```javascript
// src/flows/messages.js
alignmentMenu: () => {
  return `${bold('SERVIÇO DE ALINHAMENTO')}

  Selecione a opção desejada:

  ${formatMenu([
    { key: '1', label: 'Alinhamento dianteiro' },
    { key: '2', label: 'Alinhamento completo' }
  ])}`;
}
```

#### 4. Crie handler
```javascript
// src/handlers/servicesHandler.js
static async handleAlignmentSubmenu(client, message, chatId) {
  const option = message.body.trim();
  // Lógica aqui
}
```

#### 5. Adicione rota
```javascript
// src/middlewares/messageRouter.js
case CONVERSATION_STATES.SERVICES_ALIGNMENT:
  await ServicesHandler.handleAlignmentSubmenu(client, message, chatId);
  break;
```

#### 6. Adicione no menu
```javascript
// src/handlers/servicesHandler.js
case MENU_OPTIONS.SERVICES.ALIGNMENT:
  ConversationContext.setState(chatId, CONVERSATION_STATES.SERVICES_ALIGNMENT);
  await client.sendMessage(chatId, messages.alignmentMenu());
  break;
```

**Pronto!** Novo serviço funcionando seguindo o mesmo padrão.

---

##  Como Debugar

### 1. Adicione logs estratégicos
```javascript
console.log('Estado atual:', currentState);
console.log('Dados coletados:', ConversationContext.getAllData(chatId));
```

### 2. Use try/catch
```javascript
try {
  await riskyOperation();
} catch (error) {
  console.error('Erro detalhado:', error);
}
```

### 3. Teste fluxos isolados
```javascript
// Teste apenas o handler
const result = await ServicesHandler.handleServicesMenu(
  mockClient,
  mockMessage,
  'test-chat-id'
);
```

---

##  Checklist de Boas Práticas

Ao adicionar código novo, pergunte-se:

- [ ] O nome da função/variável é claro?
- [ ] A função faz apenas uma coisa?
- [ ] Adicionei tratamento de erro?
- [ ] Comentei apenas o "porquê", não o "o quê"?
- [ ] Testei manualmente?
- [ ] Segui o padrão existente?
- [ ] Atualizei a documentação se necessário?

---

##  Exercícios Práticos

### Nível 1: Básico
1. Mude a mensagem de boas-vindas
2. Adicione uma nova forma de pagamento
3. Altere o horário de funcionamento

### Nível 2: Intermediário
1. Adicione validação de quantidade (apenas números)
2. Implemente comando "cancelar" para resetar conversa
3. Adicione log de todas as mensagens em arquivo

### Nível 3: Avançado
1. Integre com banco de dados MongoDB
2. Crie dashboard web para visualizar conversas
3. Implemente resposta automática com IA

---

## 📚 Recursos para Continuar Aprendendo

### Node.js
- [Documentação Oficial](https://nodejs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Clean Code
- Livro: "Clean Code" - Robert C. Martin
- Livro: "Código Limpo em JavaScript"

### JavaScript Assíncrono
- [MDN: Async/Await](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promises explicadas](https://javascript.info/promise-basics)

### Arquitetura
- [Padrões de Design](https://refactoring.guru/pt-br/design-patterns)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

##  Dicas Finais

1. **Leia o código devagar**: Não tenha pressa, entenda cada linha
2. **Modifique e teste**: Aprende-se fazendo, não só lendo
3. **Quebre coisas**: É um projeto local, teste à vontade
4. **Pergunte "por quê?"**: Entenda as decisões, não só copie
5. **Refatore**: Melhore o código gradualmente

---

**Boa jornada de aprendizado!** 🚀

Se tiver dúvidas, revise este guia ou consulte a documentação das tecnologias usadas.
