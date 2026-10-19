document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const tableBody = document.querySelector('tbody');
    
    let editingId = null;

    // Load table data on startup
    loadLineup();

    async function loadLineup() {
        try {
            const response = await fetch('/api/lineup');
            const data = await response.json();
            renderTable(data);
            
            // Check if URL has an ID parameter or hash (e.g. ?id=2 or #2) to highlight
            setTimeout(checkAndHighlightRow, 100);
        } catch (err) {
            console.error('Failed to load lineup:', err);
        }
    }

    function renderTable(records) {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        records.forEach(record => {
            const tr = document.createElement('tr');
            tr.id = `artist-row-${record.id}`; // Unique ID for direct referencing
            tr.innerHTML = `
                <td>${record.id}</td>
                <td>${record.festival_name}</td>
                <td>${record.artist_name}</td>
                <td>${record.genre}</td>
                <td>${record.stage}</td>
                <td>${record.performance_time}</td>
                <td>$${record.ticket_price}</td>
                <td>
                    <button onclick="editRecord(${record.id}, '${escapeHtml(record.festival_name)}', '${escapeHtml(record.artist_name)}', '${escapeHtml(record.genre)}', '${escapeHtml(record.stage)}', '${escapeHtml(record.performance_time)}', ${record.ticket_price})" 
                        style="background-color: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: 500;">
                        Edit
                    </button>
                    <button onclick="deleteRecord(${record.id})" 
                        style="background-color: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 500;">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function checkAndHighlightRow() {
        const urlParams = new URLSearchParams(window.location.search);
        const targetId = urlParams.get('id') || window.location.hash.replace('#', '');
        
        if (!targetId) return;

        const row = document.getElementById(`artist-row-${targetId}`);
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Apply blinking / highlighting effect matching your page theme
            row.style.transition = 'background-color 0.3s ease';
            let flashes = 0;
            const flashInterval = setInterval(() => {
                row.style.backgroundColor = flashes % 2 === 0 ? '#3b82f6' : ''; // Blue flash
                flashes++;
                if (flashes > 5) {
                    clearInterval(flashInterval);
                    row.style.backgroundColor = '#1e3a8a'; // Final subtle highlight
                }
            }, 3000 / 6);
        }
    }

    // Handle Form Submit for Create (POST) or Update (PUT)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const inputs = form.querySelectorAll('input');
            const payload = {
                festival_name: inputs[0] ? inputs[0].value : '',
                artist_name: inputs[1] ? inputs[1].value : '',
                genre: inputs[2] ? inputs[2].value : '',
                stage: inputs[3] ? inputs[3].value : '',
                performance_time: inputs[4] ? inputs[4].value : '',
                ticket_price: inputs[5] ? inputs[5].value : 0
            };

            try {
                let url = '/api/lineup';
                let method = 'POST';

                if (editingId) {
                    url = `/api/lineup/${editingId}`;
                    method = 'PUT';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    form.reset();
                    editingId = null;
                    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
                    if (submitBtn) submitBtn.textContent = 'Add Artist';
                    loadLineup();
                } else {
                    alert('Operation failed');
                }
            } catch (err) {
                console.error('Error saving record:', err);
            }
        });
    }

    window.editRecord = function(id, festival, artist, genre, stage, time, price) {
        editingId = id;
        const inputs = form.querySelectorAll('input');
        if (inputs[0]) inputs[0].value = festival;
        if (inputs[1]) inputs[1].value = artist;
        if (inputs[2]) inputs[2].value = genre;
        if (inputs[3]) inputs[3].value = stage;
        if (inputs[4]) inputs[4].value = time;
        if (inputs[5]) inputs[5].value = price;

        const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
        if (submitBtn) submitBtn.textContent = 'Update Artist';
        form.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteRecord = async function(id) {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            const response = await fetch(`/api/lineup/${id}`, { method: 'DELETE' });
            if (response.ok) {
                loadLineup();
            } else {
                alert('Delete failed');
            }
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    };

    function escapeHtml(str) {
        return String(str).replace(/'/g, "\\'");
    }
});