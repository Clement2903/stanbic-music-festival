const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve your sibling frontend folder so index.html loads at the root URL
app.use(express.static(path.join(__dirname, '../frontend')));

// Auto-initialize table and sample records on startup
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lineup (
                id SERIAL PRIMARY KEY,
                festival_name VARCHAR(150) NOT NULL,
                artist_name VARCHAR(255) NOT NULL,
                genre VARCHAR(100) NOT NULL,
                stage VARCHAR(100) NOT NULL,
                performance_time VARCHAR(100) NOT NULL,
                ticket_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const res = await pool.query('SELECT COUNT(*) as count FROM lineup');
        if (parseInt(res.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO lineup (festival_name, artist_name, genre, stage, performance_time, ticket_price) VALUES
                ('Stanbic Music Festival', 'Yo Maps', 'Afro-Pop', 'Main Stage', '18:00 - 19:00', 500.00),
                ('Stanbic Music Festival', 'Ami Faku', 'Soul / Afro-Fusion', 'Main Stage', '19:15 - 20:15', 500.00),
                ('Stanbic Music Festival', 'Sun-El Musician', 'Amapiano / House', 'Electronic Stage', '20:30 - 21:30', 500.00),
                ('Stanbic Music Festival', 'Pompi', 'Gospel / Afro-Rock', 'Main Stage', '16:30 - 17:30', 500.00),
                ('Stanbic Music Festival', 'Mampi', 'Dancehall', 'Vibes Stage', '17:00 - 18:00', 500.00),
                ('Stanbic Music Festival', 'Chef 187', 'Hip Hop', 'Main Stage', '21:45 - 22:45', 500.00),
                ('Stanbic Music Festival', 'James Sakala', 'Afro-Jazz', 'Acoustic Stage', '15:00 - 16:00', 500.00),
                ('Stanbic Music Festival', 'Towela Kaira', 'R&B / Pop', 'Vibes Stage', '18:30 - 19:30', 500.00),
                ('Stanbic Music Festival', 'Macky 2', 'Hip Hop', 'Main Stage', '23:00 - 00:00', 500.00),
                ('Stanbic Music Festival', 'Slapdee', 'Hip Hop', 'Main Stage', '00:15 - 01:15', 500.00)
            `);
            console.log('Sample artists seeded into Supabase!');
        }
    } catch (err) {
        console.error('Database init error:', err.message);
    }
}

initDB();

app.get('/api/lineup', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lineup ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/lineup/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lineup WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/lineup', async (req, res) => {
    const { festival_name, artist_name, genre, stage, performance_time, ticket_price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lineup (festival_name, artist_name, genre, stage, performance_time, ticket_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [festival_name, artist_name, genre, stage, performance_time, ticket_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/lineup/:id', async (req, res) => {
    const { festival_name, artist_name, genre, stage, performance_time, ticket_price } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lineup SET festival_name = $1, artist_name = $2, genre = $3, stage = $4, performance_time = $5, ticket_price = $6 WHERE id = $7 RETURNING *',
            [festival_name, artist_name, genre, stage, performance_time, ticket_price, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Record updated successfully', updated: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/lineup/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM lineup WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});