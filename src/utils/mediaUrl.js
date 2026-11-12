// Shared API base & media URL helper (avoids circular imports with main.jsx)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://e-seva-portal-iyau.onrender.com' : '');

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (API_BASE_URL && (trimmed.startsWith('/api/') || trimmed.startsWith('/uploads/'))) {
    return `${API_BASE_URL}${trimmed}`;
  }
  return trimmed;
}
