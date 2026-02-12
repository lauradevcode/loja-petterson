<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

class ProductAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    // Obter todos os produtos
    public function getProducts($category = null, $search = null, $limit = null, $offset = 0) {
        $query = "SELECT * FROM products WHERE 1=1";
        $params = [];
        
        if ($category) {
            $query .= " AND category = :category";
            $params[':category'] = $category;
        }
        
        if ($search) {
            $query .= " AND (title LIKE :search OR description LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        $query .= " ORDER BY created_at DESC";
        
        if ($limit) {
            $query .= " LIMIT :limit OFFSET :offset";
            $params[':limit'] = (int)$limit;
            $params[':offset'] = (int)$offset;
        }
        
        try {
            $stmt = $this->conn->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatar produtos para o frontend
            foreach ($products as &$product) {
                $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
                $product['image_url'] = SITE_URL . 'assets/images/products/' . $product['image'];
                $product['url'] = SITE_URL . 'produto/' . $product['slug'];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $products,
                'total' => count($products)
            ]);
        } catch(PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar produtos: ' . $e->getMessage()
            ]);
        }
    }
    
    // Obter produto por ID
    public function getProduct($id) {
        $query = "SELECT * FROM products WHERE id = :id AND status = 'active'";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($product) {
                $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
                $product['image_url'] = SITE_URL . 'assets/images/products/' . $product['image'];
                $product['gallery'] = $this->getProductGallery($id);
                $product['related_products'] = $this->getRelatedProducts($id, $product['category']);
                
                echo json_encode([
                    'success' => true,
                    'data' => $product
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Produto não encontrado'
                ]);
            }
        } catch(PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar produto: ' . $e->getMessage()
            ]);
        }
    }
    
    // Obter categorias
    public function getCategories() {
        $query = "SELECT DISTINCT category FROM products WHERE status = 'active' ORDER BY category";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
        } catch(PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar categorias: ' . $e->getMessage()
            ]);
        }
    }
    
    // Obter galeria de imagens do produto
    private function getProductGallery($productId) {
        $query = "SELECT * FROM product_gallery WHERE product_id = :id ORDER BY sort_order";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $productId);
        $stmt->execute();
        
        $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($gallery as &$image) {
            $image['url'] = SITE_URL . 'assets/images/products/gallery/' . $image['image'];
        }
        
        return $gallery;
    }
    
    // Obter produtos relacionados
    private function getRelatedProducts($productId, $category, $limit = 4) {
        $query = "SELECT * FROM products WHERE category = :category AND id != :id AND status = 'active' ORDER BY RAND() LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':id', $productId);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($products as &$product) {
            $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
            $product['image_url'] = SITE_URL . 'assets/images/products/' . $product['image'];
        }
        
        return $products;
    }
}

// Mock de dados para desenvolvimento enquanto o banco não está configurado
function getMockProducts() {
    return [
        [
            'id' => 1,
            'title' => 'eBook - Saúde Masculina em Alta Performance: Hormônios, Treino e Dieta',
            'slug' => 'saude-masculina-alta-performance',
            'description' => 'Guia completo para otimizar saúde masculina',
            'price' => 5.00,
            'original_price' => 10.00,
            'category' => 'Saúde',
            'status' => 'active',
            'rating' => 5,
            'reviews_count' => 127,
            'created_at' => '2024-01-15 10:00:00'
        ],
        [
            'id' => 2,
            'title' => 'eBook - Emagrecimento Inteligente: Estratégias para Perder Gordura de Verdade',
            'slug' => 'emagrecimento-inteligente',
            'description' => 'Método científico para perda de peso sustentável',
            'price' => 25.00,
            'original_price' => 50.00,
            'category' => 'Emagrecimento',
            'status' => 'active',
            'rating' => 4.5,
            'reviews_count' => 89,
            'created_at' => '2024-01-14 15:30:00'
        ],
        [
            'id' => 3,
            'title' => 'eBook - Mobilidade e Alongamento: Evite Lesões e Melhore o Desempenho',
            'slug' => 'mobilidade-alongamento',
            'description' => 'Programa completo de flexibilidade e mobilidade',
            'price' => 27.00,
            'original_price' => 40.00,
            'category' => 'Treinos',
            'status' => 'active',
            'rating' => 4.8,
            'reviews_count' => 156,
            'created_at' => '2024-01-13 09:15:00'
        ]
    ];
}

// Processar requisição
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$api = new ProductAPI();

switch ($method) {
    case 'GET':
        if ($action === 'categories') {
            $api->getCategories();
        } elseif (isset($_GET['id'])) {
            $api->getProduct($_GET['id']);
        } else {
            // Usar mock dados por enquanto
            $products = getMockProducts();
            
            $category = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            
            if ($category) {
                $products = array_filter($products, function($p) use ($category) {
                    return stripos($p['category'], $category) !== false;
                });
            }
            
            if ($search) {
                $products = array_filter($products, function($p) use ($search) {
                    return stripos($p['title'], $search) !== false || stripos($p['description'], $search) !== false;
                });
            }
            
            foreach ($products as &$product) {
                $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
                $product['image_url'] = SITE_URL . 'assets/images/products/cover-' . $product['id'] . '.jpg';
                $product['url'] = SITE_URL . 'produto/' . $product['slug'];
            }
            
            echo json_encode([
                'success' => true,
                'data' => array_values($products),
                'total' => count($products)
            ]);
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
