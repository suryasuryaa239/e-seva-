import { useState, useEffect } from 'react';

let cachedServices = null;
let fetchPromise = null;

// Allow cache invalidation when admin updates a service
export function invalidateServicesCache() {
  cachedServices = null;
  fetchPromise = null;
}

export function useLiveServices() {
  const [servicesMap, setServicesMap] = useState(() => {
    if (cachedServices && Array.isArray(cachedServices)) {
      const map = {};
      cachedServices.forEach(s => {
        if (s.slug) map[s.slug] = s;
        if (s.id) map[String(s.id)] = s;
      });
      return map;
    }
    return {};
  });

  useEffect(() => {
    if (!fetchPromise) {
      fetchPromise = fetch('/api/services')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          cachedServices = data;
          return data;
        })
        .catch(() => []);
    }

    fetchPromise.then(data => {
      if (Array.isArray(data)) {
        const map = {};
        data.forEach(s => {
          if (s.slug) map[s.slug] = s;
          if (s.id) map[String(s.id)] = s;
        });
        setServicesMap(map);
      }
    });
  }, []);

  const getServiceFeeText = (slugOrId, fallbackText, lang = 'en') => {
    const srv = servicesMap[slugOrId];
    if (srv && srv.fee !== undefined) {
      const feeNum = Number(srv.fee);
      if (feeNum === 0) {
        return lang === 'ta' ? '₹0 (இலவச சேவை)' : '₹0 (Free Govt Service)';
      }
      return `₹${feeNum}`;
    }
    return fallbackText;
  };

  const getServiceFeeValue = (slugOrId, defaultFee = 60) => {
    const srv = servicesMap[slugOrId];
    if (srv && srv.fee !== undefined) {
      return Number(srv.fee);
    }
    return defaultFee;
  };

  return { servicesMap, getServiceFeeText, getServiceFeeValue };
}
