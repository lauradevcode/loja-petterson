// Dashboard Hooks and Event Handlers
class DashboardController {
    constructor() {
        this.currentSection = 'dashboard';
        this.editingEbook = null;
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        this.setupEbookForm();
        this.setupLogout();
        this.setupSalesTable();
        this.loadEbooks();
        this.loadSales();
        this.showSection('dashboard');
    }

    setupSalesTable() {
        // Botão exportar PDF
        const btnExportPDF = document.getElementById('btnExportPDF');
        if (btnExportPDF) {
            btnExportPDF.addEventListener('click', () => {
                this.exportSalesToPDF();
            });
        }

        // Botão atualizar
        const btnRefresh = document.getElementById('btnRefresh');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                this.loadSales();
            });
        }

        // Filtros
        const monthFilter = document.getElementById('monthFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (monthFilter) {
            monthFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    loadSales() {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        const sales = salesService.getAll();
        this.renderSalesTable(sales);
    }

    renderSalesTable(sales) {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        if (sales.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty">
                        <div class="table-empty">
                            <i class="fas fa-chart-line"></i>
                            <h4>Nenhuma venda encontrada</h4>
                            <p>Não há vendas no período selecionado.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = sales.map(sale => `
            <tr>
                <td>${new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                <td class="customer-name">${sale.customer.name}</td>
                <td class="ebook-title" title="${sale.ebook.title}">${sale.ebook.title}</td>
                <td class="amount">R$ ${sale.ebook.price.toFixed(2)}</td>
                <td>
                    <span class="status status-${sale.status}">
                        ${this.getStatusText(sale.status)}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-action btn-view" onclick="dashboardController.viewSale(${sale.id})" title="Ver detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-download" onclick="dashboardController.downloadInvoice(${sale.id})" title="Baixar nota fiscal">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    applyFilters() {
        const monthFilter = document.getElementById('monthFilter')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;
        
        const filters = {};
        if (monthFilter) filters.month = monthFilter;
        if (dateFilter) filters.date = dateFilter;
        
        const filteredSales = salesService.getFiltered(filters);
        this.renderSalesTable(filteredSales);
    }

    exportSalesToPDF() {
        const sales = salesService.getAll();
        
        if (sales.length === 0) {
            this.showNotification('Não há vendas para exportar', 'error');
            return;
        }

        // Mostrar loading
        const btn = document.getElementById('btnExportPDF');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
        btn.disabled = true;

        setTimeout(() => {
            salesService.exportToPDF(sales);
            
            // Restaurar botão
            btn.innerHTML = originalContent;
            btn.disabled = false;
            
            this.showNotification('PDF gerado com sucesso!', 'success');
        }, 1500);
    }

    viewSale(saleId) {
        const sale = salesService.getAll().find(s => s.id === saleId);
        if (sale) {
            // Aqui você pode abrir um modal com detalhes da venda
            console.log('Visualizar venda:', sale);
            this.showNotification('Detalhes da venda em desenvolvimento', 'info');
        }
    }

    downloadInvoice(saleId) {
        const sale = salesService.getAll().find(s => s.id === saleId);
        if (sale) {
            // Aqui você pode gerar uma nota fiscal em PDF
            console.log('Baixar nota fiscal:', sale);
            this.showNotification('Nota fiscal em desenvolvimento', 'info');
        }
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Concluído',
            'pending': 'Pendente',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.admin-nav .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(section) {
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(s => s.classList.remove('active'));
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
        }
    }

    setupModal() {
        const modal = document.getElementById('ebookModal');
        const btnAdd = document.getElementById('btnAddEbook');
        const btnClose = document.getElementById('modalClose');
        const btnCancel = document.getElementById('btnCancel');

        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                this.openModal();
            });
        }

        if (btnClose) {
            btnClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    openModal(ebook = null) {
        const modal = document.getElementById('ebookModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('ebookForm');

        this.editingEbook = ebook;

        if (ebook) {
            modalTitle.textContent = 'Editar E-book';
            document.getElementById('ebookTitle').value = ebook.title;
            document.getElementById('ebookPrice').value = ebook.price;
            document.getElementById('ebookDescription').value = ebook.description;
        } else {
            modalTitle.textContent = 'Novo E-book';
            form.reset();
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('ebookModal');
        modal.style.display = 'none';
        this.editingEbook = null;
    }

    setupEbookForm() {
        const form = document.getElementById('ebookForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const ebookData = {
                title: document.getElementById('ebookTitle').value,
                price: parseFloat(document.getElementById('ebookPrice').value),
                description: document.getElementById('ebookDescription').value,
                image: null // Handle image upload later
            };

            try {
                if (this.editingEbook) {
                    await ebooksService.update(this.editingEbook.id, ebookData);
                    this.showNotification('E-book atualizado com sucesso!');
                } else {
                    await ebooksService.create(ebookData);
                    this.showNotification('E-book criado com sucesso!');
                }

                this.closeModal();
                this.loadEbooks();
            } catch (error) {
                this.showNotification('Erro ao salvar e-book', 'error');
            }
        });
    }

    setupLogout() {
        const btnLogout = document.getElementById('btnLogout');
        
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                adminAuth.logout();
            });
        }
    }

    loadEbooks() {
        const grid = document.getElementById('ebooksGrid');
        if (!grid) return;

        const ebooks = ebooksService.getAll();
        const paginatedEbooks = this.getPaginatedEbooks(ebooks);
        
        grid.innerHTML = paginatedEbooks.map(ebook => `
            <div class="ebook-card">
                <div class="ebook-card-image">
                    ${ebook.image ? 
                        `<img src="${ebook.image}" alt="${ebook.title}">` :
                        `<i class="fas fa-book" style="font-size: 2rem;"></i>`
                    }
                </div>
                <div class="ebook-card-content">
                    <h3 class="ebook-card-title">${ebook.title}</h3>
                    <div class="ebook-card-price">R$ ${ebook.price.toFixed(2)}</div>
                    <p class="ebook-card-description">${ebook.description}</p>
                    
                    <div class="ebook-card-meta">
                        <div class="meta-item">
                            <span class="meta-label">Categoria</span>
                            <span class="meta-value">${ebook.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Páginas</span>
                            <span class="meta-value">${ebook.pages}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Formato</span>
                            <span class="meta-value">${ebook.format}</span>
                        </div>
                    </div>
                    
                    <div class="ebook-card-meta">
                        <div class="meta-item" style="flex: 1;">
                            <span class="meta-label">Entrega</span>
                            <span class="meta-value">${ebook.delivery}</span>
                        </div>
                    </div>
                    
                    <div class="ebook-card-actions">
                        <button class="btn-edit" onclick="dashboardController.openModal(${JSON.stringify(ebook).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="dashboardController.deleteEbook(${ebook.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.updatePagination(ebooks.length);
    }

    getPaginatedEbooks(ebooks) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return ebooks.slice(startIndex, endIndex);
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationControls = document.getElementById('paginationControls');
        
        if (!paginationControls) return;

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="dashboardController.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="dashboardController.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span style="padding: 0 4px;">...</span>`;
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="dashboardController.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationControls.innerHTML = paginationHTML;
        
        // Update pagination info
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
        
        document.getElementById('paginationStart').textContent = start;
        document.getElementById('paginationEnd').textContent = end;
        document.getElementById('paginationTotal').textContent = totalItems;
    }

    goToPage(page) {
        const ebooks = ebooksService.getAll();
        const totalPages = Math.ceil(ebooks.length / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.loadEbooks();
        }
    }

    async deleteEbook(id) {
        if (confirm('Tem certeza que deseja excluir este e-book?')) {
            try {
                await ebooksService.delete(id);
                this.showNotification('E-book excluído com sucesso!');
                this.loadEbooks();
            } catch (error) {
                this.showNotification('Erro ao excluir e-book', 'error');
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 3000;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard controller
let dashboardController;

document.addEventListener('DOMContentLoaded', () => {
    dashboardController = new DashboardController();
});
