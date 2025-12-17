// ============ REPORTS MODULE ============

function initReports() {
    // Simple Report Logic
    document.getElementById('generateStockReport').addEventListener('click', () => {
        const meds = db.getMedicines();
        const content = document.getElementById('stockReportContent');

        content.innerHTML = `
            <div style="margin-top: 10px; padding: 10px; background: #f4f4f4;">
                <strong>Total Medicines:</strong> ${meds.length}<br>
                <strong>Total Stock Value:</strong> ${formatCurrency(meds.reduce((sum, m) => sum + (m.price * m.quantity), 0))}
            </div>
        `;
    });
}
