const GUEST_APPLY_SLUGS = new Set([
  'patta-chitta',
  'patta-chitta-copy',
  'patta-transfer',
  'patta-sub-division',
  'patta-transfer-application',
  'chitta-extract-download',
  'chitta-extract-fmb-download',
  'land-subdivision-patta',
  'fmb-sketch-map'
]);

const GUEST_APPLY_SERVICE_IDS = new Set([
  '5',   // DB: Patta Chitta Copy
  '15',  // Catalog: Patta / Chitta Name Transfer Application
  '16',  // Catalog: Patta Chitta Record Search
  '17',  // Catalog: FMB Sketch Map
  '33',  // DB: A-Register & Chitta Extract Copy
  '34',  // DB: Field Measurement Book (FMB) Sketch Copy
  '52',  // DB: Patta Transfer Application
  '53'   // DB: Patta Sub-Division Application
]);

export function normalizeApplyParam(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '');
}

export function isValidStoredAuthValue(value) {
  return Boolean(value && value !== 'null' && value !== 'undefined');
}

export function hasCitizenSession(user = null, userToken = null) {
  if (user) return true;
  if (isValidStoredAuthValue(userToken)) return true;

  try {
    const lsToken = localStorage.getItem('token') || localStorage.getItem('eseva_user_token');
    const savedUser = localStorage.getItem('eseva_saved_user');
    return isValidStoredAuthValue(lsToken) || isValidStoredAuthValue(savedUser);
  } catch {
    return false;
  }
}

export function isPattaChittaIdentifier(raw) {
  if (!raw) return false;
  const norm = normalizeApplyParam(raw);
  if (!norm) return false;
  if (GUEST_APPLY_SLUGS.has(norm)) return true;
  if (GUEST_APPLY_SERVICE_IDS.has(norm)) return true;
  if (norm.includes('patta') || norm.includes('chitta')) return true;
  return false;
}

export function isPattaChittaService(service) {
  if (!service) return false;
  const idStr = String(service.id || '');
  if (idStr && GUEST_APPLY_SERVICE_IDS.has(idStr)) return true;
  if (service.slug && isPattaChittaIdentifier(service.slug)) return true;
  if (service.name && /patta|chitta/i.test(service.name)) return true;
  if (service.category_slug && (
    service.category_slug === 'land-patta-services' ||
    service.category_slug === 'land' ||
    /patta|chitta/i.test(service.category_slug)
  )) return true;
  if (service.category_name && /patta|chitta/i.test(service.category_name)) return true;
  return false;
}

export function isGuestApplyAllowedParam(serviceParam, loadedService = null) {
  if (isPattaChittaIdentifier(serviceParam)) {
    if (loadedService && !isPattaChittaService(loadedService)) {
      const norm = normalizeApplyParam(serviceParam);
      if (norm.includes('patta') || norm.includes('chitta') || GUEST_APPLY_SLUGS.has(norm)) {
        return true;
      }
      return false;
    }
    return true;
  }

  if (loadedService && isPattaChittaService(loadedService)) {
    return true;
  }

  return false;
}

export function isGuestApplyAllowedPath(pathname = '') {
  const cleanPath = String(pathname || '').trim().toLowerCase().replace(/\/+$/, '');
  const match = cleanPath.match(/^\/apply\/(?:slug\/)?([^/?#]+)/);
  if (!match) return false;

  try {
    const rawSegment = decodeURIComponent(match[1]);
    return isPattaChittaIdentifier(rawSegment);
  } catch {
    return false;
  }
}
