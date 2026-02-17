// Sales Management Service
class SalesService {
    constructor() {
        this.sales = this.loadSales();
    }

    loadSales() {
        const saved = localStorage.getItem('adminSales');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Mock data para demonstração
        return [
            {
                id: 1,
                date: '2024-03-15',
                customer: {
                    name: 'João Silva',
                    email: 'joao@email.com'
                },
                ebook: {
                    title: 'Saúde Masculina em Alta Performance',
                    price: 5.00
                },
                status: 'completed',
                paymentMethod: 'PagSeguro'
            },
            {
                id: 2,
                date: '2024-03-14',
                customer: {
                    name: 'Maria Santos',
                    email: 'maria@email.com'
                },
                ebook: {
                    title: 'Emagrecimento Inteligente',
                    price: 25.00
                },
                status: 'completed',
                paymentMethod: 'PagSeguro'
            },
            {
                id: 3,
                date: '2024-03-14',
                customer: {
                    name: 'Pedro Oliveira',
                    email: 'pedro@email.com'
                },
                ebook: {
                    title: 'Mobilidade e Alongamento',
                    price: 27.00
                },
                status: 'pending',
                paymentMethod: 'PagSeguro'
            },
            {
                id: 4,
                date: '2024-03-13',
                customer: {
                    name: 'Ana Costa',
                    email: 'ana@email.com'
                },
                ebook: {
                    title: 'Saúde Masculina em Alta Performance',
                    price: 5.00
                },
                status: 'completed',
                paymentMethod: 'PagSeguro'
            },
            {
                id: 5,
                date: '2024-03-12',
                customer: {
                    name: 'Carlos Ferreira',
                    email: 'carlos@email.com'
                },
                ebook: {
                    title: 'Emagrecimento Inteligente',
                    price: 25.00
                },
                status: 'cancelled',
                paymentMethod: 'PagSeguro'
            }
        ];
    }

    getAll() {
        return this.sales;
    }

    getFiltered(filters = {}) {
        let filtered = [...this.sales];
        
        if (filters.month) {
            filtered = filtered.filter(sale => sale.date.startsWith(filters.month));
        }
        
        if (filters.date) {
            filtered = filtered.filter(sale => sale.date === filters.date);
        }
        
        if (filters.status) {
            filtered = filtered.filter(sale => sale.status === filters.status);
        }
        
        return filtered;
    }

    exportToPDF(sales) {
        // Criar conteúdo HTML para o PDF
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Vendas - Mais Você Ebooks</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #ff6b9d; text-align: center; }
                    h2 { color: #333; margin-top: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #ff6b9d; color: white; padding: 12px; text-align: left; }
                    td { padding: 12px; border-bottom: 1px solid #ddd; }
                    .total { font-weight: bold; background: #f8f9fa; }
                    .status-completed { color: #10b981; }
                    .status-pending { color: #f59e0b; }
                    .status-cancelled { color: #ef4444; }
                    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>Relatório de Vendas</h1>
                <h2>Mais Você Ebooks</h2>
                <p>Período: ${new Date().toLocaleDateString('pt-BR')}</p>
                <p>Total de vendas: ${sales.length}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>E-book</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sales.map(sale => `
                            <tr>
                                <td>${new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                <td>${sale.customer.name}</td>
                                <td>${sale.ebook.title}</td>
                                <td>R$ ${sale.ebook.price.toFixed(2)}</td>
                                <td class="status-${sale.status}">${this.getStatusText(sale.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total">
                            <td colspan="3">Total</td>
                            <td>R$ ${sales.reduce((sum, sale) => sum + sale.ebook.price, 0).toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="footer">
                    <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
                    <p>Mais Você Ebooks © 2024</p>
                </div>
            </body>
            </html>
        `;

        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Aguardar o conteúdo carregar e imprimir
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Concluído',
            'pending': 'Pendente',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }
}

// Inicializar serviço
const salesService = new SalesService();
