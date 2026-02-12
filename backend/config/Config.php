<?php
/**
 * Configurações do Sistema
 */

namespace Config;

class Config {
    // Site
    const SITE_NAME = 'Mais Você Ebooks';
    const SITE_URL = 'http://localhost/loja-petterson/';
    const ADMIN_EMAIL = 'admin@maisvocebooks.com';
    
    // Moeda
    const CURRENCY = 'BRL';
    const CURRENCY_SYMBOL = 'R$';
    
    // Pagamento
    const PAYMENT_GATEWAY = 'mock';
    const MERCADO_PAGO_TOKEN = 'test_token';
    const PAGSEGURO_TOKEN = 'test_token';
    
    // Email
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = 'seu_email@gmail.com';
    const SMTP_PASSWORD = 'sua_senha';
    const SMTP_FROM_NAME = 'Mais Você Ebooks';
    
    // Upload
    const UPLOAD_PATH = 'uploads/';
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_EXTENSIONS = ['pdf', 'epub', 'mobi'];
    
    // Segurança
    const JWT_SECRET = 'sua_chave_secreta_aqui';
    const SESSION_LIFETIME = 3600; // 1 hora
    const PASSWORD_MIN_LENGTH = 8;
    
    // Cache
    const CACHE_ENABLED = true;
    const CACHE_LIFETIME = 3600; // 1 hora
    
    // Admin
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'maisvoce2024';
    
    // API
    const API_VERSION = 'v1';
    const RATE_LIMIT = 100; // requisições por hora
}
?>
