// Admin Authentication Service
class AdminAuthService {
    constructor() {
        this.isAuthenticated = localStorage.getItem('adminAuth') === 'true';
        this.checkAuth();
    }

    checkAuth() {
        const currentPath = window.location.pathname;
        
        // Redirect to login if not authenticated and trying to access admin pages
        if (!this.isAuthenticated && currentPath.includes('/admin/') && !currentPath.includes('/admin/login')) {
            window.location.href = '../pages/login.html';
            return false;
        }

        // Redirect to dashboard if authenticated and trying to access login
        if (this.isAuthenticated && currentPath.includes('/admin/login')) {
            window.location.href = '../pages/dashboard.html';
            return false;
        }

        return true;
    }

    async login(email, password) {
        console.log('Login attempt:', email, password);
        
        // Mock authentication - remove strict validation for testing
        if (email && password) {
            this.isAuthenticated = true;
            localStorage.setItem('adminAuth', 'true');
            console.log('Login successful!');
            return { success: true };
        }
        
        console.log('Login failed - missing credentials');
        return { success: false, error: 'Preencha todos os campos' };
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('adminAuth');
        window.location.href = '../pages/login.html';
    }
}

// Initialize auth service
const adminAuth = new AdminAuthService();
