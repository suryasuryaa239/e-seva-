const GUEST_APPLY_SLUGS = new Set([
  'patta-chitta',
  'patta-chitta-copy'
]);

const PATTA_CHITTA_SERVICE_ID = '5';

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

export function isGuestApplyAllowedParam(serviceParam, loadedService = null) {
  const normParam = normalizeApplyParam(serviceParam);
  const normLoadedSlug = normalizeApplyParam(loadedService?.slug);

  if (GUEST_APPLY_SLUGS.has(normLoadedSlug)) {
    return true;
  }

  if (GUEST_APPLY_SLUGS.has(normParam)) {
    if (normLoadedSlug && !GUEST_APPLY_SLUGS.has(normLoadedSlug)) {
      return false;
    }
    return true;
  }

  // DB service ID 5 is Patta Chitta Copy; verify loaded service identity before allowing guest apply
  if (normParam === PATTA_CHITTA_SERVICE_ID && loadedService) {
    return Number(loadedService.id) === 5 && /patta\s*chitta/i.test(loadedService.name || '');
  }

  return false;
}

export function isGuestApplyAllowedPath(pathname = '') {
  const cleanPath = String(pathname || '').trim().toLowerCase().replace(/\/+$/, '');
  const match = cleanPath.match(/^\/apply\/(?:slug\/)?([^/]+)$/);
  if (!match) return false;

  try {
    const rawSegment = decodeURIComponent(match[1]);
    const normSegment = normalizeApplyParam(rawSegment);
    return GUEST_APPLY_SLUGS.has(normSegment) || normSegment === PATTA_CHITTA_SERVICE_ID;
  } catch {
    return false;
  }
}

