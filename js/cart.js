// ============ SHOPPING CART MODULE ============
// Handles cart functionality and bill generation

// Cart data structure
let cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
};

// Add item to cart
function addToCart(medicine) {
    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.id === medicine.name.toLowerCase().replace(/\s+/g, '_'));

    if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += 1;
        showNotification('Quantity updated in cart!', 'success');
    } else {
        // Add new item to cart
        const cartItem = {
            id: medicine.name.toLowerCase().replace(/\s+/g, '_'),
            name: medicine.name,
            category: medicine.category,
            price: parseFloat(medicine.price.replace('$', '')),
            quantity: 1,
            image: medicine.image,
            dosage: medicine.dosage
        };
        cart.items.push(cartItem);
        showNotification(`${medicine.name} added to cart!`, 'success');
    }

    updateCartTotals();
    updateCartBadge();
    saveCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart.items = cart.items.filter(item => item.id !== itemId);
    updateCartTotals();
    updateCartBadge();
    saveCart();
    renderCart();
    showNotification('Item removed from cart', 'success');
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            updateCartTotals();
            saveCart();
            renderCart();
        }
    }
}

// Calculate cart totals
function updateCartTotals() {
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = cart.subtotal * 0.10; // 10% tax
    cart.total = cart.subtotal + cart.tax;
}

// Update cart badge count
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('pharmacyCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('pharmacyCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Clear cart
function clearCart() {
    cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
    };
    saveCart();
    updateCartBadge();
    renderCart();
    showNotification('Cart cleared', 'success');
}

// Generate invoice number
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}-${random}`;
}

// Render cart modal
function renderCart() {
    const cartModal = document.getElementById('cartModal');
    const cartContent = document.getElementById('cartContent');

    if (!cartContent) return;

    if (cart.items.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some medicines to get started!</p>
            </div>
        `;
        return;
    }

    const cartHTML = `
        <div class="cart-items">
            ${cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-category">${item.category} - ${item.dosage}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        <p>$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="btn-remove" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${cart.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${cart.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${cart.total.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="cart-actions">
            <button class="btn btn-secondary" onclick="clearCart()">Clear Cart</button>
            <button class="btn btn-primary" onclick="generateBill()">Generate Bill</button>
        </div>
    `;

    cartContent.innerHTML = cartHTML;
}

// Generate and display bill
function generateBill() {
    if (cart.items.length === 0) {
        showNotification('Cart is empty!', 'error');
        return;
    }

    const invoiceNumber = generateInvoiceNumber();
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const billHTML = `
        <div class="bill-container">
            <div class="bill-header">
                <div class="bill-logo">
                    <div class="logo-icon">💊</div>
                    <h2>PharmaCare</h2>
                </div>
                <div class="bill-info">
                    <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Time:</strong> ${timeStr}</p>
                </div>
            </div>
            
            <div class="bill-customer">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> Walk-in Customer</p>
                <p><strong>Type:</strong> Retail Purchase</p>
            </div>
            
            <div class="bill-items">
                <table class="bill-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Dosage</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.dosage}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="bill-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${cart.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (10%):</span>
                    <span>$${cart.tax.toFixed(2)}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Grand Total:</span>
                    <span>$${cart.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="bill-footer">
                <p class="payment-status">Payment Status: <span class="status-pending">PENDING</span></p>
                <p class="bill-note">Thank you for choosing PharmaCare!</p>
                <p class="bill-note-small">This is a computer-generated invoice.</p>
            </div>
            
            <div class="bill-actions">
                <button class="btn btn-secondary" onclick="closeBill()">Close</button>
                <button class="btn btn-primary" onclick="window.print()">Print Bill</button>
            </div>
        </div>
    `;

    const billModal = document.getElementById('billModal');
    const billContent = document.getElementById('billContent');

    if (billContent) {
        billContent.innerHTML = billHTML;
    }

    if (billModal) {
        billModal.classList.add('active');
    }
}

// Close bill modal
function closeBill() {
    const billModal = document.getElementById('billModal');
    if (billModal) {
        billModal.classList.remove('active');
    }
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        if (cartModal.classList.contains('active')) {
            renderCart();
        }
    }
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
