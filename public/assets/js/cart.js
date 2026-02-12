/**
 * Funcionalidades Específicas da Página do Carrinho
 */

class CartPage {
    constructor() {
        this.cart = [];
        this.init();
    }
    
    init() {
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
    }
    
    loadCart() {
        try {
            this.cart = JSON.parse(localStorage.getItem('maisvoce_cart') || '[]');
        } catch (error) {
            this.cart = [];
        }
    }
    
    renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('cart-empty');
        
        if (this.cart.length === 0) {
            container.style.display = 'none';
            emptyMessage.style.display = 'block';
            this.updateSummary(0, 0, 0);
            return;
        }
        
        container.style.display = 'block';
        emptyMessage.style.display = 'none';
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <div class="ebook-cover cover-${item.slug?.split('-')[0] || 'default'}">
                        <div class="ebook-cover-content">
                            <div class="ebook-cover-title">${item.title?.split(' - ')[1]?.split(':')[0] || 'E-book'}</div>
                            <div class="ebook-cover-price">R$ ${item.price?.toFixed(2) || '0,00'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-meta">
                        <span class="cart-item-author">${item.author || 'Autor'}</span>
                        <span class="cart-item-format">${item.format || 'PDF'}</span>
                        <span class="cart-item-pages">${item.pages || '0'} páginas</span>
                    </div>
                    <div class="cart-item-description">
                        ${item.description || 'Descrição do e-book com informações completas sobre o conteúdo.'}
                    </div>
                </div>
                
                <div class="cart-item-price">
                    <div class="price-current">R$ ${item.price?.toFixed(2) || '0,00'}</div>
                    ${item.original_price && item.original_price > item.price ? 
                        `<div class="price-original">R$ ${item.original_price.toFixed(2)}</div>` : ''}
                </div>
                
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cartPage.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                               onchange="cartPage.updateQuantity(${item.id}, this.value)">
                        <button class="quantity-btn plus" onclick="cartPage.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-subtotal">
                    <div class="subtotal-amount">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="cartPage.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        `).join('');
        
        this.updateSummary();
    }
    
    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 10) newQuantity = 10;
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(newQuantity);
            this.saveCart();
            this.renderCart();
            this.showNotification('Quantidade atualizada', 'success');
        }
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.showNotification('Item removido do carrinho', 'success');
    }
    
    saveCart() {
        localStorage.setItem('maisvoce_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }
    
    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    updateSummary(discountAmount = 0, shippingCost = 0) {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + shippingCost - discountAmount;
        
        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`;
        document.getElementById('discount').textContent = `-R$ ${discountAmount.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }
    
    setupEventListeners() {
        // Aplicar cupom
        document.getElementById('apply-coupon')?.addEventListener('click', () => {
            this.applyCoupon();
        });
        
        document.getElementById('coupon-code')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyCoupon();
            }
        });
    }
    
    applyCoupon() {
        const couponCode = document.getElementById('coupon-code').value.trim();
        
        if (!couponCode) {
            this.showNotification('Digite um código de cupom', 'error');
            return;
        }
        
        // Mock de cupons
        const coupons = {
            'DESCONTO10': 0.10,
            'DESCONTO20': 0.20,
            'BEMVINDO': 0.15
        };
        
        if (coupons[couponCode.toUpperCase()]) {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = subtotal * coupons[couponCode.toUpperCase()];
            this.updateSummary(discount, 0);
            this.showNotification(`Cupom aplicado! Desconto de R$ ${discount.toFixed(2)}`, 'success');
        } else {
            this.showNotification('Cupom inválido', 'error');
        }
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

// Função global para finalizar compra
function proceedToCheckout() {
    if (cartPage.cart.length === 0) {
        cartPage.showNotification('Seu carrinho está vazio', 'error');
        return;
    }
    
    // Salvar carrinho para checkout
    localStorage.setItem('checkout_cart', JSON.stringify(cartPage.cart));
    
    // Redirecionar para página de checkout (quando existir)
    // window.location.href = 'checkout.html';
    
    // Por enquanto, mostrar mensagem
    cartPage.showNotification('Redirecionando para checkout...', 'success');
    
    // Simular redirecionamento
    setTimeout(() => {
        alert('Página de checkout será implementada. Por agora, os dados estão salvos no localStorage.');
    }, 1500);
}

// Inicializar quando o DOM estiver pronto
let cartPage;
document.addEventListener('DOMContentLoaded', () => {
    cartPage = new CartPage();
});
