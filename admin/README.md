# Painel Administrativo Mais Você

## 📋 Visão Geral

Painel administrativo exclusivo para o dono do site Mais Você Ebooks. Sistema simples e direto sem necessidade de cadastro de usuários finais.

## 🔐 Acesso

### URL
```
http://localhost/loja-petterson/admin/
```

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `maisvoce2024`

> ⚠️ **Importante**: Em produção, altere estas credenciais no arquivo `login.html`

## 🚀 Funcionalidades

### ✅ Implementadas
- **Login seguro** com validação
- **Dashboard** com estatísticas em tempo real
- **Gestão de produtos** (visualização básica)
- **Visualização de pedidos**
- **Design responsivo** (mobile/tablet/desktop)
- **Sessão segura** com timeout
- **Logout automático**

### 📊 Dashboard
- **Vendas do dia**: Contador de vendas
- **Receita do dia**: Total faturado
- **Produtos ativos**: Quantidade de e-books
- **Pedidos do dia**: Número de pedidos

### 📦 Gestão de Produtos
- Lista completa de produtos
- Informações: título, preço, status, vendas
- Ações: editar, excluir (mock)
- Status: ativo/inativo

### 📱 Interface
- **Sidebar** navegável
- **Gradiente rosa/feminino** (mesma identidade visual)
- **Design quadradão** e profissional
- **Responsivo** para todos os dispositivos

## 🗂️ Estrutura de Arquivos

```
admin/
├── index.html          # Redirecionamento para login
├── login.html          # Página de autenticação
├── dashboard.html      # Painel principal
└── README.md          # Este arquivo
```

## 🔧 Configuração

### Alterar Credenciais

Edite `admin/login.html` e modifique as constantes:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'seu_usuario',
    password: 'sua_senha_forte'
};
```

### Personalizar Dashboard

As estatísticas são mock (simuladas). Para integrar dados reais:

1. Conectar com a API PHP existente
2. Modificar as funções `loadStats()`, `loadProducts()`, `loadOrders()`
3. Implementar CRUD completo para produtos

## 🛡️ Segurança

### Medidas Implementadas
- **Session storage** para autenticação
- **Verificação de login** em cada página
- **Redirecionamento automático** se não logado
- **Logout manual** e automático
- **Credenciais hardcoded** (simplificado para demonstração)

### Recomendações para Produção
- Mover credenciais para variáveis de ambiente
- Implementar JWT ou cookies seguros
- Adicionar rate limiting
- Implementar log de atividades
- Usar HTTPS obrigatório

## 📱 Responsividade

- **Desktop**: Sidebar fixa, layout completo
- **Tablet**: Sidebar adaptável
- **Mobile**: Menu hamburger, layout otimizado

## 🔄 Fluxo de Usuário

1. Acessa `/admin/`
2. Redirecionado para `login.html`
3. Insere credenciais
4. Autenticado com sucesso → `dashboard.html`
5. Navega pelas seções
6. Pode fazer logout a qualquer momento

## 🎨 Identidade Visual

- **Cores**: Gradiente rosa (#ff6b9d) para amarelo (#feca57)
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Font Awesome 6.0
- **Layout**: Grid system moderno
- **Animações**: Transições suaves

## 📊 Estatísticas (Mock)

As estatísticas exibidas são simuladas para demonstração:

```javascript
// Exemplo de como os dados são gerados
document.getElementById('total-sales').textContent = Math.floor(Math.random() * 50) + 10;
document.getElementById('total-revenue').textContent = 'R$ ' + (Math.floor(Math.random() * 1000) + 500).toFixed(2);
```

## 🔮 Futuras Implementações

- [ ] Integração real com banco de dados
- [ ] CRUD completo para produtos
- [ ] Gestão de pedidos e clientes
- [ ] Relatórios avançados
- [ ] Configurações do sistema
- [ ] Backup e restore
- [ ] Notificações em tempo real

## 🚨 Limitações Atuais

- **Dados mock**: Sem integração real com banco
- **Sem persistência**: Dados resetam ao recarregar
- **Funções básicas**: Editar/excluir são simulados
- **Sem usuários finais**: Apenas admin

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar console do navegador
- Confirmar credenciais
- Testar em diferentes navegadores

---

**Desenvolvido para Mais Você Ebooks** 📚✨
