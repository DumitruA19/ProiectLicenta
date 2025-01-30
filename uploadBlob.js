const { containerClient } = require('./config/azureBlobConfig');
const fs = require('fs');

const uploadTestFile = async () => {
    try {
        console.log('Încărc fișier în Azure Blob Storage...');

        const filePath = './testBlob.txt'; // Creează un fișier simplu în directorul curent
        const blobName = 'test-file-' + Date.now() + '.txt';
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadFile(filePath);

        console.log(`Fișierul a fost încărcat cu succes: ${blobName}`);
    } catch (error) {
        console.error('Eroare încărcare fișier:', error.message);
    }
};

uploadTestFile();
