const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { supabase } = require('./supabaseClient');

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

// --- MAPPING HELPERS ---

const mapMenuFromDb = (m) => {
  if (!m) return null;
  return {
    id: m.id,
    name: m.name,
    category: m.category,
    price: m.price,
    description: m.description,
    image: m.image,
    available: m.available,
    recommended: m.recommended,
    bestSeller: m.best_seller,
    createdAt: m.created_at,
  };
};

const mapMenuToDb = (body) => {
  const payload = {};
  if (body.name !== undefined || body.nama !== undefined) payload.name = body.name ?? body.nama;
  if (body.category !== undefined || body.kategori !== undefined) payload.category = body.category ?? body.kategori;
  if (body.price !== undefined || body.harga !== undefined) payload.price = toNumber(body.price ?? body.harga);
  if (body.description !== undefined || body.deskripsi !== undefined) payload.description = body.description ?? body.deskripsi;
  if (body.image !== undefined) payload.image = body.image;
  if (body.available !== undefined || body.tersedia !== undefined) payload.available = body.available ?? body.tersedia;
  if (body.recommended !== undefined || body.is_recommended !== undefined) payload.recommended = body.recommended ?? body.is_recommended;
  if (body.bestSeller !== undefined || body.best_seller !== undefined || body.is_best_seller !== undefined) {
    payload.best_seller = body.bestSeller ?? body.best_seller ?? body.is_best_seller;
  }
  return payload;
};

const mapPromoFromDb = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    discount: p.discount,
    image: p.image,
    validUntil: p.valid_until,
    active: p.active,
    items: p.items || [],
    createdAt: p.created_at,
  };
};

const mapPromoToDb = (body) => {
  const payload = {};
  if (body.title !== undefined || body.nama !== undefined) payload.title = body.title ?? body.nama;
  if (body.description !== undefined || body.deskripsi !== undefined) payload.description = body.description ?? body.deskripsi;
  if (body.discount !== undefined || body.diskon !== undefined) payload.discount = body.discount ?? body.diskon;
  if (body.image !== undefined) payload.image = body.image;
  if (body.validUntil !== undefined || body.durasi !== undefined || body.valid_until !== undefined) {
    payload.valid_until = body.validUntil ?? body.durasi ?? body.valid_until;
  }
  if (body.active !== undefined) payload.active = body.active;
  if (body.items !== undefined) payload.items = body.items;
  return payload;
};

const mapReservasiFromDb = (r) => {
  if (!r) return null;
  return {
    id: r.id,
    tanggal: r.tanggal,
    waktu: r.waktu,
    jumlahTamu: r.jumlah_tamu,
    nama: r.nama,
    whatsapp: r.whatsapp,
    email: r.email,
    catatan: r.catatan,
    status: r.status,
    createdAt: r.created_at,
  };
};

const mapReservasiToDb = (body) => {
  const payload = {};
  if (body.tanggal !== undefined) payload.tanggal = body.tanggal;
  if (body.waktu !== undefined) payload.waktu = body.waktu;
  if (body.jumlahTamu !== undefined || body.jumlah !== undefined || body.jumlah_tamu !== undefined) {
    payload.jumlah_tamu = body.jumlahTamu ?? body.jumlah ?? body.jumlah_tamu;
  }
  if (body.nama !== undefined || body.customer !== undefined) payload.nama = body.nama ?? body.customer;
  if (body.whatsapp !== undefined || body.kontak !== undefined) payload.whatsapp = body.whatsapp ?? body.kontak;
  if (body.email !== undefined) payload.email = body.email;
  if (body.catatan !== undefined) payload.catatan = body.catatan;
  if (body.status !== undefined) payload.status = body.status;
  return payload;
};

const mapOrderFromDb = (o) => {
  if (!o) return null;
  return {
    id: o.id,
    items: o.items || [],
    total: o.total,
    customerName: o.customer_name,
    status: o.status,
    createdAt: o.created_at,
  };
};

const mapOrderToDb = (body) => {
  const payload = {};
  if (body.items !== undefined) payload.items = body.items;
  if (body.total !== undefined) payload.total = body.total;
  if (body.customerName !== undefined || body.customer_name !== undefined) {
    payload.customer_name = body.customerName ?? body.customer_name;
  }
  if (body.status !== undefined) payload.status = body.status;
  return payload;
};

// --- ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin1';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (username === adminUsername && password === adminPassword) {
    return res.json({ success: true, token: 'flinders_admin_token' });
  }
  res.status(401).json({ success: false, message: 'Username atau password salah' });
});

app.get('/api/menus', async (req, res) => {
  try {
    let query = supabase.from('menus').select('*');
    const { category, search, is_recommended, is_best_seller } = req.query;

    if (category && category !== 'all' && category !== 'all menu') {
      let mappedCategory = category.trim().toLowerCase();
      if (mappedCategory === 'drink') {
        query = query.in('category', ['drink', 'kopi', 'non-kopi']);
      } else if (mappedCategory === 'food') {
        query = query.in('category', ['food', 'makanan']);
      } else if (mappedCategory === 'dessert' || mappedCategory === 'dessert & snack' || mappedCategory === 'snack') {
        query = query.in('category', ['dessert', 'dessert & snack', 'snack']);
      } else {
        query = query.ilike('category', mappedCategory);
      }
    }

    if (is_recommended !== undefined) {
      const val = is_recommended === 'true';
      query = query.eq('recommended', val);
    }

    if (is_best_seller !== undefined) {
      const val = is_best_seller === 'true';
      query = query.eq('best_seller', val);
    }

    query = query.order('created_at', { ascending: true });

    const { data: dbMenus, error } = await query;
    if (error) throw error;

    let filteredMenus = dbMenus.map(mapMenuFromDb);

    if (search) {
      const keyword = search.toLowerCase();
      filteredMenus = filteredMenus.filter((m) => 
        `${m.name || ''} ${m.description || ''}`.toLowerCase().includes(keyword)
      );
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/menus', async (req, res) => {
  try {
    const payload = {
      id: `menu-${uuidv4()}`,
      ...mapMenuToDb(req.body),
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('menus').insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(mapMenuFromDb(data));
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/menus/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menus').select('*').eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Menu tidak ditemukan' });
      }
      throw error;
    }
    res.json(mapMenuFromDb(data));
  } catch (error) {
    console.error('Error getting menu by id:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/menus/:id', async (req, res) => {
  try {
    const { data: current, error: getErr } = await supabase.from('menus').select('*').eq('id', req.params.id).single();
    if (getErr) {
      if (getErr.code === 'PGRST116') {
        return res.status(404).json({ message: 'Menu tidak ditemukan' });
      }
      throw getErr;
    }
    
    const mergedPayload = {
      ...mapMenuFromDb(current),
      ...req.body
    };
    
    const dbPayload = mapMenuToDb(mergedPayload);
    
    const { data, error } = await supabase.from('menus').update(dbPayload).eq('id', req.params.id).select().single();
    if (error) throw error;
    
    res.json(mapMenuFromDb(data));
  } catch (error) {
    console.error('Error updating menu (PUT):', error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/menus/:id', async (req, res) => {
  try {
    const dbPayload = mapMenuToDb(req.body);
    const { data, error } = await supabase.from('menus').update(dbPayload).eq('id', req.params.id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Menu tidak ditemukan' });
      }
      throw error;
    }
    res.json(mapMenuFromDb(data));
  } catch (error) {
    console.error('Error updating menu (PATCH):', error);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menus').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/promo', async (req, res) => {
  try {
    let query = supabase.from('promos').select('*');
    if (req.query.active === 'true') {
      query = query.eq('active', true);
    }
    query = query.order('created_at', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    res.json(data.map(mapPromoFromDb));
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/promo', async (req, res) => {
  try {
    const payload = {
      id: `promo-${uuidv4()}`,
      ...mapPromoToDb(req.body),
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('promos').insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(mapPromoFromDb(data));
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/promo/:id', async (req, res) => {
  try {
    const { data: current, error: getErr } = await supabase.from('promos').select('*').eq('id', req.params.id).single();
    if (getErr) {
      if (getErr.code === 'PGRST116') {
        return res.status(404).json({ message: 'Promo tidak ditemukan' });
      }
      throw getErr;
    }
    
    const mergedPayload = {
      ...mapPromoFromDb(current),
      ...req.body
    };
    
    const dbPayload = mapPromoToDb(mergedPayload);
    
    const { data, error } = await supabase.from('promos').update(dbPayload).eq('id', req.params.id).select().single();
    if (error) throw error;
    
    res.json(mapPromoFromDb(data));
  } catch (error) {
    console.error('Error updating promo:', error);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/promo/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('promos').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Promo tidak ditemukan' });
    }
    res.json({ message: 'Promo berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting promo:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/reservasi', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data.map(mapReservasiFromDb));
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/reservasi/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reservasi').select('*').eq('id', req.params.id).single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
      }
      throw error;
    }
    res.json(mapReservasiFromDb(data));
  } catch (error) {
    console.error('Error getting reservation by id:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/reservasi', async (req, res) => {
  try {
    const payload = {
      id: `res-${uuidv4()}`,
      ...mapReservasiToDb(req.body),
      status: req.body.status || 'Menunggu',
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('reservasi').insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(mapReservasiFromDb(data));
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/reservasi/:id', async (req, res) => {
  try {
    const dbPayload = mapReservasiToDb(req.body);
    const { data, error } = await supabase.from('reservasi').update(dbPayload).eq('id', req.params.id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
      }
      throw error;
    }
    res.json(mapReservasiFromDb(data));
  } catch (error) {
    console.error('Error updating reservation (PATCH):', error);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/reservasi/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reservasi').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
    }
    res.json({ message: 'Reservasi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data.map(mapOrderFromDb));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const payload = {
      id: `order-${uuidv4()}`,
      ...mapOrderToDb(req.body),
      status: 'Baru',
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('orders').insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(mapOrderFromDb(data));
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const dbPayload = mapOrderToDb(req.body);
    const { data, error } = await supabase.from('orders').update(dbPayload).eq('id', req.params.id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Order tidak ditemukan' });
      }
      throw error;
    }
    res.json(mapOrderFromDb(data));
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/halaman', async (req, res) => {
  try {
    const { data, error } = await supabase.from('halaman').select('*').eq('id', 'main').single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching page configs:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/halaman', async (req, res) => {
  try {
    const { data: current, error: getErr } = await supabase.from('halaman').select('*').eq('id', 'main').single();
    if (getErr) throw getErr;
    
    const updatedAbout = { ...(current.about || {}), ...(req.body.about || {}) };
    const updatedHero = { ...(current.hero || {}), ...(req.body.hero || {}) };
    const updatedGallery = req.body.gallery !== undefined ? req.body.gallery : current.gallery;
    
    const { data, error } = await supabase.from('halaman').update({
      about: updatedAbout,
      hero: updatedHero,
      gallery: updatedGallery,
      updated_at: new Date().toISOString()
    }).eq('id', 'main').select().single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating page configs:', error);
    res.status(500).json({ message: error.message });
  }
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
