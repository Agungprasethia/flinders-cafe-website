/**
 * ============================================================
 *  API SERVICE LAYER — Flinders Cafe (Admin Dashboard)
 * ============================================================
 *  Semua komunikasi ke backend dipusatkan di file ini.
 *
 *  Untuk teman yang membangun backend:
 *  - BASE_URL sudah sesuai dengan localhost:3001
 *  - Pastikan route ini sesuai dengan alur_backend.md
 * ============================================================
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Helper: fetch dengan penanganan error & penyertaan token
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  // Ambil token dari localStorage jika ada (untuk auth admin)
  const token = localStorage.getItem('admin_token');
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
//  AUTH
// ============================================================

export async function login(username, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ============================================================
//  RESERVATIONS
// ============================================================

export async function getAdminReservations() {
  return apiFetch("/admin/reservations");
}

export async function addAdminReservation(data) {
  return apiFetch("/admin/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReservationStatus(id, status) {
  return apiFetch(`/admin/reservations/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ============================================================
//  MENUS
// ============================================================

export async function getAdminMenus() {
  return apiFetch("/admin/menus");
}

export async function addAdminMenu(data) {
  return apiFetch("/admin/menus", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminMenu(id, data) {
  return apiFetch(`/admin/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminMenu(id) {
  return apiFetch(`/admin/menus/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
//  PROMOS & GALLERY (Stubs)
// ============================================================

export async function getAdminPromos() {
  return apiFetch("/admin/promos");
}

export async function getAdminGallery() {
  return apiFetch("/admin/gallery");
}
