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

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Mostrar notificação simples
    showNotification('Produto adicionado ao carrinho!');
}

// Remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Atualizar quantidade
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
}

// Calcular total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Renderizar produtos
function renderProducts(containerId, productsToShow = products) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <div class="ebook-cover ${product.coverClass}">
                    <div class="ebook-cover-content">
                        <div class="ebook-cover-title">${product.name.split(' - ')[1]?.split(':')[0] || 'Ebook'}</div>
                        <div class="ebook-cover-subtitle">${product.name.split(':')[1]?.trim() || ''}</div>
                        <div class="ebook-cover-price">R$${product.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="rating">
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                    <i class="fas fa-star star"></i>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="price-original">R$${product.originalPrice.toFixed(2)}</span>` : ''}
                    <span class="price-discount">R$${product.price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar carrinho
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('cart-empty');
    const subtotal = document.getElementById('cart-subtotal');
    const total = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        container.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (subtotal) subtotal.textContent = 'R$ 0,00';
        if (total) total.textContent = 'R$ 0,00';
        return;
    }

    container.style.display = 'block';
    if (emptyMessage) emptyMessage.style.display = 'none';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <div class="ebook-cover ${item.coverClass}" style="width: 80px; height: 100px;">
                    <div class="ebook-cover-content">
                        <div class="ebook-cover-price">R$${item.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">R$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" max="99" 
                       onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <div class="cart-item-total">R$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const totalAmount = calculateTotal();
    if (subtotal) subtotal.textContent = `R$ ${totalAmount.toFixed(2)}`;
    if (total) total.textContent = `R$ ${totalAmount.toFixed(2)}`;
}

// Notificação simples
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ff6b9d;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 3000;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Filtros
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (!categoryFilter || !sortFilter) return;

    function applyFilters() {
        let filtered = [...products];

        // Filtro por categoria
        const category = categoryFilter.value;
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }

        // Ordenação
        const sort = sortFilter.value;
        switch (sort) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
        }

        renderProducts('all-products', filtered);
    }

    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

// Checkout
function setupCheckout() {
    const checkoutBtn = document.getElementById('btn-checkout');
    const modal = document.getElementById('checkout-modal');
    const modalClose = document.getElementById('modal-close');
    const checkoutForm = document.getElementById('checkout-form');

    if (!checkoutBtn || !modal) return;

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Seu carrinho está vazio!');
            return;
        }

        // Renderizar resumo do pedido
        const orderItems = document.getElementById('order-items');
        const orderTotal = document.getElementById('order-total-amount');

        if (orderItems) {
            orderItems.innerHTML = cart.map(item => `
                <div class="order-item">
                    <div>${item.name}</div>
                    <div>${item.quantity}x R$${item.price.toFixed(2)}</div>
                </div>
            `).join('');
        }

        if (orderTotal) {
            orderTotal.textContent = `R$ ${calculateTotal().toFixed(2)}`;
        }

        modal.style.display = 'block';
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderData = {
                action: 'create_payment',
                customer_name: document.getElementById('customer-name').value,
                customer_email: document.getElementById('customer-email').value,
                customer_cpf: document.getElementById('customer-cpf').value,
                customer_phone: document.getElementById('customer-phone').value,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            try {
                showNotification('Processando pagamento...');
                
                const response = await fetch('/api/pagseguro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    // Limpar carrinho
                    cart = [];
                    localStorage.removeItem('cart');
                    updateCartCount();
                    
                    // Redirecionar para PagSeguro
                    window.location.href = result.payment_url;
                } else {
                    showNotification('Erro ao processar pagamento: ' + result.error);
                }
            } catch (error) {
                console.error('Payment error:', error);
                showNotification('Erro ao processar pagamento. Tente novamente.');
            }
        });
    }

    // Fechar modal clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Carregar produtos na página inicial
    if (document.getElementById('featured-products')) {
        renderProducts('featured-products', products.slice(0, 3));
    }
    
    // Carregar todos os produtos
    if (document.getElementById('all-products')) {
        renderProducts('all-products');
        setupFilters();
    }
    
    // Configurar carrinho
    if (document.getElementById('cart-items-container')) {
        renderCart();
        setupCheckout();
    }
});
