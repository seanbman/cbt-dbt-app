const encoder = new TextEncoder();
const decoder = new TextDecoder();
const keyName = 'steadyStepsDeviceKey.v1';

const base64UrlFromBytes = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

const bytesFromBase64Url = (value) => {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

async function getDeviceKey() {
  let encoded = localStorage.getItem(keyName);

  if (!encoded) {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    encoded = base64UrlFromBytes(raw);
    localStorage.setItem(keyName, encoded);
  }

  return crypto.subtle.importKey('raw', bytesFromBase64Url(encoded), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function writeEncryptedCookie(name, value, maxAgeDays = 30) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Encrypted saving requires browser crypto support.');
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getDeviceKey();
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(value)));
  const payload = `${base64UrlFromBytes(iv)}.${base64UrlFromBytes(new Uint8Array(encrypted))}`;
  const maxAge = maxAgeDays * 24 * 60 * 60;

  if (payload.length > 3600) {
    throw new Error('This draft is too large for a cookie. Shorten the answers or print/copy them before leaving.');
  }

  document.cookie = `${encodeURIComponent(name)}=${payload}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  return payload;
}

export async function readEncryptedCookie(name) {
  if (!globalThis.crypto?.subtle) return null;

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${encodeURIComponent(name)}=`));

  if (!cookie) return null;

  const payload = cookie.slice(cookie.indexOf('=') + 1);
  const [iv, encrypted] = payload.split('.');

  if (!iv || !encrypted) return null;

  try {
    const key = await getDeviceKey();
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytesFromBase64Url(iv) }, key, bytesFromBase64Url(encrypted));
    return JSON.parse(decoder.decode(decrypted));
  } catch {
    return null;
  }
}

export function clearCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
}
