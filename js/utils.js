// ============ UTILITY FUNCTIONS ============
// These are helper functions to make the code meaningful and easier to read

// 1. Show Notification (Pop-up message)
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Remove the message after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 2. Format Date (e.g., "Jan 1, 2024")
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 3. Format Money (e.g., "$10.00")
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// 4. Show Modal (Pop-up window)
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = content;
    modal.classList.add('active');

    // Close when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
}

// 5. Close Modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// 6. Confirm Action (e.g., "Are you sure?")
function confirmAction(message) {
    return confirm(message);
}
