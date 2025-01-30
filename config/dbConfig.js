/*const sql = require('mssql');

const poolPromise = new sql.ConnectionPool({
  user: 'email',
  password: 'password',
  server: DB_CONNECTION_STRING,
  options: {
    encrypt: true,
    trustServerCertificate: true, // Setează în funcție de cerințe
  },
})
  .connect()
  .then(pool => {
    console.log('Connected to Azure SQL Database');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed: ', err);
    process.exit(1);
  });

module.exports = {
  poolPromise,
};


*/

const sql = require('mssql');
require('dotenv').config();

const poolPromise = new sql.ConnectionPool(process.env.DB_CONNECTION_STRING)
    .connect()
    .then(pool => {
        console.log('Connected to Azure SQL Database');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed: ', err);
        process.exit(1);
    });

module.exports = { poolPromise };

/*
const sql = require('mssql');
require('dotenv').config();

let pool;

// Extrage configurarea bazei de date din DB_CONNECTION_STRING
const parseConnectionString = (connectionString) => {
    const params = connectionString.split(';');
    const config = {};
    params.forEach(param => {
        const [key, value] = param.split('=');
        config[key.toLowerCase()] = value;
    });
    return {
        server: config['server'].replace('tcp:', ''), // Elimină prefixul "tcp:"
        database: config['database'],
        options: {
            encrypt: true,
            trustServerCertificate: config['trustservercertificate'] === 'true',
        },
        authentication: {
            type: 'default',
            options: {
                userName: config['user id'],
                password: config['password'],
            },
        },
    };
};

// Selectăm conexiunea în funcție de mediul curent
const selectedConfig = parseConnectionString(process.env.DB_CONNECTION_STRING);

const poolPromise = (async () => {
    try {
        pool = await sql.connect(selectedConfig);
        console.log('Connected to Azure SQL Database');
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
})();

module.exports = { poolPromise };
*/