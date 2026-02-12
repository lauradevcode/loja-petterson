<?php
/**
 * Roteador da Aplicação
 */

class Router {
    private $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => []
    ];
    
    public function __construct() {
        $this->loadRoutes();
    }
    
    private function loadRoutes() {
        // Rotas de produtos
        $this->get('/api/products', 'ProductController@index');
        $this->get('/api/products/(\d+)', 'ProductController@show');
        $this->get('/api/products/categories', 'ProductController@categories');
        
        // Rotas de carrinho
        $this->get('/api/cart', 'CartController@index');
        $this->post('/api/cart/add', 'CartController@add');
        $this->put('/api/cart/update', 'CartController@update');
        $this->delete('/api/cart/remove/(\d+)', 'CartController@remove');
        $this->post('/api/cart/clear', 'CartController@clear');
        
        // Rotas de pedidos
        $this->get('/api/orders', 'OrderController@index');
        $this->post('/api/orders', 'OrderController@store');
        $this->get('/api/orders/(\d+)', 'OrderController@show');
        
        // Rotas de admin
        $this->post('/api/admin/login', 'AdminController@login');
        $this->get('/api/admin/stats', 'AdminController@stats');
        $this->get('/api/admin/products', 'AdminController@products');
    }
    
    public function get($path, $handler) {
        $this->routes['GET'][$path] = $handler;
    }
    
    public function post($path, $handler) {
        $this->routes['POST'][$path] = $handler;
    }
    
    public function put($path, $handler) {
        $this->routes['PUT'][$path] = $handler;
    }
    
    public function delete($path, $handler) {
        $this->routes['DELETE'][$path] = $handler;
    }
    
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = str_replace('/loja-petterson', '', $uri); // Remover base path
        
        // Procurar rota exata
        if (isset($this->routes[$method][$uri])) {
            $this->callHandler($this->routes[$method][$uri]);
            return;
        }
        
        // Procurar rota com parâmetros
        foreach ($this->routes[$method] as $route => $handler) {
            $pattern = str_replace('/', '\/', $route);
            $pattern = '/^' . $pattern . '$/';
            
            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches); // Remover match completo
                $this->callHandler($handler, $matches);
                return;
            }
        }
        
        // Rota não encontrada
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Rota não encontrada'
        ]);
    }
    
    private function callHandler($handler, $params = []) {
        list($controllerName, $method) = explode('@', $handler);
        
        $controllerClass = "Controllers\\{$controllerName}";
        
        if (!class_exists($controllerClass)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Controller não encontrado'
            ]);
            return;
        }
        
        $controller = new $controllerClass();
        
        if (!method_exists($controller, $method)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Método não encontrado'
            ]);
            return;
        }
        
        call_user_func_array([$controller, $method], $params);
    }
}
?>
