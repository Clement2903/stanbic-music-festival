// Change this to your live Render cloud URL when deployed, keep localhost for local testing
const API_URL = 'http://localhost:3000/api/lineup';

document.addEventListener('DOMContentLoaded', () => {
    loadLineup();

    const form = document.getElementById('lineup-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function loadLineup() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const tableBody = document.getElementById('lineup-table-body');
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
                <td>ZMW ${item.ticket_price}</td>
                <td>
                    <button onclick="editRecord(${item.id}, '${item.festival_name}', '${item.artist_name}', '${item.genre}', '${item.stage}', '${item.performance_time}', ${item.ticket_price})">Edit</button>
                    <button onclick="deleteRecord(${item.id})" style="background: red; color: white;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading lineup:', err);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('record-id').value;
    const festival_name = document.getElementById('festival_name').value;
    const artist_name = document.getElementById('artist_name').value;
    const genre = document.getElementById('genre').value;
    const stage = document.getElementById('stage').value;
    const performance_time = document.getElementById('performance_time').value;
    const ticket_price = parseFloat(document.getElementById('ticket_price').value);

    const payload = { festival_name, artist_name, genre, stage, performance_time, ticket_price };

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        document.getElementById('lineup-form').reset();
        document.getElementById('record-id').value = '';
        loadLineup();
    } catch (err) {
        console.error('Error saving record:', err);
    }
}

function editRecord(id, festival_name, artist_name, genre, stage, performance_time, ticket_price) {
    document.getElementById('record-id').value = id;
    document.getElementById('festival_name').value = festival_name;
    document.getElementById('artist_name').value = artist_name;
    document.getElementById('genre').value = genre;
    document.getElementById('stage').value = stage;
    document.getElementById('performance_time').value = performance_time;
    document.getElementById('ticket_price').value = ticket_price;
}

async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this artist?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadLineup();
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    }
}