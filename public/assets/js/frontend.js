/**
 * Frontend JavaScript - Mais Você Ebooks
 * Apenas interações básicas da UI
 * Lógica de negócio está no backend
 */

class FrontendUI {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadCartCount();
    }
    
    setupEventListeners() {
        // Menu mobile
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletter(e.target);
            });
        }
        
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target);
            });
        });
        
        // Busca
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
    }
    
    async loadCartCount() {
        try {
            const response = await fetch('/backend/api/cart');
            const data = await response.json();
            
            if (data.success) {
                this.updateCartCount(data.data.count);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
        }
    }
    
    updateCartCount(count) {
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch('/backend/api/cart/add', {
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
                this.showNotification('Produto adicionado ao carrinho!', 'success');
                this.loadCartCount();
            } else {
                this.showNotification(data.message || 'Erro ao adicionar produto', 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }
    
    async removeFromCart(productId) {
        try {
            const response = await fetch(`/backend/api/cart/remove/${productId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification('Produto removido do carrinho', 'success');
                this.loadCartCount();
                
                // Se estiver na página do carrinho, recarregar
                if (window.location.pathname.includes('carrinho')) {
                    location.reload();
                }
            }
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }
    
    async updateCartQuantity(productId, quantity) {
        try {
            const response = await fetch('/backend/api/cart/update', {
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
                this.loadCartCount();
            } else {
                this.showNotification(data.message || 'Erro ao atualizar carrinho', 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar carrinho:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }
    
    handleFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        const category = button.textContent;
        this.loadProducts(category);
    }
    
    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.loadProducts();
            return;
        }
        
        this.loadProducts(null, searchTerm);
    }
    
    async loadProducts(category = null, search = null) {
        try {
            let url = '/backend/api/products';
            const params = new URLSearchParams();
            
            if (category && category !== 'Todos') {
                params.append('category', category);
            }
            
            if (search) {
                params.append('search', search);
            }
            
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
        }
    }
    
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
                        <button class="btn-add-cart" onclick="frontendUI.addToCart(${product.id})">Adicionar ao Carrinho</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
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
    
    handleNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email) {
            this.showNotification('Digite seu e-mail', 'error');
            return;
        }
        
        // Simular envio
        this.showNotification('E-mail cadastrado com sucesso!', 'success');
        form.reset();
    }
    
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
}

// Inicializar frontend
let frontendUI;
document.addEventListener('DOMContentLoaded', () => {
    frontendUI = new FrontendUI();
    
    // Funções globais para compatibilidade
    window.addToCart = (id) => frontendUI.addToCart(id);
    window.removeFromCart = (id) => frontendUI.removeFromCart(id);
    window.updateCartQuantity = (id, qty) => frontendUI.updateCartQuantity(id, qty);
});
