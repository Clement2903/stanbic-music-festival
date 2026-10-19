CREATE DATABASE IF NOT EXISTS campus_crud;
USE campus_crud;

CREATE TABLE IF NOT EXISTS lineup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    festival_name VARCHAR(150) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    performance_time VARCHAR(100) NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
('Stanbic Music Festival', 'Slapdee', 'Hip Hop', 'Main Stage', '00:15 - 01:15', 500.00);
```[cite: 5]