/**
 * Image upload via Appwrite Storage
 */
import { Client, Storage, ID } from 'appwrite';

let storageClient: Storage | null = null;

function getStorage(): Storage {
  if (storageClient) return storageClient;
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const project = import.meta.env.VITE_APPWRITE_PROJECT;
  const client = new Client().setEndpoint(endpoint).setProject(project);
  storageClient = new Storage(client);
  return storageClient;
}

const BUCKET_ID = 'images';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const storage = getStorage();
    const result = await storage.createFile(BUCKET_ID, ID.unique(), file);
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const project = import.meta.env.VITE_APPWRITE_PROJECT;
    return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${result.$id}/view?project=${project}`;
  } catch (e: any) {
    console.error('Upload error:', e);
    return null;
  }
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file);
    if (url) urls.push(url);
  }
  return urls;
}
