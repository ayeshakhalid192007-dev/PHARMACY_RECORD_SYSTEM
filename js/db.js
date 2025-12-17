// ============ SIMPLE DATABASE MODULE ============
// This file handles all data saving and loading using LocalStorage
// It acts like a mini-database in your browser!

const db = {
    // 1. INITIALIZE DATABASE
    // This runs when the app starts. It checks if data exists.
    // If not, it creates some sample data.
    init() {
        if (!localStorage.getItem('users')) {
            this.saveUsers([
                { id: 1, username: 'admin', password: '123', role: 'Admin', email: 'admin@pharmacy.com' },
                { id: 2, username: 'staff', password: '123', role: 'Staff', email: 'staff@pharmacy.com' }
            ]);
        }

        if (!localStorage.getItem('medicines')) {
            this.saveMedicines([
                { id: 1, name: 'Paracetamol', category: 'Tablet', price: 5.00, quantity: 100, expiry_date: '2025-12-31' },
                { id: 2, name: 'Cough Syrup', category: 'Syrup', price: 12.50, quantity: 50, expiry_date: '2024-06-01' }
            ]);
        }

        if (!localStorage.getItem('sales')) {
            this.saveSales([]);
        }

        if (!localStorage.getItem('customers')) {
            this.saveCustomers([]);
        }

        console.log("Database Initialized!");
    },

    // ============ USERS (LOGIN) ============
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = Date.now(); // Simple unique ID based on time
        users.push(user);
        this.saveUsers(users);
        return user;
    },

    findUser(username, password) {
        const users = this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    },

    // ============ MEDICINES ============
    getMedicines() {
        return JSON.parse(localStorage.getItem('medicines') || '[]');
    },

    saveMedicines(medicines) {
        localStorage.setItem('medicines', JSON.stringify(medicines));
    },

    addMedicine(medicine) {
        const medicines = this.getMedicines();
        medicine.id = Date.now();
        medicines.push(medicine);
        this.saveMedicines(medicines);
    },

    deleteMedicine(id) {
        let medicines = this.getMedicines();
        medicines = medicines.filter(m => m.id !== id);
        this.saveMedicines(medicines);
    },

    updateMedicine(id, updatedData) {
        let medicines = this.getMedicines();
        const index = medicines.findIndex(m => m.id === id);
        if (index !== -1) {
            medicines[index] = { ...medicines[index], ...updatedData };
            this.saveMedicines(medicines);
        }
    },

    // ============ CUSTOMERS ============
    getCustomers() {
        return JSON.parse(localStorage.getItem('customers') || '[]');
    },

    saveCustomers(customers) {
        localStorage.setItem('customers', JSON.stringify(customers));
    },

    addCustomer(customer) {
        const customers = this.getCustomers();
        customer.id = Date.now();
        customers.push(customer);
        this.saveCustomers(customers);
    },

    // ============ SALES ============
    getSales() {
        return JSON.parse(localStorage.getItem('sales') || '[]');
    },

    saveSales(sales) {
        localStorage.setItem('sales', JSON.stringify(sales));
    },

    addSale(sale) {
        const sales = this.getSales();
        sale.id = Date.now();
        sale.date = new Date().toISOString();
        sales.push(sale);
        this.saveSales(sales);
    }
};

// Initialize on load
db.init();
