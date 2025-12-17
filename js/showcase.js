// ============ MEDICINES SHOWCASE ============
// Display 5 random medicines on the home page with images

// Sample medicines data with categories and images
const sampleMedicines = [
    {
        name: 'Paracetamol',
        category: 'Tablet',
        image: 'images/medicines/paracetamol.png',
        price: '$5.99',
        description: 'Effective pain relief and fever reducer',
        dosage: '500mg',
        uses: 'Headache, fever, body aches'
    },
    {
        name: 'Amoxicillin',
        category: 'Capsule',
        image: 'images/medicines/amoxicillin.png',
        price: '$12.50',
        description: 'Broad-spectrum antibiotic for bacterial infections',
        dosage: '250mg',
        uses: 'Bacterial infections, respiratory issues'
    },
    {
        name: 'Ibuprofen',
        category: 'Tablet',
        image: 'images/medicines/ibuprofen.png',
        price: '$7.25',
        description: 'Anti-inflammatory and pain relief medication',
        dosage: '400mg',
        uses: 'Inflammation, pain, arthritis'
    },
    {
        name: 'Cough Syrup',
        category: 'Syrup',
        image: 'images/medicines/cough_syrup.png',
        price: '$8.99',
        description: 'Soothing relief from cough and cold symptoms',
        dosage: '100ml',
        uses: 'Cough, cold, throat irritation'
    },
    {
        name: 'Vitamin C',
        category: 'Tablet',
        image: 'images/medicines/vitamin_c.png',
        price: '$6.50',
        description: 'Essential vitamin for immune system support',
        dosage: '1000mg',
        uses: 'Immunity boost, antioxidant'
    },
    {
        name: 'Aspirin',
        category: 'Tablet',
        image: 'images/medicines/aspirin.png',
        price: '$4.99',
        description: 'Pain reliever and blood thinner',
        dosage: '75mg',
        uses: 'Pain relief, heart health'
    },
    {
        name: 'Cetirizine',
        category: 'Tablet',
        image: 'images/medicines/aspirin.png',
        price: '$6.99',
        description: 'Allergy relief medication',
        dosage: '10mg',
        uses: 'Allergies, Hay fever'
    },
    {
        name: 'Omeprazole',
        category: 'Capsule',
        image: 'images/medicines/amoxicillin.png',
        price: '$11.25',
        description: 'Acid reflux treatment',
        dosage: '20mg',
        uses: 'Heartburn, Acid reflux'
    },
    {
        name: 'Calcium + D3',
        category: 'Supplement',
        image: 'images/medicines/vitamin_c.png',
        price: '$9.50',
        description: 'Bone health supplement',
        dosage: '500mg',
        uses: 'Bone strength, Calcium deficiency'
    }
];

// Function to get random medicines (increased to 9 to show all)
function getRandomMedicines() {
    // Shuffle array
    const shuffled = [...sampleMedicines].sort(() => 0.5 - Math.random());
    // Return first 9 items (or all if less than 9)
    return shuffled.slice(0, 9);
}

// Function to create medicine card HTML
function createMedicineCard(medicine) {
    return `
        <div class="medicine-card">
            <div class="medicine-image-container">
                <img src="${medicine.image}" alt="${medicine.name}" class="medicine-image">
            </div>
            <div class="medicine-content">
                <h3>${medicine.name}</h3>
                <span class="medicine-category">${medicine.category}</span>
                <div class="medicine-info">
                    <p class="medicine-description">${medicine.description}</p>
                    <div class="medicine-details">
                        <p><strong>Dosage:</strong> ${medicine.dosage}</p>
                        <p><strong>Uses:</strong> ${medicine.uses}</p>
                    </div>
                </div>
                <div class="medicine-footer">
                    <div class="medicine-price">${medicine.price}</div>
                    <button class="btn-add-to-cart" onclick='addToCart(${JSON.stringify(medicine).replace(/'/g, "&apos;")})'>
                        <span class="cart-icon">🛒</span> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to display medicines showcase
function displayMedicinesShowcase() {
    const showcaseContainer = document.getElementById('medicinesShowcase');

    if (!showcaseContainer) return;

    // Get 5 random medicines
    const randomMedicines = getRandomMedicines(5);

    // Create HTML for all medicine cards
    const medicinesHTML = randomMedicines.map(medicine => createMedicineCard(medicine)).join('');

    // Display the medicines
    showcaseContainer.innerHTML = medicinesHTML;
}

// Initialize medicines showcase when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayMedicinesShowcase);
} else {
    displayMedicinesShowcase();
}
