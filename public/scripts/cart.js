// Carrinho - Mais Você Ebooks

// Dados dos produtos
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
    },
    {
        id: 6,
        name: "eBook - Dieta Low Carb: Guia Completo para Emagrecer com Saúde",
        price: 30.00,
        originalPrice: 45.00,
        category: "nutricao",
        coverClass: "cover-low-carb",
        badge: "BESTSELLER"
    },
    {
        id: 7,
        name: "eBook - Treino em Casa: Programa Completo Sem Equipamentos",
        price: 20.00,
        category: "fitness",
        coverClass: "cover-treino-casa"
    },
    {
        id: 8,
        name: "eBook - Meditação para Iniciantes: Guia Prático de Relaxamento",
        price: 15.00,
        category: "bem-estar",
        coverClass: "cover-meditacao"
    },
    {
        id: 9,
        name: "eBook - Sono de Qualidade: Técnicas para um Descanso Perfeito",
        price: 18.00,
        category: "bem-estar",
        coverClass: "cover-sono"
    },
    {
        id: 10,
        name: "eBook - Corrida de Rua: Como Correr Lesões e Melhorar Performance",
        price: 22.00,
        category: "fitness",
        coverClass: "cover-corrida"
    },
    {
        id: 11,
        name: "eBook - Yoga para Estresse: Posturas e Exercícios para Relaxar",
        price: 17.00,
        category: "bem-estar",
        coverClass: "cover-yoga"
    },
    {
        id: 12,
        name: "eBook - Alimentação Saudável: Hábitos para uma Vida Melhor",
        price: 28.00,
        category: "nutricao",
        coverClass: "cover-alimentacao"
    },
    {
        id: 13,
        name: "eBook - Musculação para Iniciantes: Guia Passo a Passo",
        price: 32.00,
        category: "fitness",
        coverClass: "cover-musculacao"
    },
    {
        id: 14,
        name: "eBook - Controle de Ansiedade: Técnicas para Calmar a Mente",
        price: 23.00,
        category: "bem-estar",
        coverClass: "cover-ansiedade"
    },
    {
        id: 15,
        name: "eBook - Produtividade Máxima: Como Fazer Mais em Menos Tempo",
        price: 26.00,
        category: "desenvolvimento",
        coverClass: "cover-produtividade"
    }
];

// Carrinho de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Carregar itens do carrinho
function loadCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        if (cartEmpty) cartEmpty.style.display = 'block';
        updateCartSummary();
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<div class="ebook-cover ${item.coverClass}">
                        <div class="ebook-cover-content">
                            <div class="ebook-cover-title">${item.name.split(' - ')[1]?.split(':')[0] || 'Ebook'}</div>
                            <div class="ebook-cover-subtitle">${item.name.split(':')[1]?.trim() || ''}</div>
                            <div class="ebook-cover-price">R$${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                }
            </div>
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">
                    ${item.originalPrice ? 
                        `<span class="price-original">R$ ${item.originalPrice.toFixed(2)}</span>
                        <span class="price-current">R$ ${item.price.toFixed(2)}</span>` :
                        `<span class="price-current">R$ ${item.price.toFixed(2)}</span>`
                    }
                </div>
                <div class="cart-item-quantity">
                    <span class="quantity-label">Qtd:</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// Atualizar resumo do carrinho
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Atualizar valores
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const itemsElement = document.getElementById('cart-items-count');
    
    if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    if (itemsElement) itemsElement.textContent = totalItems;
}

// Atualizar quantidade
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
    showNotification('Produto removido do carrinho');
}

// Aplicar cupom
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        showNotification('Digite um código de cupom');
        return;
    }
    
    // Simulação de cupom (10% de desconto)
    if (couponCode.toUpperCase() === 'MAISVOCE10') {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal * 0.1;
        
        // Atualizar resumo com desconto
        const discountElement = document.getElementById('cart-discount');
        if (discountElement) {
            discountElement.textContent = `-R$ ${discount.toFixed(2)}`;
            discountElement.style.display = 'flex';
        }
        
        updateCartSummary();
        showNotification('Cupom aplicado com sucesso!');
    } else {
        showNotification('Cupom inválido');
    }
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-500);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Limpar carrinho
function clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
        showNotification('Carrinho limpo');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadCartItems();
    
    // Adicionar eventos aos botões
    const applyCouponBtn = document.getElementById('apply-coupon');
    const clearCartBtn = document.getElementById('clear-cart');
    
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Adicionar animações de notificação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            font-family: var(--font-primary);
            font-weight: var(--font-medium);
        }
    `;
    document.head.appendChild(style);
});
