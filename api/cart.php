<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class CartAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    // Iniciar sessão segura
    private function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    // Gerar ID de carrinho único
    private function getCartId() {
        $this->startSession();
        
        if (!isset($_SESSION['cart_id'])) {
            $_SESSION['cart_id'] = uniqid('cart_', true);
        }
        
        return $_SESSION['cart_id'];
    }
    
    // Adicionar item ao carrinho
    public function addToCart($productId, $quantity = 1) {
        $cartId = $this->getCartId();
        
        // Validar produto
        $product = $this->getProductById($productId);
        if (!$product) {
            return [
                'success' => false,
                'message' => 'Produto não encontrado'
            ];
        }
        
        // Verificar estoque
        if ($product['stock'] < $quantity) {
            return [
                'success' => false,
                'message' => 'Estoque insuficiente'
            ];
        }
        
        // Adicionar ao carrinho (usando sessão por enquanto)
        $this->startSession();
        
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
                'image' => $product['image'] ?? 'cover-' . $productId . '.jpg'
            ];
        }
        
        $_SESSION['cart'] = $cart;
        
        return [
            'success' => true,
            'message' => 'Produto adicionado ao carrinho',
            'cart' => $this->getCart(),
            'cart_count' => $this->getCartCount(),
            'cart_total' => $this->getCartTotal()
        ];
    }
    
    // Remover item do carrinho
    public function removeFromCart($productId) {
        $this->startSession();
        
        if (isset($_SESSION['cart'][$productId])) {
            unset($_SESSION['cart'][$productId]);
            
            return [
                'success' => true,
                'message' => 'Produto removido do carrinho',
                'cart' => $this->getCart(),
                'cart_count' => $this->getCartCount(),
                'cart_total' => $this->getCartTotal()
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Produto não encontrado no carrinho'
        ];
    }
    
    // Atualizar quantidade
    public function updateQuantity($productId, $quantity) {
        $this->startSession();
        
        if (isset($_SESSION['cart'][$productId])) {
            if ($quantity <= 0) {
                unset($_SESSION['cart'][$productId]);
            } else {
                $_SESSION['cart'][$productId]['quantity'] = $quantity;
            }
            
            return [
                'success' => true,
                'message' => 'Carrinho atualizado',
                'cart' => $this->getCart(),
                'cart_count' => $this->getCartCount(),
                'cart_total' => $this->getCartTotal()
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Produto não encontrado no carrinho'
        ];
    }
    
    // Obter carrinho
    public function getCart() {
        $this->startSession();
        
        $cart = $_SESSION['cart'] ?? [];
        
        foreach ($cart as &$item) {
            $item['subtotal'] = $item['price'] * $item['quantity'];
            $item['price_formatted'] = 'R$ ' . number_format($item['price'], 2, ',', '.');
            $item['subtotal_formatted'] = 'R$ ' . number_format($item['subtotal'], 2, ',', '.');
            $item['image_url'] = SITE_URL . 'assets/images/products/' . $item['image'];
        }
        
        return array_values($cart);
    }
    
    // Obter total de itens
    public function getCartCount() {
        $this->startSession();
        
        $count = 0;
        $cart = $_SESSION['cart'] ?? [];
        
        foreach ($cart as $item) {
            $count += $item['quantity'];
        }
        
        return $count;
    }
    
    // Obter valor total
    public function getCartTotal() {
        $this->startSession();
        
        $total = 0;
        $cart = $_SESSION['cart'] ?? [];
        
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        
        return $total;
    }
    
    // Limpar carrinho
    public function clearCart() {
        $this->startSession();
        unset($_SESSION['cart']);
        
        return [
            'success' => true,
            'message' => 'Carrinho limpo',
            'cart' => [],
            'cart_count' => 0,
            'cart_total' => 0
        ];
    }
    
    // Obter produto por ID (mock)
    private function getProductById($id) {
        $mockProducts = [
            1 => [
                'id' => 1,
                'title' => 'eBook - Saúde Masculina em Alta Performance: Hormônios, Treino e Dieta',
                'price' => 5.00,
                'stock' => 999,
                'image' => 'cover-saude-masculina.jpg'
            ],
            2 => [
                'id' => 2,
                'title' => 'eBook - Emagrecimento Inteligente: Estratégias para Perder Gordura de Verdade',
                'price' => 25.00,
                'stock' => 999,
                'image' => 'cover-emagrecimento.jpg'
            ],
            3 => [
                'id' => 3,
                'title' => 'eBook - Mobilidade e Alongamento: Evite Lesões e Melhore o Desempenho',
                'price' => 27.00,
                'stock' => 999,
                'image' => 'cover-mobilidade.jpg'
            ]
        ];
        
        return $mockProducts[$id] ?? null;
    }
}

// Processar requisição
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$cart = new CartAPI();

switch ($method) {
    case 'GET':
        if ($action === 'get') {
            echo json_encode([
                'success' => true,
                'data' => [
                    'items' => $cart->getCart(),
                    'count' => $cart->getCartCount(),
                    'total' => $cart->getCartTotal(),
                    'total_formatted' => 'R$ ' . number_format($cart->getCartTotal(), 2, ',', '.')
                ]
            ]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'add') {
            $productId = $data['product_id'] ?? 0;
            $quantity = $data['quantity'] ?? 1;
            
            echo json_encode($cart->addToCart($productId, $quantity));
        } elseif ($action === 'clear') {
            echo json_encode($cart->clearCart());
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'update') {
            $productId = $data['product_id'] ?? 0;
            $quantity = $data['quantity'] ?? 1;
            
            echo json_encode($cart->updateQuantity($productId, $quantity));
        }
        break;
        
    case 'DELETE':
        if ($action === 'remove') {
            $productId = $_GET['product_id'] ?? 0;
            
            echo json_encode($cart->removeFromCart($productId));
        }
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Método não permitido'
        ]);
        break;
}
?>
