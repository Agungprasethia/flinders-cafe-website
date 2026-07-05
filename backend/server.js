const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { readDB, writeDB } = require('./dataStore');

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const toNumber = (value) => {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
};

const normalizeMenuPayload = (body, previous = {}) => ({
  ...previous,
  name: body.name ?? body.nama ?? previous.name ?? '',
  category: body.category ?? body.kategori ?? previous.category ?? 'food',
  price: body.price !== undefined || body.harga !== undefined ? toNumber(body.price ?? body.harga) : previous.price ?? 0,
  description: body.description ?? body.deskripsi ?? previous.description ?? '',
  image: body.image ?? previous.image ?? null,
  available: body.available ?? body.tersedia ?? previous.available ?? true,
  recommended: body.recommended ?? body.is_recommended ?? previous.recommended ?? false,
  bestSeller: body.bestSeller ?? body.is_best_seller ?? previous.bestSeller ?? false,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  if (username === db.admin.username && password === db.admin.password) {
    return res.json({ success: true, token: 'flinders_admin_token' });
  }
  res.status(401).json({ success: false, message: 'Username atau password salah' });
});

app.get('/api/menus', (req, res) => {
  const db = readDB();
  let menus = [...db.menu];
  const { category, search, is_recommended, is_best_seller } = req.query;

  if (category && category !== 'all' && category !== 'all menu') {
    menus = menus.filter((m) => (m.category || '').toLowerCase().trim() === category.toLowerCase().trim());
  }

  if (search) {
    const keyword = search.toLowerCase();
    menus = menus.filter((m) => `${m.name || ''} ${m.description || ''}`.toLowerCase().includes(keyword));
  }

  if (is_recommended !== undefined) {
    const val = is_recommended === 'true';
    menus = menus.filter((m) => Boolean(m.is_recommended ?? m.recommended) === val);
  }

  if (is_best_seller !== undefined) {
    const val = is_best_seller === 'true';
    menus = menus.filter((m) => Boolean(m.is_best_seller ?? m.bestSeller) === val);
  }

  res.json(menus);
});

app.post('/api/menus', (req, res) => {
  const db = readDB();
  const menu = {
    id: `menu-${uuidv4()}`,
    ...normalizeMenuPayload(req.body),
    createdAt: new Date().toISOString(),
  };
  db.menu.push(menu);
  writeDB(db);
  res.status(201).json(menu);
});

app.get('/api/menus/:id', (req, res) => {
  const db = readDB();
  const menu = db.menu.find((m) => m.id == req.params.id);
  if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
  res.json(menu);
});

app.put('/api/menus/:id', (req, res) => {
  const db = readDB();
  const idx = db.menu.findIndex((m) => m.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Menu tidak ditemukan' });
  db.menu[idx] = { ...normalizeMenuPayload(req.body, db.menu[idx]), id: db.menu[idx].id };
  writeDB(db);
  res.json(db.menu[idx]);
});

app.patch('/api/menus/:id', (req, res) => {
  const db = readDB();
  const idx = db.menu.findIndex((m) => m.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Menu tidak ditemukan' });
  db.menu[idx] = { ...db.menu[idx], ...req.body };
  writeDB(db);
  res.json(db.menu[idx]);
});

app.delete('/api/menus/:id', (req, res) => {
  const db = readDB();
  const idx = db.menu.findIndex((m) => m.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Menu tidak ditemukan' });
  db.menu.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Menu berhasil dihapus' });
});

app.get('/api/promo', (req, res) => {
  const db = readDB();
  res.json(db.promo);
});

app.post('/api/promo', (req, res) => {
  const db = readDB();
  const item = { id: `promo-${uuidv4()}`, ...req.body, createdAt: new Date().toISOString() };
  db.promo.push(item);
  writeDB(db);
  res.status(201).json(item);
});

app.put('/api/promo/:id', (req, res) => {
  const db = readDB();
  const idx = db.promo.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Promo tidak ditemukan' });
  db.promo[idx] = { ...db.promo[idx], ...req.body };
  writeDB(db);
  res.json(db.promo[idx]);
});

app.delete('/api/promo/:id', (req, res) => {
  const db = readDB();
  const idx = db.promo.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Promo tidak ditemukan' });
  db.promo.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Promo berhasil dihapus' });
});

app.get('/api/reservasi', (req, res) => {
  const db = readDB();
  const sorted = [...db.reservasi].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.get('/api/reservasi/:id', (req, res) => {
  const db = readDB();
  const item = db.reservasi.find((r) => r.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
  res.json(item);
});

app.post('/api/reservasi', (req, res) => {
  const db = readDB();
  const item = {
    id: `res-${uuidv4()}`,
    ...req.body,
    status: req.body.status || 'Menunggu',
    createdAt: new Date().toISOString(),
  };
  db.reservasi.push(item);
  writeDB(db);
  res.status(201).json(item);
});

app.patch('/api/reservasi/:id', (req, res) => {
  const db = readDB();
  const idx = db.reservasi.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
  db.reservasi[idx] = { ...db.reservasi[idx], ...req.body };
  writeDB(db);
  res.json(db.reservasi[idx]);
});

app.delete('/api/reservasi/:id', (req, res) => {
  const db = readDB();
  const idx = db.reservasi.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
  db.reservasi.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Reservasi berhasil dihapus' });
});

app.get('/api/orders', (req, res) => {
  const db = readDB();
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post('/api/orders', (req, res) => {
  const db = readDB();
  const order = {
    id: `order-${uuidv4()}`,
    ...req.body,
    status: 'Baru',
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  writeDB(db);
  res.status(201).json(order);
});

app.patch('/api/orders/:id', (req, res) => {
  const db = readDB();
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order tidak ditemukan' });
  db.orders[idx] = { ...db.orders[idx], ...req.body };
  writeDB(db);
  res.json(db.orders[idx]);
});

app.get('/api/halaman', (req, res) => {
  const db = readDB();
  res.json(db.halaman);
});

app.put('/api/halaman', (req, res) => {
  const db = readDB();
  db.halaman = { ...db.halaman, ...req.body };
  writeDB(db);
  res.json(db.halaman);
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Tidak ada file yang diupload' });
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Flinders Cafe Backend running at http://localhost:${PORT}`);
  console.log(`Admin login: ${process.env.ADMIN_USERNAME || 'admin1'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
});
