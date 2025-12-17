const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, 'pharmacy_data.json');

// Initialize database structure
let db = {
    users: [],
    medicines: [],
    stock: [],
    customers: [],
    suppliers: [],
    sales: [],
    invoices: [],
    purchases: []
};

// Auto-increment IDs
let autoIncrementIds = {
    users: 1,
    medicines: 1,
    stock: 1,
    customers: 1,
    suppliers: 1,
    sales: 1,
    invoices: 1,
    purchases: 1
};

// Load database from file
function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            const loadedData = JSON.parse(data);
            db = loadedData.db || db;
            autoIncrementIds = loadedData.autoIncrementIds || autoIncrementIds;
            console.log('Database loaded successfully');
        } else {
            initializeDatabase();
        }
    } catch (error) {
        console.error('Error loading database:', error);
        initializeDatabase();
    }
}

// Save database to file
function saveDatabase() {
    try {
        const data = JSON.stringify({ db, autoIncrementIds }, null, 2);
        fs.writeFileSync(DB_FILE, data, 'utf8');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Initialize database with default admin user
function initializeDatabase() {
    const adminExists = db.users.find(u => u.username === 'admin');
    if (!adminExists) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.users.push({
            id: autoIncrementIds.users++,
            username: 'admin',
            password: hashedPassword,
            role: 'Admin',
            email: 'admin@pharmacy.com',
            created_at: new Date().toISOString()
        });
        saveDatabase();
        console.log('Default admin user created (username: admin, password: admin123)');
    }
}

// Helper functions
function getNextId(table) {
    return autoIncrementIds[table]++;
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

// Database operations
const database = {
    // Users
    findUserByUsername: (username) => {
        return db.users.find(u => u.username === username);
    },

    createUser: (userData) => {
        const user = {
            id: getNextId('users'),
            ...userData,
            created_at: getCurrentTimestamp()
        };
        db.users.push(user);
        saveDatabase();
        return user;
    },

    // Medicines
    getAllMedicines: () => {
        return db.medicines.map(medicine => {
            const supplier = db.suppliers.find(s => s.id === medicine.supplier_id);
            return {
                ...medicine,
                supplier_name: supplier ? supplier.name : null
            };
        });
    },

    createMedicine: (medicineData) => {
        const medicine = {
            id: getNextId('medicines'),
            ...medicineData,
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp()
        };
        db.medicines.push(medicine);

        // Add stock transaction
        db.stock.push({
            id: getNextId('stock'),
            medicine_id: medicine.id,
            quantity: medicineData.quantity,
            transaction_type: 'IN',
            reference: 'Initial Stock',
            created_at: getCurrentTimestamp()
        });

        saveDatabase();
        return medicine;
    },

    updateMedicine: (id, medicineData) => {
        const index = db.medicines.findIndex(m => m.id === id);
        if (index !== -1) {
            db.medicines[index] = {
                ...db.medicines[index],
                ...medicineData,
                updated_at: getCurrentTimestamp()
            };
            saveDatabase();
            return db.medicines[index];
        }
        return null;
    },

    deleteMedicine: (id) => {
        const index = db.medicines.findIndex(m => m.id === id);
        if (index !== -1) {
            db.medicines.splice(index, 1);
            saveDatabase();
            return true;
        }
        return false;
    },

    // Stock
    getAllStock: () => {
        return db.stock.map(s => {
            const medicine = db.medicines.find(m => m.id === s.medicine_id);
            return {
                ...s,
                medicine_name: medicine ? medicine.name : 'Unknown'
            };
        });
    },

    receiveStock: (stockData) => {
        db.stock.push({
            id: getNextId('stock'),
            ...stockData,
            transaction_type: 'IN',
            created_at: getCurrentTimestamp()
        });

        // Update medicine quantity
        const medicine = db.medicines.find(m => m.id === stockData.medicine_id);
        if (medicine) {
            medicine.quantity += stockData.quantity;
        }

        saveDatabase();
    },

    getLowStock: () => {
        return db.medicines.filter(m => m.quantity < 10);
    },

    // Customers
    getAllCustomers: () => db.customers,

    createCustomer: (customerData) => {
        const customer = {
            id: getNextId('customers'),
            ...customerData,
            created_at: getCurrentTimestamp()
        };
        db.customers.push(customer);
        saveDatabase();
        return customer;
    },

    updateCustomer: (id, customerData) => {
        const index = db.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            db.customers[index] = { ...db.customers[index], ...customerData };
            saveDatabase();
            return db.customers[index];
        }
        return null;
    },

    deleteCustomer: (id) => {
        const index = db.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            db.customers.splice(index, 1);
            saveDatabase();
            return true;
        }
        return false;
    },

    getCustomerHistory: (customerId) => {
        return db.sales.filter(s => s.customer_id === customerId).map(sale => {
            const saleInvoices = db.invoices.filter(i => i.sale_id === sale.id);
            const medicines = saleInvoices.map(inv => {
                const med = db.medicines.find(m => m.id === inv.medicine_id);
                return med ? med.name : 'Unknown';
            }).join(', ');

            return { ...sale, medicines };
        });
    },

    // Suppliers
    getAllSuppliers: () => db.suppliers,

    createSupplier: (supplierData) => {
        const supplier = {
            id: getNextId('suppliers'),
            ...supplierData,
            created_at: getCurrentTimestamp()
        };
        db.suppliers.push(supplier);
        saveDatabase();
        return supplier;
    },

    updateSupplier: (id, supplierData) => {
        const index = db.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            db.suppliers[index] = { ...db.suppliers[index], ...supplierData };
            saveDatabase();
            return db.suppliers[index];
        }
        return null;
    },

    deleteSupplier: (id) => {
        const index = db.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            db.suppliers.splice(index, 1);
            saveDatabase();
            return true;
        }
        return false;
    },

    // Sales
    getAllSales: () => {
        return db.sales.map(sale => {
            const customer = db.customers.find(c => c.id === sale.customer_id);
            const user = db.users.find(u => u.id === sale.created_by);
            return {
                ...sale,
                customer_name: customer ? customer.name : null,
                created_by_name: user ? user.username : null
            };
        });
    },

    createSale: (saleData) => {
        const sale = {
            id: getNextId('sales'),
            customer_id: saleData.customer_id,
            total_amount: saleData.total_amount,
            discount: saleData.discount,
            final_amount: saleData.final_amount,
            payment_method: saleData.payment_method,
            created_by: saleData.created_by,
            created_at: getCurrentTimestamp()
        };
        db.sales.push(sale);

        // Add invoice items
        saleData.items.forEach(item => {
            db.invoices.push({
                id: getNextId('invoices'),
                sale_id: sale.id,
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.quantity * item.unit_price
            });

            // Update medicine stock
            const medicine = db.medicines.find(m => m.id === item.medicine_id);
            if (medicine) {
                medicine.quantity -= item.quantity;
            }

            // Add stock transaction
            db.stock.push({
                id: getNextId('stock'),
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                transaction_type: 'OUT',
                reference: `Sale #${sale.id}`,
                created_at: getCurrentTimestamp()
            });
        });

        saveDatabase();
        return sale;
    },

    getSaleById: (id) => {
        const sale = db.sales.find(s => s.id === id);
        if (!sale) return null;

        const customer = db.customers.find(c => c.id === sale.customer_id);
        const items = db.invoices.filter(i => i.sale_id === id).map(invoice => {
            const medicine = db.medicines.find(m => m.id === invoice.medicine_id);
            return {
                ...invoice,
                medicine_name: medicine ? medicine.name : 'Unknown'
            };
        });

        return {
            ...sale,
            customer_name: customer ? customer.name : null,
            customer_phone: customer ? customer.phone : null,
            items
        };
    },

    // Reports
    getDashboardStats: () => {
        const totalMedicines = db.medicines.length;
        const lowStock = db.medicines.filter(m => m.quantity < 10).length;
        const today = new Date().toISOString().split('T')[0];
        const expired = db.medicines.filter(m => m.expiry_date < today).length;
        const todaySales = db.sales
            .filter(s => s.created_at.startsWith(today))
            .reduce((sum, s) => sum + s.final_amount, 0);

        return {
            totalMedicines,
            lowStock,
            expired,
            todaySales
        };
    },

    getSalesReport: (startDate, endDate) => {
        if (startDate && endDate) {
            return db.sales.filter(s => {
                const saleDate = s.created_at.split('T')[0];
                return saleDate >= startDate && saleDate <= endDate;
            });
        }
        return db.sales;
    },

    getExpiryReport: () => {
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        return db.medicines.filter(m => {
            const expiryDate = new Date(m.expiry_date);
            return expiryDate > today && expiryDate <= thirtyDaysLater;
        });
    }
};

// Load database on startup
loadDatabase();

module.exports = database;
