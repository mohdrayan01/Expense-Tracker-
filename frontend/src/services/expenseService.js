import api from './api';

export const expenseService = {
    getExpenses: async (params = {}) => {
        const response = await api.get('/expenses', { params });
        return response.data;
    },

    getExpense: async (id) => {
        const response = await api.get(`/expenses/${id}`);
        return response.data;
    },

    createExpense: async (expenseData) => {
        const response = await api.post('/expenses', expenseData);
        return response.data;
    },

    updateExpense: async (id, expenseData) => {
        const response = await api.put(`/expenses/${id}`, expenseData);
        return response.data;
    },

    deleteExpense: async (id) => {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },

    exportCSV: async () => {
        const response = await api.get('/expenses/export/csv', {
            responseType: 'blob'
        });
        return response.data;
    }
};

export const categoryService = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

export const budgetService = {
    getBudgets: async () => {
        const response = await api.get('/budgets');
        return response.data;
    },

    getBudgetStatus: async () => {
        const response = await api.get('/budgets/status');
        return response.data;
    },

    createBudget: async (budgetData) => {
        const response = await api.post('/budgets', budgetData);
        return response.data;
    },

    updateBudget: async (id, budgetData) => {
        const response = await api.put(`/budgets/${id}`, budgetData);
        return response.data;
    },

    deleteBudget: async (id) => {
        const response = await api.delete(`/budgets/${id}`);
        return response.data;
    }
};

export const analyticsService = {
    getSummary: async () => {
        const response = await api.get('/analytics/summary');
        return response.data;
    },

    getMonthlyBreakdown: async (year) => {
        const response = await api.get('/analytics/monthly', { params: { year } });
        return response.data;
    },

    getCategoryWise: async (params = {}) => {
        const response = await api.get('/analytics/category-wise', { params });
        return response.data;
    },

    getTrends: async () => {
        const response = await api.get('/analytics/trends');
        return response.data;
    }
};
