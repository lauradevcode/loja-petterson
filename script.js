// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Product card interactions
document.querySelectorAll('.btn-quick-view').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Create modal for quick view
        createQuickViewModal(productTitle);
    });
});

// Quick View Modal
function createQuickViewModal(productTitle) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.quick-view-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>Visualização Rápida</h2>
            <h3>${productTitle}</h3>
            <p>Este é um preview rápido do produto. Em uma implementação real, aqui apareceriam mais detalhes sobre o e-book, como sumário, número de páginas, formato do arquivo, etc.</p>
            <div class="modal-actions">
                <button class="btn-buy">Comprar Agora</button>
                <button class="btn-close-modal">Fechar</button>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            padding: 2.5rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            color: #333;
        }
        
        .modal-content h2 {
            margin-bottom: 1rem;
            color: #333;
        }
        
        .modal-content h3 {
            margin-bottom: 1.5rem;
            color: #667eea;
            font-size: 1.25rem;
        }
        
        .modal-content p {
            margin-bottom: 2rem;
            color: #666;
            line-height: 1.6;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
        }
        
        .modal-actions button {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-buy {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-buy:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-close-modal {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .btn-close-modal:hover {
            background: #e9ecef;
        }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    // Add modal to body
    document.body.appendChild(modal);

    // Close modal events
    const closeButtons = modal.querySelectorAll('.modal-close, .btn-close-modal, .modal-overlay');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.remove();
            styleSheet.remove();
        });
    });

    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            styleSheet.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Buy button functionality
document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Create purchase confirmation
        createPurchaseConfirmation(productTitle, productPrice);
    });
});

// Purchase Confirmation
function createPurchaseConfirmation(productTitle, productPrice) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.purchase-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="notification-text">
                <h4>Produto Adicionado!</h4>
                <p>${productTitle}</p>
                <p>${productPrice}</p>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add notification styles
    const notificationStyles = `
        .purchase-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 1.5rem;
            gap: 1rem;
        }
        
        .notification-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .notification-icon i {
            color: white;
            font-size: 1.25rem;
        }
        
        .notification-text {
            flex: 1;
        }
        
        .notification-text h4 {
            margin-bottom: 0.25rem;
            color: #333;
            font-size: 1rem;
        }
        
        .notification-text p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: #f8f9fa;
            color: #333;
        }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

    // Add notification to body
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
            styleSheet.remove();
        }, 300);
    }, 5000);

    // Close button event
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
        styleSheet.remove();
    });

    // Add slide out animation
    const slideOutStyles = `
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    styleSheet.textContent += slideOutStyles;
}

// Form validation (if forms are added later)
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.style.borderColor = '#e74c3c';
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    input.style.borderColor = '';
}

// Loading state for buttons
function setButtonLoading(button, isLoading = true) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Comprar';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Store original button text
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
    
    // Add smooth reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
