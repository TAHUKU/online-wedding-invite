const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File database JSON
const dataPath = path.join(__dirname, 'guests.json');

// Inisialisasi file JSON jika belum ada
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}

// Fungsi baca data
function readGuests() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

// Fungsi simpan data
function writeGuests(guests) {
  fs.writeFileSync(dataPath, JSON.stringify(guests, null, 2));
}

// API: GET semua tamu
app.get('/api/guests', (req, res) => {
  const guests = readGuests();
  res.json(guests.reverse());
});

// API: POST konfirmasi RSVP
app.post('/api/rsvp', (req, res) => {
  const guests = readGuests();
  const newGuest = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email || '',
    phone: req.body.phone || '',
    attendance: req.body.attendance,
    numberOfGuests: req.body.numberOfGuests || 1,
    message: req.body.message || '',
    createdAt: new Date().toISOString()
  };
  
  guests.push(newGuest);
  writeGuests(guests);
  res.status(201).json(newGuest);
});

// API: GET statistik
app.get('/api/stats', (req, res) => {
  const guests = readGuests();
  const total = guests.length;
  const hadir = guests.filter(g => g.attendance === 'hadir').length;
  const tidakHadir = guests.filter(g => g.attendance === 'tidak hadir').length;
  
  res.json({
    total: total,
    hadir: hadir,
    tidakHadir: tidakHadir,
    pending: total - hadir - tidakHadir
  });
});

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`✅ Data tersimpan di guests.json`);
});