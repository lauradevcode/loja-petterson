/**
 * Página do Carrinho - Frontend
 * Apenas UI e chamadas à API
 */

class CartFrontend {
    constructor() {
        this.cart = [];
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
    }
    
    async loadCart() {
        try {
            const response = await fetch('/backend/api/cart');
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.data;
                this.renderCart();
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            this.showEmptyCart();
        }
    }
    
    renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('cart-empty');
        
        if (!this.cart.items || this.cart.items.length === 0) {
            this.showEmptyCart();
            return;
        }
        
        container.style.display = 'block';
        emptyMessage.style.display = 'none';
        
        container.innerHTML = this.cart.items.map(item => `
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
                        <span class="cart-item-author">Autor</span>
                        <span class="cart-item-format">PDF</span>
                        <span class="cart-item-pages">120 páginas</span>
                    </div>
                    <div class="cart-item-description">
                        Descrição completa do e-book com informações detalhadas sobre o conteúdo.
                    </div>
                </div>
                
                <div class="cart-item-price">
                    <div class="price-current">R$ ${item.price?.toFixed(2) || '0,00'}</div>
                </div>
                
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cartFrontend.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                               onchange="cartFrontend.updateQuantity(${item.id}, this.value)">
                        <button class="quantity-btn plus" onclick="cartFrontend.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-subtotal">
                    <div class="subtotal-amount">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="cartFrontend.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        `).join('');
        
        this.updateSummary();
    }
    
    showEmptyCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('cart-empty');
        
        container.style.display = 'none';
        emptyMessage.style.display = 'block';
        
        this.updateSummary(0, 0, 0);
    }
    
    async updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 10) newQuantity = 10;
        
        try {
            const response = await fetch('/backend/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: newQuantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.data;
                this.renderCart();
                this.showNotification('Quantidade atualizada', 'success');
            } else {
                this.showNotification(data.message || 'Erro ao atualizar quantidade', 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }
    
    async removeItem(productId) {
        if (!confirm('Tem certeza que deseja remover este item?')) {
            return;
        }
        
        try {
            const response = await fetch(`/backend/api/cart/remove/${productId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.data;
                this.renderCart();
                this.updateCartCount();
                this.showNotification('Item removido do carrinho', 'success');
            } else {
                this.showNotification(data.message || 'Erro ao remover item', 'error');
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }
    
    updateSummary(discountAmount = 0, shippingCost = 0) {
        const subtotal = this.cart.total || 0;
        const total = subtotal + shippingCost - discountAmount;
        
        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`;
        document.getElementById('discount').textContent = `-R$ ${discountAmount.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }
    
    updateCartCount() {
        const count = this.cart.count || 0;
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
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
            const subtotal = this.cart.total || 0;
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
    if (!cartFrontend.cart.items || cartFrontend.cart.items.length === 0) {
        cartFrontend.showNotification('Seu carrinho está vazio', 'error');
        return;
    }
    
    // Redirecionar para checkout (quando implementado)
    cartFrontend.showNotification('Redirecionando para checkout...', 'success');
    
    // Simular redirecionamento
    setTimeout(() => {
        alert('Página de checkout será implementada em breve!');
    }, 1500);
}

// Inicializar quando o DOM estiver pronto
let cartFrontend;
document.addEventListener('DOMContentLoaded', () => {
    cartFrontend = new CartFrontend();
});
