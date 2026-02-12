<?php
/**
 * Controller de Carrinho
 */

namespace Controllers;

use Models\Cart;
use Config\Database;

class CartController {
    private $cartModel;
    
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->cartModel = new Cart($db);
    }
    
    public function index() {
        $sessionId = $this->getSessionId();
        $cart = $this->cartModel->getCart($sessionId);
        
        echo json_encode([
            'success' => true,
            'data' => $cart
        ]);
    }
    
    public function add() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $productId = $data['product_id'] ?? 0;
        $quantity = $data['quantity'] ?? 1;
        
        if (!$productId || $quantity < 1) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Dados inválidos'
            ]);
            return;
        }
        
        $sessionId = $this->getSessionId();
        $result = $this->cartModel->addItem($sessionId, $productId, $quantity);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Produto adicionado ao carrinho',
                'cart' => $this->cartModel->getCart($sessionId)
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao adicionar produto'
            ]);
        }
    }
    
    public function update() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $productId = $data['product_id'] ?? 0;
        $quantity = $data['quantity'] ?? 1;
        
        if (!$productId || $quantity < 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Dados inválidos'
            ]);
            return;
        }
        
        $sessionId = $this->getSessionId();
        $result = $this->cartModel->updateItem($sessionId, $productId, $quantity);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Carrinho atualizado',
                'cart' => $this->cartModel->getCart($sessionId)
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao atualizar carrinho'
            ]);
        }
    }
    
    public function remove($productId) {
        $sessionId = $this->getSessionId();
        $result = $this->cartModel->removeItem($sessionId, $productId);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Produto removido do carrinho',
                'cart' => $this->cartModel->getCart($sessionId)
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao remover produto'
            ]);
        }
    }
    
    public function clear() {
        $sessionId = $this->getSessionId();
        $result = $this->cartModel->clearCart($sessionId);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Carrinho limpo',
                'cart' => []
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao limpar carrinho'
            ]);
        }
    }
    
    private function getSessionId() {
        // Iniciar sessão se não estiver ativa
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Criar ID de sessão único
        if (!isset($_SESSION['cart_session_id'])) {
            $_SESSION['cart_session_id'] = uniqid('cart_', true);
        }
        
        return $_SESSION['cart_session_id'];
    }
}
?>
