/**
 * Sistema de E-commerce Mais Você
 * Funcionalidades de carrinho, produtos e checkout
 */

class MaisVoceEcommerce {
    constructor() {
        this.cart = [];
        this.cartCount = 0;
        this.cartTotal = 0;
        this.init();
    }
    
    init() {
        this.loadCartFromStorage();
        this.updateCartUI();
        this.setupEventListeners();
        this.loadProducts();
    }
    
    // Carregar produtos da API
    async loadProducts(category = null, search = null) {
        try {
            let url = `${SITE_URL}api/products.php`;
            const params = new URLSearchParams();
            
            if (category) params.append('category', category);
            if (search) params.append('search', search);
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.renderProducts(data.data);
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.loadMockProducts();
        }
    }
    
    // Carregar produtos mock para desenvolvimento
    loadMockProducts() {
        const mockProducts = [
            {
                id: 1,
                title: 'eBook - Saúde Masculina em Alta Performance: Hormônios, Treino e Dieta',
                slug: 'saude-masculina-alta-performance',
                description: 'Guia completo para otimizar saúde masculina',
                price: 5.00,
                original_price: 10.00,
                category: 'Saúde',
                rating: 5,
                reviews_count: 127,
                image_url: `${SITE_URL}assets/images/products/cover-saude-masculina.jpg`
            },
            {
                id: 2,
                title: 'eBook - Emagrecimento Inteligente: Estratégias para Perder Gordura de Verdade',
                slug: 'emagrecimento-inteligente',
                description: 'Método científico para perda de peso sustentável',
                price: 25.00,
                original_price: 50.00,
                category: 'Emagrecimento',
                rating: 4.5,
                reviews_count: 89,
                image_url: `${SITE_URL}assets/images/products/cover-emagrecimento.jpg`
            },
            {
                id: 3,
                title: 'eBook - Mobilidade e Alongamento: Evite Lesões e Melhore o Desempenho',
                slug: 'mobilidade-alongamento',
                description: 'Programa completo de flexibilidade e mobilidade',
                price: 27.00,
                original_price: 40.00,
                category: 'Treinos',
                rating: 4.8,
                reviews_count: 156,
                image_url: `${SITE_URL}assets/images/products/cover-mobilidade.jpg`
            }
        ];
        
        this.renderProducts(mockProducts);
    }
    
    // Renderizar produtos na página
    renderProducts(products) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                ${product.original_price > product.price ? '<div class="product-badge">PROMOÇÃO</div>' : ''}
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.title}" onerror="this.style.display='none'">
                    <div class="ebook-cover cover-${product.slug?.split('-')[0] || 'default'}">
                        <div class="ebook-cover-content">
                            <div class="ebook-cover-title">${product.title?.split(' - ')[1]?.split(':')[0] || 'E-book'}</div>
                            <div class="ebook-cover-subtitle">${product.title?.split(' - ')[1]?.split(':')[1]?.trim() || ''}</div>
                            <div class="ebook-cover-price">R$ ${product.price?.toFixed(2) || '0,00'}</div>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <div class="rating">
                        ${this.renderStars(product.rating)}
                        <span>(${product.reviews_count || 0})</span>
                    </div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        ${product.original_price > product.price ? 
                            `<span class="price-original">R$ ${product.original_price.toFixed(2)}</span>
                             <span class="price-discount">R$ ${product.price.toFixed(2)}</span>` :
                            `<span>R$ ${product.price.toFixed(2)}</span>`
                        }
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Renderizar estrelas de avaliação
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }
        
        return stars;
    }
    
    // Adicionar produto ao carrinho
    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch(`${SITE_URL}api/cart.php?action=add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.cart || [];
                this.cartCount = data.cart_count || 0;
                this.cartTotal = data.cart_total || 0;
                
                this.saveCartToStorage();
                this.updateCartUI();
                this.showNotification('Produto adicionado ao carrinho!', 'success');
            } else {
                this.showNotification(data.message || 'Erro ao adicionar produto', 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            // Fallback para modo local
            this.addToCartLocal(productId, quantity);
        }
    }
    
    // Adicionar ao carrinho (modo local)
    addToCartLocal(productId, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Mock de produto
            const product = {
                id: productId,
                title: `E-book ${productId}`,
                price: productId * 10 + 5,
                quantity: quantity
            };
            this.cart.push(product);
        }
        
        this.updateCartTotals();
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification('Produto adicionado ao carrinho!', 'success');
    }
    
    // Remover do carrinho
    async removeFromCart(productId) {
        try {
            const response = await fetch(`${SITE_URL}api/cart.php?action=remove&product_id=${productId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.cart || [];
                this.cartCount = data.cart_count || 0;
                this.cartTotal = data.cart_total || 0;
                
                this.saveCartToStorage();
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            this.removeFromCartLocal(productId);
        }
    }
    
    // Remover do carrinho (modo local)
    removeFromCartLocal(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartTotals();
        this.saveCartToStorage();
        this.updateCartUI();
    }
    
    // Atualizar quantidade
    async updateQuantity(productId, quantity) {
        try {
            const response = await fetch(`${SITE_URL}api/cart.php?action=update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.cart || [];
                this.cartCount = data.cart_count || 0;
                this.cartTotal = data.cart_total || 0;
                
                this.saveCartToStorage();
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            this.updateQuantityLocal(productId, quantity);
        }
    }
    
    // Atualizar quantidade (modo local)
    updateQuantityLocal(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateCartTotals();
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }
    
    // Visualização rápida (removida)
    quickView(productId) {
        // Função removida conforme solicitado
        window.location.href = `carrinho.html?id=${productId}`;
    }
    
    // Calcular totais
    updateCartTotals() {
        this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Salvar carrinho no localStorage
    saveCartToStorage() {
        localStorage.setItem('maisvoce_cart', JSON.stringify(this.cart));
        localStorage.setItem('maisvoce_cart_count', this.cartCount.toString());
        localStorage.setItem('maisvoce_cart_total', this.cartTotal.toString());
    }
    
    // Carregar carrinho do localStorage
    loadCartFromStorage() {
        try {
            this.cart = JSON.parse(localStorage.getItem('maisvoce_cart') || '[]');
            this.cartCount = parseInt(localStorage.getItem('maisvoce_cart_count') || '0');
            this.cartTotal = parseFloat(localStorage.getItem('maisvoce_cart_total') || '0');
        } catch (error) {
            this.cart = [];
            this.cartCount = 0;
            this.cartTotal = 0;
        }
    }
    
    // Atualizar UI do carrinho
    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartFloat = document.querySelector('.cart-float');
        
        if (cartCount) {
            cartCount.textContent = this.cartCount;
            cartCount.style.display = this.cartCount > 0 ? 'flex' : 'none';
        }
        
        if (cartFloat) {
            cartFloat.setAttribute('data-count', this.cartCount);
        }
    }
    
    // Mostrar notificação
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `purchase-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                </div>
                <div class="notification-text">
                    <p>${message}</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Configurar event listeners
    setupEventListeners() {
        // Filtros de categoria
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.textContent;
                if (category === 'Todos') {
                    this.loadProducts();
                } else {
                    this.loadProducts(category);
                }
            });
        });
        
        // Busca
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                this.loadProducts(null, searchTerm);
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    this.loadProducts(null, searchTerm);
                }
            });
        }
        
        // Newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                this.showNotification('E-mail cadastrado com sucesso!', 'success');
                e.target.reset();
            });
        }
    }
}

// Configuração global
const SITE_URL = window.location.origin + '/loja-petterson/';

// Inicializar sistema
let ecommerce;
document.addEventListener('DOMContentLoaded', () => {
    ecommerce = new MaisVoceEcommerce();
    
    // Funções globais para compatibilidade
    window.addToCart = (id) => ecommerce.addToCart(id);
    window.quickView = (id) => ecommerce.quickView(id);
});

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaisVoceEcommerce;
}
