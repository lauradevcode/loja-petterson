// Script New - Mais Você Ebooks

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

// Função para renderizar produtos
function renderProducts(productsToRender = products) {
    const productsGrid = document.querySelector('.products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => {
        const title = product.name.split(' - ')[1]?.split(':')[0] || 'Ebook';
        const subtitle = product.name.split(':')[1]?.trim() || '';
        
        return `
        <div class="product-card">
            <div class="product-image ${product.coverClass}">
                <div class="ebook-cover-content">
                    <div class="ebook-cover-title">${title}</div>
                    <div class="ebook-cover-subtitle">${subtitle}</div>
                    <div class="ebook-cover-price">R$${product.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.originalPrice ? 
                        `<span style="text-decoration: line-through; color: var(--gray-400); font-size: 0.875rem;">R$ ${product.originalPrice.toFixed(2)}</span>
                        <span>R$ ${product.price.toFixed(2)}</span>` :
                        `<span>R$ ${product.price.toFixed(2)}</span>`
                    }
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Adicionar
                </button>
            </div>
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        `;
    }).join('');
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Feedback visual
    showNotification('Produto adicionado ao carrinho!');
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
        font-family: var(--font-primary);
        font-weight: var(--font-medium);
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
    
    .product-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: 0.625rem;
        font-weight: var(--font-bold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        z-index: 10;
    }
`;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderProducts();
});
