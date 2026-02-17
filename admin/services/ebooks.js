// E-books Management Service
class EbooksService {
    constructor() {
        this.ebooks = this.loadEbooks();
    }

    loadEbooks() {
        const saved = localStorage.getItem('adminEbooks');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Cover Styles
        // .cover-saude-masculina {
        //     background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // .cover-emagrecimento {
        //     background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // .cover-mobilidade {
        //     background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // .cover-dieta {
        //     background: linear-gradient(135deg, var(--warning) 0%, var(--secondary-600) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // .cover-financas {
        //     background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-700) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // .cover-bem-estar {
        //     background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
        //     transition: transform 0.3s ease, box-shadow 0.3s ease;
        // }

        // Mock data
        return [
            {
                id: 1,
                title: 'Saúde Masculina em Alta Performance',
                price: 5.00,
                description: 'Guia completo para saúde masculina com hormônios, treino e dieta. Aprenda a otimizar sua performance física e mental.',
                image: null,
                category: 'Saúde',
                pages: 120,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 2,
                title: 'Emagrecimento Inteligente',
                price: 25.00,
                description: 'Estratégias eficazes e baseadas em ciência para perder gordura de forma sustentável sem dietas restritivas.',
                image: null,
                category: 'Nutrição',
                pages: 95,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 3,
                title: 'Mobilidade e Alongamento',
                price: 27.00,
                description: 'Evite lesões e melhore seu desempenho com exercícios de mobilidade e alongamento para todos os níveis.',
                image: null,
                category: 'Fitness',
                pages: 85,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 4,
                title: 'Dieta Low Carb',
                price: 35.00,
                description: 'Guia completo de dieta low carb com receitas deliciosas e plano alimentar para emagrecer com saúde.',
                image: null,
                category: 'Nutrição',
                pages: 150,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 5,
                title: 'Treino em Casa',
                price: 20.00,
                description: 'Programa completo de treino para fazer em casa com equipamentos simples ou apenas o peso corporal.',
                image: null,
                category: 'Fitness',
                pages: 110,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 6,
                title: 'Meditação para Iniciantes',
                price: 15.00,
                description: 'Guia prático de meditação para reduzir o estresse e aumentar o foco e bem-estar mental.',
                image: null,
                category: 'Bem-estar',
                pages: 80,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 7,
                title: 'Sono de Qualidade',
                price: 18.00,
                description: 'Técnicas e hábitos para melhorar a qualidade do seu sono e ter mais energia durante o dia.',
                image: null,
                category: 'Bem-estar',
                pages: 90,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            },
            {
                id: 8,
                title: 'Finanças Pessoais',
                price: 30.00,
                description: 'Guia prático para organizar suas finanças, sair das dívidas e construir riqueza a longo prazo.',
                image: null,
                category: 'Finanças',
                pages: 130,
                format: 'PDF',
                delivery: 'E-mail automático após pagamento'
            }
        ];
    }

    saveEbooks() {
        localStorage.setItem('adminEbooks', JSON.stringify(this.ebooks));
    }

    getAll() {
        return this.ebooks;
    }

    getById(id) {
        return this.ebooks.find(ebook => ebook.id === parseInt(id));
    }

    create(ebookData) {
        const newEbook = {
            id: Date.now(),
            ...ebookData,
            createdAt: new Date().toISOString()
        };
        
        this.ebooks.push(newEbook);
        this.saveEbooks();
        return newEbook;
    }

    update(id, ebookData) {
        const index = this.ebooks.findIndex(ebook => ebook.id === parseInt(id));
        if (index !== -1) {
            this.ebooks[index] = {
                ...this.ebooks[index],
                ...ebookData,
                updatedAt: new Date().toISOString()
            };
            this.saveEbooks();
            return this.ebooks[index];
        }
        return null;
    }

    delete(id) {
        const index = this.ebooks.findIndex(ebook => ebook.id === parseInt(id));
        if (index !== -1) {
            const deleted = this.ebooks.splice(index, 1)[0];
            this.saveEbooks();
            return deleted;
        }
        return null;
    }
}

// Initialize service
const ebooksService = new EbooksService();
