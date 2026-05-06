// convert text to binary and back
const te = new TextEncoder();
const td = new TextDecoder();

/**
 * HELPER: Turns a standard string secret into a 256-bit AES cryptographic key.
 */
async function getAesKey(secret: string) {
  // 1. Hash the secret to ensure it is exactly 256 bits long
  const hashed = await crypto.subtle.digest("SHA-256", te.encode(secret));
  // 2. Tell the crypto engine to use this hash as an AES-GCM key
  return crypto.subtle.importKey("raw", hashed, "AES-GCM", false, ["encrypt", "decrypt"]);
}

/**
 * ENCRYPT: Turns plain text into unreadable cipher text.
 */
export async function encrypt(plain: string, secret: string) {
  const key = await getAesKey(secret);
  
  // AES-GCM requires a random 12-byte Initialization Vector (IV) for every encryption
  const ivBuf = crypto.getRandomValues(new Uint8Array(12)); 
  
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuf }, 
    key, 
    te.encode(plain)
  );

  return { 
    iv: Buffer.from(ivBuf).toString("base64"), 
    cipher: Buffer.from(cipherBuf).toString("base64") 
  };
}

/**
 * DECRYPT: Turns cipher text back into plain text.
 */
export async function decrypt(payload: { iv: string; cipher: string }, secret: string) {
  if (!payload?.iv || !payload?.cipher) return null;

  const key = await getAesKey(secret);
  const ivBuf = Buffer.from(payload.iv, "base64");
  const cipherBuf = Buffer.from(payload.cipher, "base64");

  try {
    // If the data was tampered with, or the secret is wrong, this will throw an error.
    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBuf }, 
      key, 
      cipherBuf
    );
    return td.decode(plainBuf);
  } catch (error) {
    console.error("Decryption failed! Data tampered or wrong secret.");
    return null; 
  }
}

/**
 * HASH: Creates a fast, one-way SHA-256 hash (Great for Refresh Tokens!)
 */
export async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", te.encode(text));
  return Buffer.from(buf).toString("hex");
}

/**
 * API KEY GEN: Creates a massive random string (e.g., zen_aB3x9...)
 */
export function generateApiKey(prefix = "zen_") {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  return prefix + Buffer.from(raw).toString("base64url");
}