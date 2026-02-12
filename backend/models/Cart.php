<?php
/**
 * Model de Carrinho
 */

namespace Models;

class Cart {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getCart($sessionId) {
        // Mock de carrinho (em produção usar banco)
        if (isset($_SESSION['cart'])) {
            $cart = $_SESSION['cart'];
            
            // Calcular totais
            $total = 0;
            $count = 0;
            
            foreach ($cart as &$item) {
                $item['subtotal'] = $item['price'] * $item['quantity'];
                $item['subtotal_formatted'] = 'R$ ' . number_format($item['subtotal'], 2, ',', '.');
                $total += $item['subtotal'];
                $count += $item['quantity'];
            }
            
            return [
                'items' => array_values($cart),
                'count' => $count,
                'total' => $total,
                'total_formatted' => 'R$ ' . number_format($total, 2, ',', '.')
            ];
        }
        
        return [
            'items' => [],
            'count' => 0,
            'total' => 0,
            'total_formatted' => 'R$ 0,00'
        ];
    }
    
    public function addItem($sessionId, $productId, $quantity) {
        // Mock de validação de produto
        $product = $this->getProductById($productId);
        if (!$product) {
            return false;
        }
        
        // Inicializar carrinho na sessão
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
        
        $cart = $_SESSION['cart'];
        
        // Verificar se produto já está no carrinho
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'id' => $productId,
                'title' => $product['title'],
                'price' => $product['price'],
                'quantity' => $quantity,
                'image' => $product['image'] ?? 'cover-' . $productId . '.jpg',
                'slug' => $product['slug'] ?? 'produto-' . $productId
            ];
        }
        
        $_SESSION['cart'] = $cart;
        return true;
    }
    
    public function updateItem($sessionId, $productId, $quantity) {
        if (!isset($_SESSION['cart'][$productId])) {
            return false;
        }
        
        if ($quantity <= 0) {
            unset($_SESSION['cart'][$productId]);
        } else {
            $_SESSION['cart'][$productId]['quantity'] = $quantity;
        }
        
        return true;
    }
    
    public function removeItem($sessionId, $productId) {
        if (isset($_SESSION['cart'][$productId])) {
            unset($_SESSION['cart'][$productId]);
            return true;
        }
        
        return false;
    }
    
    public function clearCart($sessionId) {
        unset($_SESSION['cart']);
        return true;
    }
    
    private function getProductById($id) {
        // Mock de produtos
        $products = [
            1 => [
                'id' => 1,
                'title' => 'eBook - Saúde Masculina em Alta Performance: Hormônios, Treino e Dieta',
                'price' => 5.00,
                'image' => 'cover-saude-masculina.jpg',
                'slug' => 'saude-masculina-alta-performance'
            ],
            2 => [
                'id' => 2,
                'title' => 'eBook - Emagrecimento Inteligente: Estratégias para Perder Gordura de Verdade',
                'price' => 25.00,
                'image' => 'cover-emagrecimento.jpg',
                'slug' => 'emagrecimento-inteligente'
            ],
            3 => [
                'id' => 3,
                'title' => 'eBook - Mobilidade e Alongamento: Evite Lesões e Melhore o Desempenho',
                'price' => 27.00,
                'image' => 'cover-mobilidade.jpg',
                'slug' => 'mobilidade-alongamento'
            ]
        ];
        
        return $products[$id] ?? null;
    }
}
?>
