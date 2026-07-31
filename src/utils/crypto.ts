// Symmetric encryption helper using native Web Crypto API (AES-GCM-256)
// Works in both Node.js and Cloudflare Workers environments.

export async function encryptText(text: string, secret: string): Promise<string> {
  if (!text) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Hash the secret to get a 256-bit key
    const secretData = encoder.encode(secret);
    const hash = await crypto.subtle.digest('SHA-256', secretData);
    
    const key = await crypto.subtle.importKey(
      'raw',
      hash,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Convert to hex
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${ivHex}:${encryptedHex}`;
  } catch (e) {
    console.error('Encryption failed:', e);
    return '';
  }
}

export async function decryptText(encryptedText: string, secret: string): Promise<string> {
  if (!encryptedText) return '';
  if (!encryptedText.includes(':')) {
    // Return original if it doesn't look like encrypted output (e.g. legacy plain keys)
    return encryptedText;
  }
  try {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    
    // Validate hex string format before parsing to prevent regex errors
    if (!/^[0-9a-fA-F]+$/.test(ivHex) || !/^[0-9a-fA-F]+$/.test(encryptedHex)) {
      return encryptedText;
    }
    
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const hash = await crypto.subtle.digest('SHA-256', secretData);
    
    const key = await crypto.subtle.importKey(
      'raw',
      hash,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error('Decryption failed:', e);
    return '';
  }
}
