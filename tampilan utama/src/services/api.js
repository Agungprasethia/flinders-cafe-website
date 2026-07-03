/**
 * ============================================================
 *  API SERVICE LAYER — Flinders Cafe
 * ============================================================
 *  Semua komunikasi ke backend dipusatkan di file ini.
 *
 *  Untuk teman yang membangun backend:
 *  - BASE_URL sudah sesuai dengan localhost:3001
 *  - Setiap fungsi mengembalikan data atau melempar error
 *  - Kalau backend belum aktif, komponen akan pakai data dummy
 * ============================================================
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
export const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || "6281234567890";

// Helper: fetch dengan penanganan error
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
//  MENU
// ============================================================

/**
 * Ambil daftar menu dari backend.
 * @param {Object} params
 * @param {string} [params.category]   - Filter kategori (food, drink, dll)
 * @param {string} [params.search]     - Kata kunci pencarian
 * @param {boolean} [params.is_recommended]
 * @param {boolean} [params.is_best_seller]
 * GET /api/menus
 */
export async function getMenus({ category, search, is_recommended, is_best_seller } = {}) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (search) query.set("search", search);
  if (is_recommended !== undefined) query.set("is_recommended", is_recommended);
  if (is_best_seller !== undefined) query.set("is_best_seller", is_best_seller);

  const qs = query.toString();
  return apiFetch(`/menus${qs ? `?${qs}` : ""}`);
}

/**
 * Ambil detail satu menu.
 * GET /api/menus/:id
 */
export async function getMenuDetail(id) {
  return apiFetch(`/menus/${id}`);
}

/**
 * Ambil daftar kategori menu.
 * GET /api/menu-categories
 */
export async function getMenuCategories() {
  return apiFetch("/menu-categories");
}

// ============================================================
//  PROMO
// ============================================================

/**
 * Ambil promo yang sedang aktif.
 * GET /api/promos?active=true
 */
export async function getPromos() {
  return apiFetch("/promos?active=true");
}

/**
 * Ambil detail satu promo.
 * GET /api/promos/:id
 */
export async function getPromoDetail(id) {
  return apiFetch(`/promos/${id}`);
}

// ============================================================
//  GALLERY
// ============================================================

/**
 * Ambil daftar gambar gallery.
 * GET /api/gallery
 */
export async function getGallery() {
  return apiFetch("/gallery");
}

// ============================================================
//  RESERVASI
// ============================================================

/**
 * Cek ketersediaan tanggal dalam satu bulan.
 * GET /api/reservations/availability?month=7&year=2026
 *
 * Expected response:
 * [{ date: "2026-07-03", status: "tersedia" | "penuh" | "tutup" }]
 */
export async function checkAvailability(month, year) {
  return apiFetch(`/reservations/availability?month=${month + 1}&year=${year}`);
}

/**
 * Cek slot waktu yang tersedia pada tanggal tertentu.
 * GET /api/reservations/time-slots?date=2026-07-05
 *
 * Expected response:
 * [{ time: "10:00", available: true }, { time: "13:00", available: false }, ...]
 */
export async function getTimeSlots(date) {
  return apiFetch(`/reservations/time-slots?date=${date}`);
}

/**
 * Kirim data reservasi baru.
 * POST /api/reservations
 *
 * Request body:
 * { tanggal, waktu, jumlah_tamu, nama, phone, email, catatan }
 *
 * Expected response:
 * { id, message: "Reservasi berhasil!" }
 */
export async function submitReservation(data) {
  return apiFetch("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
//  ORDER (KERANJANG)
// ============================================================

/**
 * Kirim data order dari keranjang.
 * POST /api/orders
 *
 * Request body:
 * { nama_customer, nomor_meja, items: [{ menu_id, quantity }] }
 *
 * Expected response:
 * { order_id, subtotal, pajak, total, wa_url }
 */
export async function submitOrder(data) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================================
//  PAGE SETTINGS (konten halaman yang bisa diedit admin)
// ============================================================

/**
 * Ambil pengaturan halaman (hero text, about text, dll).
 * GET /api/page-settings
 *
 * Expected response:
 * [{ key: "hero_title", value: "..." }, ...]
 */
export async function getPageSettings() {
  return apiFetch("/page-settings");
}
