// Main Application Script - Clean & Scalable
(function() {
    'use strict';

    // Constants
    const PRODUCTS_KEY = 'maisvoce_products';
    const CART_KEY = 'maisvoce_cart';
    
    // Products Data
    const products = [
        {
            id: 1,
            name: "eBook - Saúde Masculina em Alta Performance: Hormônios, Treino e Dieta",
            price: 5.00,
            originalPrice: 10.00,
            category: "saude",
            coverClass: "cover-saude-masculina",
            badge: "NOVO"
        },
        {
            id: 2,
            name: "eBook - Emagrecimento Inteligente: Estratégias para Perder Gordura de Verdade",
            price: 25.00,
            category: "nutricao",
            coverClass: "cover-emagrecimento"
        },
        {
            id: 3,
            name: "eBook - Mobilidade e Alongamento: Evite Lesões e Melhore o Desempenho",
            price: 27.00,
            category: "fitness",
            coverClass: "cover-mobilidade"
        },
        {
            id: 4,
            name: "eBook - Nutrição para Hipertrofia: Como Comer para Crescer Naturalmente",
            price: 35.00,
            category: "nutricao",
            coverClass: "cover-hipertrofia"
        },
        {
            id: 5,
            name: "eBook - Finanças para Iniciantes: Organize, Economize e Comece a Investir",
            price: 38.00,
            category: "financas",
            coverClass: "cover-financas"
        }
    ];

    // Cart Management
    class CartManager {
        constructor() {
            this.cart = this.loadCart();
            this.init();
        }

        loadCart() {
            try {
                return JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch (error) {
                console.error('Error loading cart:', error);
                return [];
            }
        }

        saveCart() {
            try {
                localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        }

        addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return false;

            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    ...product,
                    quantity: 1
                });
            }

            this.saveCart();
            this.updateCartCount();
            this.showNotification('Produto adicionado ao carrinho!', 'success');
            return true;
        }

        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartCount();
        }

        updateQuantity(productId, quantity) {
            const item = this.cart.find(item => item.id === productId);
            if (item && quantity > 0) {
                item.quantity = quantity;
                this.saveCart();
            }
        }

        getTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        updateCartCount() {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#22c55e' : '#3b82f6'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 9999;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // UI Components
    class UIComponents {
        static createProductCard(product) {
            return `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-cover ${product.coverClass}">
                        <div class="cover-content">
                            <h3>${product.name.split(':')[0]}</h3>
                            <p>${product.name.split(':')[1] || ''}</p>
                            <div class="price-tag">R$ ${product.price.toFixed(2)}</div>
                        </div>
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="price-section">
                            ${product.originalPrice ? 
                                `<span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>` : ''}
                            <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                        </div>
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
        }

        static setupEventListeners(cartManager) {
            // Cart buttons
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-add-cart')) {
                    const productId = parseInt(e.target.dataset.productId);
                    cartManager.addToCart(productId);
                }
            });

            // Mobile menu
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');
            
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }
        }
    }

    // Navigation
    class NavigationManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
        }

        setupSmoothScrolling() {
            const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
            
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update active state
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            });
        }

        setupActiveNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const observerOptions = {
                root: null,
                rootMargin: '-100px 0px',
                threshold: 0.1
            };
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                        
                        if (correspondingLink) {
                            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                            correspondingLink.classList.add('active');
                        }
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => sectionObserver.observe(section));
        }
    }

    // Main Application
    class App {
        constructor() {
            this.cartManager = new CartManager();
            this.navigationManager = new NavigationManager();
            this.init();
        }

        init() {
            this.loadProducts();
            UIComponents.setupEventListeners(this.cartManager);
            this.cartManager.updateCartCount();
        }

        loadProducts() {
            const productsGrid = document.getElementById('featured-products');
            if (!productsGrid) return;

            productsGrid.innerHTML = products
                .slice(0, 3) // Show only first 3 products on homepage
                .map(product => UIComponents.createProductCard(product))
                .join('');
        }
    }

    // Initialize app when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });

    // Add animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

})();
