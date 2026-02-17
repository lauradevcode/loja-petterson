// Estilos específicos para o carrinho
const cartStyles = `
<style>
.cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.cart-item-image {
    display: flex;
    align-items: center;
}

.cart-item-details h4 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
}

.cart-item-price {
    font-weight: 600;
    color: #ff6b9d;
}

.cart-item-quantity input {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    text-align: center;
}

.cart-item-total {
    font-weight: 600;
    color: #1a1a1a;
}

.btn-remove {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.3s;
}

.btn-remove:hover {
    background: #ffebee;
}

.order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 0.5rem;
    }
    
    .cart-item-quantity,
    .cart-item-total,
    .btn-remove {
        grid-column: 2;
    }
}
</style>
`;

// Inserir estilos no head
document.head.insertAdjacentHTML('beforeend', cartStyles);
