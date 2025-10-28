import { BlobServiceClient } from '@azure/storage-blob';

const containerName = process.env.BLOB_CONTAINER || 'meeting-files';
const connStr = process.env.AZURE_BLOB_CONN;

if (!connStr || !connStr.startsWith("DefaultEndpointsProtocol")) {
  console.error("Missing or invalid AZURE_BLOB_CONN in .env file");
  throw new Error('Missing AZURE_BLOB_CONN in environment variables');
}

// Create clients
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Ensure container exists before upload
async function ensureContainer() {
  const exists = await containerClient.exists();
  if (!exists) {
    console.log(` Creating container: ${containerName}`);
    await containerClient.create();
  }
}

// Upload file buffer to Azure Blob
async function uploadBuffer(folderPath, filename, buffer, contentType) {
  await ensureContainer();
  const blobName = `${folderPath}/${Date.now()}_${filename}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log(`⬆️ Uploading file to blob: ${blobName}`);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlobClient.url;
}

export { uploadBuffer };
