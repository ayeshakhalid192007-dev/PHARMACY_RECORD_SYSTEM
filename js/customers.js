// ============ CUSTOMERS MODULE ============

function initCustomers() {
    loadCustomers();

    document.getElementById('addCustomerBtn').addEventListener('click', () => {
        if (requireAuth()) showAddCustomerModal();
    });
}

function loadCustomers() {
    const customers = db.getCustomers();
    const tbody = document.getElementById('customersTableBody');

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No customers found</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.address}</td>
            <td>
                <button class="btn btn-sm btn-primary">Edit</button>
            </td>
        </tr>
    `).join('');
}

function showAddCustomerModal() {
    const content = `
        <div class="modal-header">
            <h2>Add Customer</h2>
            <button class="close-modal" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="saveCustomer(event)">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" name="phone" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email">
            </div>
             <div class="form-group">
                <label>Address</label>
                <input type="text" name="address">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Customer</button>
            </div>
        </form>
    `;
    showModal(content);
}

function saveCustomer(event) {
    event.preventDefault();
    const form = event.target;

    db.addCustomer({
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value
    });

    showNotification('Customer Added', 'success');
    closeModal();
    loadCustomers();
}
