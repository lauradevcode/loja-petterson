# Mais Você Ebooks - Guia de Desenvolvimento

## 🚀 Visão Geral

Sistema de e-commerce completo para venda de e-books, desenvolvido com frontend moderno e backend PHP robusto.

## 📋 Tecnologias Utilizadas

### Frontend
- **HTML5** semântico e acessível
- **CSS3** com design responsivo e gradiente rosa/feminino
- **JavaScript ES6+** puro (sem frameworks)
- **Font Awesome** para ícones
- **Google Fonts** (Inter) para tipografia

### Backend
- **PHP 8+** com PDO para banco de dados
- **MySQL** para persistência de dados
- **API REST** para comunicação frontend/backend
- **JWT** para autenticação (preparado)
- **Session** para carrinho de compras

### Design
- Paleta de cores: Gradiente rosa (#ff6b9d) para amarelo (#feca57)
- Design quadradão, sem bordas arredondadas
- Layout responsivo mobile-first
- Aparência profissional de loja virtual

## 🗂️ Estrutura do Projeto

```
loja-petterson/
├── config/
│   └── database.php          # Configuração do banco de dados
├── api/
│   ├── products.php          # API de produtos
│   ├── cart.php             # API do carrinho
│   ├── orders.php           # API de pedidos
│   └── users.php            # API de usuários
├── assets/
│   ├── css/
│   │   ├── styles.css       # Estilos principais
│   │   ├── estilo-loja.css # Estilos da loja
│   │   └── capas.css       # Estilos das capas
│   ├── js/
│   │   ├── script.js       # Funcionalidades gerais
│   │   └── ecommerce.js   # Sistema de e-commerce
│   └── images/
│       └── products/       # Imagens dos produtos
├── index.html              # Página principal
├── produtos.html          # Catálogo de produtos
├── setup.sql              # Script do banco de dados
└── README-DEVELOPER.md    # Este arquivo
```

## 🛠️ Configuração do Ambiente

### 1. Requisitos
- PHP 8.0 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache/Nginx)
- Composer (opcional, para dependências futuras)

### 2. Configuração do Banco de Dados

```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE mais_voce_ebooks;

# Importar estrutura
mysql -u root -p mais_voce_ebooks < setup.sql
```

### 3. Configuração do PHP

Edite `config/database.php`:

```php
private $host = 'localhost';
private $db_name = 'mais_voce_ebooks';
private $username = 'root';
private $password = 'sua_senha';
```

### 4. Configuração do Servidor Web

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## 📡 Endpoints da API

### Produtos
- `GET /api/products.php` - Listar todos os produtos
- `GET /api/products.php?id={id}` - Obter produto específico
- `GET /api/products.php?action=categories` - Listar categorias
- `GET /api/products.php?category={nome}` - Filtrar por categoria
- `GET /api/products.php?search={termo}` - Buscar produtos

### Carrinho
- `GET /api/cart.php?action=get` - Obter carrinho
- `POST /api/cart.php?action=add` - Adicionar item
- `PUT /api/cart.php?action=update` - Atualizar quantidade
- `DELETE /api/cart.php?action=remove&product_id={id}` - Remover item
- `POST /api/cart.php?action=clear` - Limpar carrinho

### Exemplo de Uso da API

```javascript
// Adicionar produto ao carrinho
fetch('/api/cart.php?action=add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        product_id: 1,
        quantity: 2
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎨 Personalização Visual

### Cores Principais
- Primária: `#ff6b9d` (rosa)
- Secundária: `#feca57` (amarelo)
- Fundo: `#ffffff` (branco)
- Texto: `#1a1a1a` (quase preto)

### Modificar Cores

Edite `assets/css/estilo-loja.css`:

```css
:root {
    --primary-color: #ff6b9d;
    --secondary-color: #feca57;
    --text-color: #1a1a1a;
    --background-color: #ffffff;
}
```

### Capas Personalizadas

As capas dos e-books são geradas com CSS puro em `assets/css/capas.css`. Cada produto tem uma classe específica:

```css
.cover-saude-masculina {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🛒 Funcionalidades Implementadas

### ✅ Frontend
- [x] Design responsivo
- [x] Gradiente rosa/feminino
- [x] Capas personalizadas dos e-books
- [x] Sistema de carrinho funcional
- [x] Filtros e busca
- [x] Avaliações com estrelas
- [x] Newsletter
- [x] Notificações
- [x] Visualização rápida

### ✅ Backend
- [x] API REST completa
- [x] Sistema de carrinho
- [x] Gestão de produtos
- [x] Estrutura para pedidos
- [x] Sistema de avaliações
- [x] Cupons de desconto
- [x] Downloads de e-books

### 🔄 Em Desenvolvimento
- [ ] Sistema de autenticação
- [ ] Integração com gateways de pagamento
- [ ] Painel administrativo
- [ ] Sistema de afiliados
- [ ] Relatórios e analytics

## 🔧 Segurança

### Medidas Implementadas
- Prepared statements para SQL
- Validação de entrada
- Session segura
- CORS configurado
- Sanitização de dados

### Recomendações
- Implementar HTTPS
- Configurar CSP headers
- Usar variáveis de ambiente
- Implementar rate limiting
- Validação server-side

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1199px  
- **Desktop**: > 1200px

## 🚀 Deploy

### Produção
1. Configurar variáveis de ambiente
2. Ajustar permissões de arquivos
3. Configurar HTTPS
4. Otimizar assets (minificar CSS/JS)
5. Configurar cache

### Ambiente de Desenvolvimento
```bash
# Iniciar servidor PHP embutido
php -S localhost:8000

# Ou usar XAMPP/MAMP/WAMP
```

## 📈 Performance

### Otimizações
- Lazy loading de imagens
- Cache browser
- Minificação de CSS/JS
- CDN para assets (recomendado)
- Indexação adequada do banco

## 🐛 Debug

### Modo Debug
Edite `config/database.php`:

```php
define('DEBUG_MODE', true);
```

### Logs
Erros são registrados em `logs/error.log`

## 🤝 Contribuição

1. Fork do projeto
2. Criar branch de feature
3. Commit das mudanças
4. Push para o branch
5. Abrir Pull Request

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

## 🆘 Suporte

Para dúvidas ou suporte:
- E-mail: dev@maisvocebooks.com
- Documentação: `/docs`
- Issues: GitHub Issues

---

**Desenvolvido com ❤️ para Mais Você Ebooks**
