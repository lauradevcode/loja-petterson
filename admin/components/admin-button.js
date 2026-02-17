// Admin Button Component
class AdminButton {
    constructor() {
        this.isAdmin = localStorage.getItem('adminAuth') === 'true';
        this.createButton();
    }

    createButton() {
        if (!this.isAdmin) return;

        const navCart = document.querySelector('.nav-cart');
        if (!navCart) return;

        const adminButton = document.createElement('div');
        adminButton.className = 'nav-admin';
        adminButton.innerHTML = `
            <a href="/admin/pages/dashboard.html" class="admin-link">
                <i class="fas fa-cog"></i>
                <span class="admin-text">Painel Admin</span>
            </a>
        `;

        // Add styles
        adminButton.style.cssText = `
            display: flex;
            align-items: center;
            margin-left: 1rem;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .nav-admin {
                display: flex;
                align-items: center;
                margin-left: 1rem;
            }
            
            .admin-link {
                display: flex;
                align-items: center;
                color: #666;
                text-decoration: none;
                font-weight: 600;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                transition: all 0.3s;
            }
            
            .admin-link:hover {
                color: #ff6b9d;
                background: rgba(255, 107, 157, 0.1);
            }
            
            @media (max-width: 768px) {
                .admin-text {
                    display: none;
                }
                
                .admin-link {
                    padding: 0.5rem;
                }
            }
        `;

        document.head.appendChild(style);
        navCart.parentNode.insertBefore(adminButton, navCart.nextSibling);
    }
}

// Initialize admin button
document.addEventListener('DOMContentLoaded', () => {
    new AdminButton();
});
