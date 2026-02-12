<?php
/**
 * Front Controller - Mais Você Ebooks
 * Ponto de entrada principal da aplicação
 */

// Configuração
define('ROOT_PATH', dirname(__DIR__));
define('PUBLIC_PATH', __DIR__);
define('BACKEND_PATH', ROOT_PATH . '/backend');

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Tratar requisições OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Autoloader
spl_autoload_register(function ($class) {
    $file = BACKEND_PATH . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Configuração de ambiente
require_once BACKEND_PATH . '/config/Database.php';
require_once BACKEND_PATH . '/config/Config.php';

// Inicializar roteador
require_once BACKEND_PATH . '/routes/Router.php';

// Processar requisição
try {
    $router = new Router();
    $router->dispatch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno do servidor',
        'error' => $e->getMessage()
    ]);
}
?>
