# 🤖 MolasTag Bot

Chatbot de atendimento automatizado via WhatsApp para oficina Molas Taguatinga, desenvolvido com Node.js seguindo princípios de Clean Code e arquitetura modular.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como ferramenta educacional e prática para automatizar o atendimento inicial de clientes via WhatsApp, coletando informações necessárias para orçamentos e encaminhando para atendimento humano quando necessário.

### ✨ Funcionalidades

- ✅ **Verificação de horário de atendimento** - Valida automaticamente se está dentro do expediente
- ✅ **Menu interativo** - Navegação intuitiva com opções numeradas
- ✅ **Coleta de dados estruturada** - Captura informações de forma organizada
- ✅ **Múltiplos fluxos de atendimento**:
  - Orçamentos (reforço de veículo, molas, suportes, balanças, tirantes)
  - Vendas de peças
  - Solicitações financeiras
  - Transferência para atendimento humano
- ✅ **Sistema de notificação** - Alerta atendentes sobre novas solicitações
- ✅ **Contexto de conversa** - Mantém histórico e dados coletados
- ✅ **Limpeza automática** - Remove conversas inativas periodicamente

## 🏗️ Arquitetura

O projeto segue uma arquitetura **modular e monolítica**, organizada em camadas claras:

```
molastagua-bot/
├── index.js                    # Ponto de entrada da aplicação
├── src/
│   ├── config/                 # Configurações
│   │   ├── constants.js        # Constantes do sistema
│   │   └── environment.js      # Variáveis de ambiente
│   ├── flows/                  # Fluxos de conversa
│   │   └── messages.js         # Mensagens do bot
│   ├── handlers/               # Controladores de lógica de negócio
│   │   ├── servicesHandler.js       # Gestão de serviços
│   │   ├── salesHandler.js          # Gestão de vendas
│   │   ├── financialHandler.js      # Gestão financeira
│   │   └── dataCollectionHandler.js # Coleta de dados
│   ├── middlewares/            # Camada de roteamento
│   │   └── messageRouter.js    # Roteador de mensagens
│   ├── services/               # Serviços de negócio
│   │   ├── conversationContext.js   # Gestão de contexto
│   │   └── notificationService.js   # Sistema de notificações
│   └── utils/                  # Utilitários
│       ├── timeValidator.js    # Validação de horário
│       └── messageFormatter.js # Formatação de mensagens
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Exemplo de configuração
├── .gitignore                  # Arquivos ignorados pelo Git
└── package.json                # Dependências e scripts
```

### 🎯 Princípios Aplicados

#### Clean Code
- **Nomes descritivos**: Variáveis, funções e classes com nomes claros
- **Funções pequenas**: Cada função tem uma única responsabilidade
- **Comentários estratégicos**: Documentação do "porquê", não do "o quê"
- **Código autoexplicativo**: Lógica clara sem necessidade de comentários excessivos

#### Separação de Responsabilidades
- **Config**: Configurações centralizadas
- **Handlers**: Lógica de negócio isolada
- **Services**: Operações reutilizáveis
- **Utils**: Funções auxiliares puras
- **Middlewares**: Roteamento e interceptação

## 🚀 Como Começar

### Pré-requisitos

- Node.js 14.0 ou superior
- npm ou yarn
- Conta WhatsApp

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/imagalhaess/molastagua-bot.git
cd molastagua-bot
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
COMPANY_NAME=Molas Tágua
COMPANY_ADDRESS=Sua Rua, 123 - Bairro - Cidade/UF
PAYMENT_METHODS=Dinheiro, PIX, Cartão de Crédito/Débito
BUSINESS_HOURS_START=08:00
BUSINESS_HOURS_END=18:00
BUSINESS_DAYS=1,2,3,4,5,6
BUDGET_RESPONSE_TIME=45
HUMAN_SUPPORT_NUMBER=5511999999999
NODE_ENV=development
```

4. **Inicie o bot**
```bash
npm start
```

5. **Escaneie o QR Code**

Quando o bot iniciar, um QR Code aparecerá no terminal. Escaneie com seu WhatsApp:
- Abra o WhatsApp
- Vá em **Aparelhos conectados**
- Clique em **Conectar um aparelho**
- Escaneie o código

## 📚 Como Usar

### Para Usuários Finais

Após enviar qualquer mensagem, o bot irá:

1. **Dar boas-vindas** e mostrar informações da empresa
2. **Verificar horário** - Se fora do expediente, informa quando retornará
3. **Apresentar menu principal** com opções:
   - `1` - Serviços
   - `2` - Vendas
   - `3` - Financeiro
   - `4` - Falar com atendente

4. **Coletar informações** necessárias de forma guiada
5. **Confirmar recebimento** e informar tempo de resposta
6. **Notificar atendente** automaticamente

### Comandos Especiais

- `menu` - Volta ao menu principal a qualquer momento

## 🔧 Desenvolvimento

### Estrutura de um Handler

```javascript
class ExemploHandler {
  /**
   * Descrição clara do que a função faz
   */
  static async minhaFuncao(client, message, chatId) {
    // Implementação limpa e objetiva
  }
}
```

### Adicionando Novo Fluxo

1. **Adicione constante** em `src/config/constants.js`
2. **Crie handler** em `src/handlers/`
3. **Adicione rota** em `src/middlewares/messageRouter.js`
4. **Adicione mensagens** em `src/flows/messages.js`

### Testando Localmente

```bash
# Inicia o bot
npm start

# Envia mensagem de teste para o número conectado
# O bot responderá automaticamente
```

## 📖 Conceitos para Aprendizado

### 1. **Arquitetura Modular**
- Cada módulo tem responsabilidade única
- Fácil manutenção e expansão
- Código reutilizável

### 2. **Gerenciamento de Estado**
- Uso de Map para armazenar contextos
- Estado persistente durante a conversa
- Limpeza automática de dados antigos

### 3. **Async/Await**
- Operações assíncronas de forma legível
- Tratamento de erros com try/catch
- Promises encadeadas

### 4. **Event-Driven Architecture**
- Listeners de eventos do WhatsApp
- Processamento assíncrono de mensagens
- Desacoplamento de componentes

### 5. **Variáveis de Ambiente**
- Segurança de dados sensíveis
- Configuração flexível por ambiente
- Validação na inicialização

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[whatsapp-web.js](https://wwebjs.dev/)** - Biblioteca WhatsApp Web
- **[qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)** - Geração de QR Code
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Gerenciamento de variáveis de ambiente
- **[node-cron](https://www.npmjs.com/package/node-cron)** - Agendamento de tarefas

## 🤝 Contribuindo

Este é um projeto educacional! Contribuições são bem-vindas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrão de Commits

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Tarefas de manutenção

## ⚠️ Notas Importantes

### Limitações Conhecidas

- **Armazenamento em memória**: Os contextos são perdidos ao reiniciar. Para produção, implemente banco de dados.
- **Sem autenticação**: Qualquer número pode interagir. Adicione whitelist se necessário.
- **Fotos não encaminhadas**: Implementação básica, necessário adicionar lógica de mídia.

### Próximos Passos (Sugestões)

- [ ] Integrar com banco de dados (MongoDB, PostgreSQL)
- [ ] Adicionar dashboard administrativo
- [ ] Implementar analytics de atendimento
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Criar testes automatizados
- [ ] Implementar CI/CD
- [ ] Adicionar logs estruturados
- [ ] Criar documentação de API

## 📄 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Desenvolvido como projeto educacional para **Molas Tágua**

---

## 🎓 Aprendizados Importantes

### Para Estudantes

Este projeto demonstra:

1. **Organização de código** - Como estruturar um projeto real
2. **Padrões de design** - Handler, Router, Service patterns
3. **Boas práticas** - Clean Code, SOLID principles
4. **Tecnologias modernas** - Node.js, ES6+, async/await
5. **Documentação** - Como documentar código profissionalmente

### Perguntas Frequentes

**Q: Por que usar Map ao invés de banco de dados?**
A: Para simplicidade inicial. Em produção, use banco de dados.

**Q: Como adicionar mais opções no menu?**
A: Edite `src/config/constants.js` e crie o handler correspondente.

**Q: Posso usar em produção?**
A: Sim, mas implemente banco de dados e adicione logs robustos.

**Q: Como testar sem WhatsApp?**
A: Implemente mocks dos handlers e teste a lógica isoladamente.

---

**💡 Dica**: Leia o código começando pelo `index.js` e siga o fluxo de execução até os handlers!

**📧 Suporte**: Abra uma issue no GitHub para dúvidas ou problemas.
