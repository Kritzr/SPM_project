const { BlobServiceClient } = require('@azure/storage-blob');
const containerName = process.env.BLOB_CONTAINER || 'meeting-files';
const connStr = process.env.AZURE_BLOB_CONN;
if (!connStr) throw new Error('Missing AZURE_BLOB_CONN in env');

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function ensureContainer() {
  const exists = await containerClient.exists();
  if(!exists) await containerClient.create();
}

async function uploadBuffer(folderPath, filename, buffer, contentType) {
  await ensureContainer();
  const blobName = `${folderPath}/${Date.now()}_${filename}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType }});
  return blockBlobClient.url;
}

module.exports = { uploadBuffer };
