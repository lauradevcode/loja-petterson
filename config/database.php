<?php
/**
 * Configuração Simplificada - Loja Mais Você Ebooks
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'loja_ebooks';
    private $username = 'root';
    private $password = '';
    
    public $conn;
    
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

// Configurações básicas
define('SITE_NAME', 'Mais Você Ebooks');
define('SITE_URL', 'http://localhost/loja-petterson/');
define('UPLOAD_PATH', 'uploads/');

// PagSeguro (sandbox para desenvolvimento)
define('PAGSEGURO_EMAIL', 'seu_email@sandbox.pagseguro.com.br');
define('PAGSEGURO_TOKEN', 'seu_token_sandbox');
define('PAGSEGURO_URL', 'https://ws.sandbox.pagseguro.uol.com.br/');
?>
