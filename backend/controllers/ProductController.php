<?php
/**
 * Controller de Produtos
 */

namespace Controllers;

use Models\Product;
use Config\Database;

class ProductController {
    private $productModel;
    
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->productModel = new Product($db);
    }
    
    public function index() {
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = $_GET['limit'] ?? null;
        $offset = $_GET['offset'] ?? 0;
        
        $products = $this->productModel->getAll($category, $search, $limit, $offset);
        
        echo json_encode([
            'success' => true,
            'data' => $products,
            'total' => count($products)
        ]);
    }
    
    public function show($id) {
        $product = $this->productModel->getById($id);
        
        if ($product) {
            echo json_encode([
                'success' => true,
                'data' => $product
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Produto não encontrado'
            ]);
        }
    }
    
    public function categories() {
        $categories = $this->productModel->getCategories();
        
        echo json_encode([
            'success' => true,
            'data' => $categories
        ]);
    }
}
?>
