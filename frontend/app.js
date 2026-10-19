document.addEventListener('DOMContentLoaded', () => {
    fetchLineup();
});

async function fetchLineup() {
    try {
        const response = await fetch('/api/lineup');
        const data = await response.json();
        
        const tableBody = document.querySelector('tbody') || document.getElementById('lineup-table-body'); // Update selector to match your HTML table body
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.festival_name}</td>
                <td>${item.artist_name}</td>
                <td>${item.genre}</td>
                <td>${item.stage}</td>
                <td>${item.performance_time}</td>
                <td>$${item.ticket_price}</td>
                <td>
                    <!-- Your edit/delete buttons -->
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading lineup:', err);
    }
}