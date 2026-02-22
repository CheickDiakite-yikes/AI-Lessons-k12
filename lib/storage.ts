import { Client } from '@replit/object-storage';

const BUCKET_ID = 'replit-objstore-042823b4-40f8-4c1f-859a-8e7689424cb3';

let storageClient: Client | null = null;

function getClient(): Client {
  if (!storageClient) {
    storageClient = new Client({ bucketId: BUCKET_ID });
  }
  return storageClient;
}

export async function uploadImage(
  key: string,
  data: Buffer
): Promise<void> {
  const client = getClient();
  const result = await client.uploadFromBytes(key, data);
  if (!result.ok) {
    throw new Error(`Failed to upload image: ${result.error}`);
  }
}

export async function downloadImage(key: string): Promise<Buffer> {
  const client = getClient();
  const result = await client.downloadAsBytes(key);
  if (!result.ok) {
    throw new Error(`Failed to download image: ${result.error}`);
  }
  const [bytes] = result.value;
  return bytes;
}

export async function deleteImage(key: string): Promise<void> {
  const client = getClient();
  const result = await client.delete(key);
  if (!result.ok) {
    throw new Error(`Failed to delete image: ${result.error}`);
  }
}

export async function imageExists(key: string): Promise<boolean> {
  const client = getClient();
  const result = await client.exists(key);
  if (!result.ok) {
    return false;
  }
  return result.value;
}

export function generateImageKey(type: 'profile' | 'lesson', userId: string, identifier?: string): string {
  const timestamp = Date.now();
  const suffix = identifier ? `-${identifier}` : '';
  if (type === 'profile') {
    return `users/${userId}/profile/${timestamp}${suffix}.png`;
  }
  return `lesson-plans/${userId}/${timestamp}${suffix}.png`;
}
