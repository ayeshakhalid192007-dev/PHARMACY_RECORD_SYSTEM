// ============ MAIN APP ============
// This connects everything together

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Auth first (checks login status)
    initAuth();

    // 2. Initialize all other modules
    initDashboard();
    initMedicines();
    initStock();
    initSales();
    initCustomers();
    initSuppliers();
    initReports();

    // 3. Navigation Logic
    setupNavigation();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const pageId = link.getAttribute('data-page');

            // If user clicked Logout, don't navigate (handled by auth.js)
            if (pageId === 'logout') return;

            // Check if user wants to open in new tab (Ctrl/Cmd + Click or Middle Click)
            if (e.ctrlKey || e.metaKey || e.button === 1) {
                // Allow default behavior for new tab
                return;
            }

            // For regular clicks, open in new tab
            e.preventDefault();
            const currentUrl = window.location.href.split('#')[0];
            window.open(`${currentUrl}#${pageId}`, '_blank');
        });
    });

    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateTo(hash);
        }
    });

    // Check if there's a hash on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        navigateTo(hash);
    }
}

function navigateTo(pageId) {
    if (!pageId) return;

    // 1. Update Active Link in menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // 2. Show Active Section, Hide others
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const activePage = document.getElementById(`${pageId}-page`);
    if (activePage) {
        activePage.classList.add('active');
    } else {
        // Fallback to home if page not found
        document.getElementById('home-page').classList.add('active');
    }
}
