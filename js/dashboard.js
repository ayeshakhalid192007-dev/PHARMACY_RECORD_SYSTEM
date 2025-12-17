// ============ DASHBOARD MODULE ============

function initDashboard() {
    loadDashboardStats();
}

function loadDashboardStats() {
    const meds = db.getMedicines();
    const sales = db.getSales();
    const customers = db.getCustomers();

    const lowStock = meds.filter(m => m.quantity < 10).length;
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

    const statsGrid = document.getElementById('statsGrid');

    // Create Stats Cards
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h3>Total Sales</h3>
            <p class="stat-value">${formatCurrency(totalSales)}</p>
        </div>
        <div class="stat-card">
            <h3>Medicines</h3>
            <p class="stat-value">${meds.length}</p>
        </div>
        <div class="stat-card alert">
            <h3>Low Stock</h3>
            <p class="stat-value">${lowStock}</p>
        </div>
        <div class="stat-card">
            <h3>Customers</h3>
            <p class="stat-value">${customers.length}</p>
        </div>
    `;
}
