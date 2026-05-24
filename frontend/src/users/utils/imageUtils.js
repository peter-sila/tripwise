export const FALLBACK_IMAGE_DATA_URL = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%23eaeaea'/><text x='50%' y='50%' font-size='24' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial, Helvetica, sans-serif'>No Image</text></svg>";

const BLOCKED_IMAGE_HOSTNAMES = ['img.tripwise.com'];

export function getSafeImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return FALLBACK_IMAGE_DATA_URL;
  }

  const normalized = url.trim();
  if (!normalized) {
    return FALLBACK_IMAGE_DATA_URL;
  }

  if (normalized.startsWith('data:')) {
    return normalized;
  }

  try {
    const parsedUrl = new URL(normalized, window.location.origin);
    if (BLOCKED_IMAGE_HOSTNAMES.includes(parsedUrl.hostname.toLowerCase())) {
      return FALLBACK_IMAGE_DATA_URL;
    }
    return normalized;
  } catch {
    return FALLBACK_IMAGE_DATA_URL;
  }
}
