// ============ MEDICINES MODULE ============
// Manage Medicines: View, Add, Edit, Delete

let medicines = [];

function initMedicines() {
    loadMedicines();

    // specific event listener for adding medicine
    const addBtn = document.getElementById('addMedicineBtn');
    // Using simple approach to avoid duplicate listeners if init is called multiple times
    addBtn.onclick = () => {
        if (requireAuth()) {
            showAddMedicineModal();
        }
    };

    // Live Search
    document.getElementById('medicineSearch').addEventListener('input', filterMedicines);
    document.getElementById('categoryFilter').addEventListener('change', filterMedicines);
}

// 1. Load Data
function loadMedicines() {
    medicines = db.getMedicines(); // Get from local DB
    displayMedicines(medicines);
}

// 2. Display Table
function displayMedicines(list) {
    const tbody = document.getElementById('medicinesTableBody');

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No medicines found</td></tr>';
        return;
    }

    // Convert list to HTML rows
    tbody.innerHTML = list.map(med => `
        <tr>
            <td>${med.name}</td>
            <td>${med.category}</td>
            <td>${med.batch_no || '-'}</td>
            <td>${formatCurrency(med.price)}</td>
            <td>${med.quantity}</td>
            <td>${formatDate(med.expiry_date)}</td>
            <td>${getExpiryBadge(med.expiry_date)}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editMedicine(${med.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMedicine(${med.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Helper for Expiry Badge
function getExpiryBadge(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();

    if (date < today) {
        return '<span class="badge badge-danger">Expired</span>';
    }
    // Check if expiring in 30 days
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    if (date < nextMonth) {
        return '<span class="badge badge-warning">Expiring Soon</span>';
    }

    return '<span class="badge badge-success">Valid</span>';
}

// 3. Search & Filter
function filterMedicines() {
    const search = document.getElementById('medicineSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = medicines.filter(med => {
        const matchesName = med.name.toLowerCase().includes(search);
        const matchesCategory = category === '' || med.category === category;
        return matchesName && matchesCategory;
    });

    displayMedicines(filtered);
}

// 4. Add Medicine
function showAddMedicineModal() {
    const modalContent = `
        <div class="modal-header">
            <h2>Add New Medicine</h2>
            <button class="close-modal" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="saveMedicine(event)">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Category</label>
                <select name="category" required>
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                </select>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" name="price" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" required>
            </div>
             <div class="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expiry_date" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Medicine</button>
            </div>
        </form>
    `;
    showModal(modalContent);
}

function saveMedicine(event) {
    event.preventDefault();
    const form = event.target;

    const newMed = {
        name: form.name.value,
        category: form.category.value,
        price: parseFloat(form.price.value),
        quantity: parseInt(form.quantity.value),
        expiry_date: form.expiry_date.value,
        batch_no: 'B-' + Math.floor(Math.random() * 1000) // Auto-generate batch
    };

    db.addMedicine(newMed);

    showNotification('Medicine Added!', 'success');
    closeModal();
    loadMedicines(); // Refresh list
}

// 5. Delete Medicine
function deleteMedicine(id) {
    if (!requireAuth()) return;

    if (confirm("Are you sure you want to delete this medicine?")) {
        db.deleteMedicine(id);
        showNotification("Deleted successfully");
        loadMedicines();
    }
}

// 6. Edit Medicine (Simple version)
function editMedicine(id) {
    // Ideally this would open a modal with values pre-filled
    // For now we just show a message or basic prompt
    alert("Edit feature: You would usually see a form here pre-filled with medicine data.");
}
