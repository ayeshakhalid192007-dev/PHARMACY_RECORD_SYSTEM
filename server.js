const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============ AUTHENTICATION ROUTES ============

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db.findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, password, role, email } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = db.createUser({
            username,
            password: hashedPassword,
            role: role || 'Staff',
            email
        });

        res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ MEDICINE ROUTES ============

app.get('/api/medicines', (req, res) => {
    try {
        const medicines = db.getAllMedicines();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/medicines', (req, res) => {
    try {
        const medicine = db.createMedicine(req.body);
        res.json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/medicines/:id', (req, res) => {
    try {
        const medicine = db.updateMedicine(parseInt(req.params.id), req.body);
        if (medicine) {
            res.json(medicine);
        } else {
            res.status(404).json({ error: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/medicines/:id', (req, res) => {
    try {
        const success = db.deleteMedicine(parseInt(req.params.id));
        if (success) {
            res.json({ message: 'Medicine deleted successfully' });
        } else {
            res.status(404).json({ error: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ STOCK ROUTES ============

app.get('/api/stock', (req, res) => {
    try {
        const stock = db.getAllStock();
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/stock/receive', (req, res) => {
    try {
        db.receiveStock(req.body);
        res.json({ message: 'Stock received successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/stock/low', (req, res) => {
    try {
        const lowStock = db.getLowStock();
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ CUSTOMER ROUTES ============

app.get('/api/customers', (req, res) => {
    try {
        const customers = db.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers', (req, res) => {
    try {
        const customer = db.createCustomer(req.body);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/customers/:id', (req, res) => {
    try {
        const customer = db.updateCustomer(parseInt(req.params.id), req.body);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/customers/:id', (req, res) => {
    try {
        const success = db.deleteCustomer(parseInt(req.params.id));
        if (success) {
            res.json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/customers/:id/history', (req, res) => {
    try {
        const history = db.getCustomerHistory(parseInt(req.params.id));
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ SUPPLIER ROUTES ============

app.get('/api/suppliers', (req, res) => {
    try {
        const suppliers = db.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/suppliers', (req, res) => {
    try {
        const supplier = db.createSupplier(req.body);
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/suppliers/:id', (req, res) => {
    try {
        const supplier = db.updateSupplier(parseInt(req.params.id), req.body);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/suppliers/:id', (req, res) => {
    try {
        const success = db.deleteSupplier(parseInt(req.params.id));
        if (success) {
            res.json({ message: 'Supplier deleted successfully' });
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ============ SALES ROUTES ============

app.get('/api/sales', (req, res) => {
    try {
        const sales = db.getAllSales();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sales', (req, res) => {
    try {
        const { customer_id, items, discount, payment_method, created_by } = req.body;

        // Calculate totals
        let total_amount = 0;
        items.forEach(item => {
            total_amount += item.quantity * item.unit_price;
        });

        const final_amount = total_amount - (discount || 0);

        const sale = db.createSale({
            customer_id,
            items,
            total_amount,
            discount: discount || 0,
            final_amount,
            payment_method,
            created_by
        });

        res.json({ id: sale.id, total_amount, final_amount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/sales/:id', (req, res) => {
    try {
        const sale = db.getSaleById(parseInt(req.params.id));
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ error: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ REPORTS ROUTES ============

app.get('/api/reports/dashboard', (req, res) => {
    try {
        const stats = db.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/reports/sales', (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const sales = db.getSalesReport(start_date, end_date);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/reports/expiry', (req, res) => {
    try {
        const expiring = db.getExpiryReport();
        res.json(expiring);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🏥 Pharmacy Record System running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`👤 Default login: username: admin, password: admin123`);
});
