import { n8nClient } from "@/lib/clients/n8n-client";
import { decrypt } from "@/utils/encryption";

export async function createN8nClient(n8nUrl: string, n8nApiKey: string) {
  const decryptedApiKey = await decrypt(n8nApiKey);
  const client = new n8nClient(n8nUrl, decryptedApiKey);

  return client;
}
