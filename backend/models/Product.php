<?php
/**
 * Model de Produtos
 */

namespace Models;

class Product {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll($category = null, $search = null, $limit = null, $offset = 0) {
        $query = "SELECT * FROM products WHERE status = 'active'";
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
            
            // Formatar produtos
            foreach ($products as &$product) {
                $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
                $product['image_url'] = $this->getImageUrl($product);
                $product['url'] = '/produto/' . $product['slug'];
            }
            
            return $products;
        } catch(PDOException $e) {
            return $this->getMockProducts();
        }
    }
    
    public function getById($id) {
        $query = "SELECT * FROM products WHERE id = :id AND status = 'active'";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($product) {
                $product['price_formatted'] = 'R$ ' . number_format($product['price'], 2, ',', '.');
                $product['image_url'] = $this->getImageUrl($product);
                $product['gallery'] = $this->getGallery($id);
                $product['related'] = $this->getRelated($id, $product['category']);
            }
            
            return $product;
        } catch(PDOException $e) {
            return $this->getMockProduct($id);
        }
    }
    
    public function getCategories() {
        $query = "SELECT DISTINCT category FROM products WHERE status = 'active' ORDER BY category";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch(PDOException $e) {
            return ['Saúde', 'Emagrecimento', 'Treinos', 'Nutrição', 'Finanças'];
        }
    }
    
    private function getImageUrl($product) {
        // Mock de imagem
        return '/assets/images/products/cover-' . $product['id'] . '.jpg';
    }
    
    private function getGallery($productId) {
        // Mock de galeria
        return [];
    }
    
    private function getRelated($productId, $category, $limit = 4) {
        // Mock de produtos relacionados
        return [];
    }
    
    private function getMockProducts() {
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
                'rating' => 5.0,
                'reviews_count' => 127,
                'created_at' => '2024-01-15 10:00:00',
                'price_formatted' => 'R$ 5,00',
                'image_url' => '/assets/images/products/cover-1.jpg',
                'url' => '/produto/saude-masculina-alta-performance'
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
                'created_at' => '2024-01-14 15:30:00',
                'price_formatted' => 'R$ 25,00',
                'image_url' => '/assets/images/products/cover-2.jpg',
                'url' => '/produto/emagrecimento-inteligente'
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
                'created_at' => '2024-01-13 09:15:00',
                'price_formatted' => 'R$ 27,00',
                'image_url' => '/assets/images/products/cover-3.jpg',
                'url' => '/produto/mobilidade-alongamento'
            ]
        ];
    }
    
    private function getMockProduct($id) {
        $products = $this->getMockProducts();
        foreach ($products as $product) {
            if ($product['id'] == $id) {
                return $product;
            }
        }
        return null;
    }
}
?>
