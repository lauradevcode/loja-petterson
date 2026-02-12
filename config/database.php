<?php
/**
 * Configuração do Banco de Dados
 * Sistema de E-commerce Mais Você
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'mais_voce_ebooks';
    private $username = 'root';
    private $password = '';
    private $charset = 'utf8mb4';
    
    public $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

/**
 * Configurações do Sistema
 */
define('SITE_NAME', 'Mais Você Ebooks');
define('SITE_URL', 'http://localhost/loja-petterson/');
define('ADMIN_EMAIL', 'admin@maisvocebooks.com');
define('CURRENCY', 'BRL');
define('CURRENCY_SYMBOL', 'R$');

/**
 * Configurações de Pagamento (Mock para desenvolvimento)
 */
define('PAYMENT_GATEWAY', 'mock');
define('MERCADO_PAGO_TOKEN', 'test_token');
define('PAGSEGURO_TOKEN', 'test_token');

/**
 * Configurações de Email
 */
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'seu_email@gmail.com');
define('SMTP_PASSWORD', 'sua_senha');
define('SMTP_FROM_NAME', 'Mais Você Ebooks');

/**
 * Configurações de Upload
 */
define('UPLOAD_PATH', 'uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['pdf', 'epub', 'mobi']);

/**
 * Configurações de Segurança
 */
define('JWT_SECRET', 'sua_chave_secreta_aqui');
define('SESSION_LIFETIME', 3600); // 1 hora
define('PASSWORD_MIN_LENGTH', 8);

/**
 * Configurações de Cache
 */
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 hora
?>
