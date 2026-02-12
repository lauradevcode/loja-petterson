<?php
/**
 * Controller Administrativo
 */

namespace Controllers;

use Config\Config;

class AdminController {
    
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if ($username === Config::ADMIN_USERNAME && $password === Config::ADMIN_PASSWORD) {
            // Criar sessão admin
            session_start();
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $username;
            
            echo json_encode([
                'success' => true,
                'message' => 'Login realizado com sucesso'
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Credenciais inválidas'
            ]);
        }
    }
    
    public function stats() {
        $this->checkAuth();
        
        // Mock de estatísticas
        echo json_encode([
            'success' => true,
            'data' => [
                'total_sales' => rand(10, 50),
                'total_revenue' => rand(500, 2000),
                'total_products' => 13,
                'total_orders' => rand(5, 25),
                'sales_today' => rand(10, 50),
                'revenue_today' => rand(500, 2000),
                'orders_today' => rand(5, 25)
            ]
        ]);
    }
    
    public function products() {
        $this->checkAuth();
        
        // Mock de produtos
        echo json_encode([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'title' => 'eBook - Saúde Masculina em Alta Performance',
                    'price' => 5.00,
                    'status' => 'active',
                    'sales' => 127
                ],
                [
                    'id' => 2,
                    'title' => 'eBook - Emagrecimento Inteligente',
                    'price' => 25.00,
                    'status' => 'active',
                    'sales' => 89
                ],
                [
                    'id' => 3,
                    'title' => 'eBook - Mobilidade e Alongamento',
                    'price' => 27.00,
                    'status' => 'active',
                    'sales' => 156
                ]
            ]
        ]);
    }
    
    private function checkAuth() {
        session_start();
        
        if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Não autorizado'
            ]);
            exit;
        }
    }
}
?>
