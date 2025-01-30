/*const { containerClient } = require('./config/azureBlobConfig');

const testBlobStorage = async () => {
    try {
        console.log('Verific conexiunea la Azure Blob Storage...');

        // Listează fișierele din container
        let blobs = containerClient.listBlobsFlat();
        console.log('Fișiere în container:');
        for await (const blob of blobs) {
            console.log(`- ${blob.name}`);
        }

        console.log('Conexiunea este funcțională!');
    } catch (error) {
        console.error('Eroare conexiune Azure Blob Storage:', error.message);
    }
};

testBlobStorage();
*/
const { poolPromise } = require('./config/dbConfig');

(async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT GETDATE() AS CurrentTime');
        console.log('Connection successful:', result.recordset[0]);
    } catch (error) {
        console.error('Connection failed:', error);
    }
})();
