const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Gagal menghubungi server');
  }

  return response.json();
}
