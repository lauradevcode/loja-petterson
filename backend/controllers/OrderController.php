<?php
/**
 * Controller de Pedidos
 */

namespace Controllers;

use Models\Order;
use Config\Database;

class OrderController {
    private $orderModel;
    
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->orderModel = new Order($db);
    }
    
    public function index() {
        // Implementar listagem de pedidos (admin)
        $orders = $this->orderModel->getAll();
        
        echo json_encode([
            'success' => true,
            'data' => $orders
        ]);
    }
    
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar dados obrigatórios
        $required = ['customer_name', 'customer_email', 'customer_phone', 'items'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => "Campo {$field} é obrigatório"
                ]);
                return;
            }
        }
        
        $sessionId = $this->getSessionId();
        $result = $this->orderModel->create($data, $sessionId);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Pedido criado com sucesso',
                'order_id' => $result
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao criar pedido'
            ]);
        }
    }
    
    public function show($id) {
        $order = $this->orderModel->getById($id);
        
        if ($order) {
            echo json_encode([
                'success' => true,
                'data' => $order
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Pedido não encontrado'
            ]);
        }
    }
    
    private function getSessionId() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['cart_session_id'])) {
            $_SESSION['cart_session_id'] = uniqid('cart_', true);
        }
        
        return $_SESSION['cart_session_id'];
    }
}
?>
