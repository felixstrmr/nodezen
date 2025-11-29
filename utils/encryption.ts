import { env } from "@/lib/env";

export async function encrypt(text: string) {
  const secret = env.ENCRYPTION_KEY;

  const encoder = new TextEncoder();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    encoder.encode(text)
  );

  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return Buffer.from(combined).toString("base64");
}

export async function decrypt(encryptedData: string) {
  const secret = env.ENCRYPTION_KEY;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const combined = new Uint8Array(Buffer.from(encryptedData, "base64"));

  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    encrypted
  );

  return decoder.decode(decryptedData);
}
