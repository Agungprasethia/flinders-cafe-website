let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (API_BASE_URL === undefined) {
  API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';
}

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
