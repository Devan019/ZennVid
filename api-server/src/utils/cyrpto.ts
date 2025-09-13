const te = new TextEncoder()
const td = new TextDecoder()

async function getSubtle() {
  if (typeof globalThis.crypto?.subtle !== "undefined") return globalThis.crypto.subtle
  const { webcrypto } = await import("node:crypto")
  return webcrypto.subtle
}
async function getRandomBytes(len: number) {
  if (globalThis.crypto?.getRandomValues) {
    const u = new Uint8Array(len)
    globalThis.crypto.getRandomValues(u)
    return Buffer.from(u)
  }
  const { randomBytes } = await import("node:crypto")
  return randomBytes(len)
}

async function importAesKey(secret: string) {
  const subtle = await getSubtle()
  const hashed = await subtle.digest("SHA-256", te.encode(secret))
  return subtle.importKey("raw", hashed, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}

export async function encrypt(plain: string, secret: string) {
  const subtle = await getSubtle()
  const key = await importAesKey(secret)
  const ivBuf = await getRandomBytes(12)
  const cipherBuf = await subtle.encrypt({ name: "AES-GCM", iv: ivBuf }, key, te.encode(plain))
  return { iv: ivBuf.toString("base64"), cipher: Buffer.from(cipherBuf).toString("base64") }
}

export async function decrypt(payload: { iv: string; cipher: string }, secret: string) {
  if (!payload.iv || !payload.cipher) {
    return null;
  }
  const subtle = await getSubtle()
  const key = await importAesKey(secret)
  const iv = Buffer.from(payload.iv, "base64")
  const cipher = Buffer.from(payload.cipher, "base64")
  const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv }, key, cipher)
  return td.decode(plainBuf)
}

export async function sha256Hex(text: string) {
  const subtle = await getSubtle()
  const buf = await subtle.digest("SHA-256", te.encode(text))
  return Buffer.from(buf).toString("hex")
}

export async function generateApiKey(prefix = "zen_") {
  const raw = await getRandomBytes(32)
  return prefix + raw.toString("base64url")
}
