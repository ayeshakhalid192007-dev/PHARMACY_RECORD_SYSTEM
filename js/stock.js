// ============ STOCK MODULE ============
// Handles Stock Levels and Warnings

function initStock() {
    loadStockOverview();
}

function loadStockOverview() {
    const medicines = db.getMedicines();

    // Calculate Stats
    const totalItems = medicines.reduce((sum, m) => sum + parseInt(m.quantity), 0);
    const lowStockItems = medicines.filter(m => m.quantity < 10);

    // Update UI numbers
    document.getElementById('totalItems').innerText = totalItems;
    document.getElementById('lowStockItems').innerText = lowStockItems.length;

    // Show Low Stock Table
    displayStockTable(medicines);
}

function displayStockTable(list) {
    const tbody = document.getElementById('stockTableBody');

    // Only show interesting items (e.g., recent changes or all items)
    // Here we just show all items for simplicity

    tbody.innerHTML = list.map(med => `
        <tr>
            <td>${med.name}</td>
            <td>${med.quantity}</td>
            <td>${med.quantity < 10 ? '<span class="badge badge-danger">Low</span>' : '<span class="badge badge-success">OK</span>'}</td>
            <td>Ref-Init</td>
            <td>${formatDate(new Date())}</td>
        </tr>
    `).join('');
}
