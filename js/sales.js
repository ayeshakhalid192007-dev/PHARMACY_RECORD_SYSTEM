// ============ SALES MODULE ============
// Handles Sales & Billing

function initSales() {
    loadSalesHistory();
    document.getElementById('newSaleBtn').addEventListener('click', () => {
        if (requireAuth()) showNewSaleModal();
    });
}

function loadSalesHistory() {
    const sales = db.getSales();
    const tbody = document.getElementById('salesTableBody');

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No sales recorded yet</td></tr>';
        return;
    }

    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>#${sale.id}</td>
            <td>${sale.customerName || 'Walk-in'}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${formatCurrency(0)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${formatDate(sale.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary">View</button>
            </td>
        </tr>
    `).join('');
}

function showNewSaleModal() {
    // Simple Sales Form for Demo
    const medicines = db.getMedicines();
    const options = medicines.map(m => `<option value="${m.id}">${m.name} ($${m.price})</option>`).join('');

    const content = `
        <div class="modal-header">
            <h2>New Sale</h2>
            <button class="close-modal" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="processSale(event)">
            <div class="form-group">
                <label>Select Medicine</label>
                <select name="medicineId" required>
                    ${options}
                </select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value="1" min="1" required>
            </div>
            <div class="form-group">
                <label>Customer Name (Optional)</label>
                <input type="text" name="customerName" placeholder="Walk-in Customer">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Complete Sale</button>
            </div>
        </form>
    `;
    showModal(content);
}

function processSale(event) {
    event.preventDefault();
    const form = event.target;

    const medId = parseInt(form.medicineId.value);
    const qty = parseInt(form.quantity.value);
    const customer = form.customerName.value;

    const medicine = db.getMedicines().find(m => m.id === medId);

    if (medicine) {
        if (medicine.quantity < qty) {
            showNotification("Not enough stock!", "error");
            return;
        }

        // Deduct Stock
        medicine.quantity -= qty;
        db.updateMedicine(medId, { quantity: medicine.quantity });

        // Record Sale
        const total = medicine.price * qty;
        db.addSale({
            customerName: customer,
            items: [{ name: medicine.name, qty: qty, price: medicine.price }],
            total: total
        });

        showNotification("Sale Successful!", "success");
        closeModal();
        loadSalesHistory();
    }
}
