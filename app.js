// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Actualizează importurile în funcție de noile nume
const usersRoutes = require('./routes/usersRoutes'); // Rutele pentru utilizatori
const flotaRoutes = require('./routes/flotaRoutes'); // Rutele pentru flotă
const sediuRoutes = require('./routes/sediuRoutes'); // Rutele pentru sediu
const reparatiiRoutes = require('./routes/reparatiiRoutes'); // Rutele pentru reparații
const accessoriesRoutes = require('./routes/accessoriesRoutes'); // Rutele pentru accesorii
const cereriConcediuRoutes = require('./routes/cereriConcediuRoutes'); // Rutele pentru cereri concediu
const pontajRoutes = require('./routes/pontajRoutes'); // Rutele pentru pontaj
const flotaAccessoriesRoutes = require('./routes/flotaAccessoriesRoutes'); // Rutele pentru flota-accesorii
const notificariRoutes = require('./routes/notificariRoutes'); // Rutele pentru notificări


const { poolPromise } = require('./config/dbConfig'); // Conexiunea la baza de date

const app = express();

// Middleware-uri
app.use(cors());
app.use(express.json());

// Test conexiunea la baza de date
(async () => {
    try {
        console.log('Connecting to database...');
        await poolPromise;
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
})();

// Listare toate rutele înregistrate (pentru debugging)
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        // Verifică ruta și metodele permise
        console.log(`Route: ${middleware.route.path}, Methods: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()}`);
    } else if (middleware.name === 'router') {
        // Pentru routere care conțin mai multe rute
        middleware.handle.stack.forEach((route) => {
            if (route.route) {
                console.log(`Route: ${route.route.path}, Methods: ${Object.keys(route.route.methods).join(', ').toUpperCase()}`);
            }
        });
    }
});

// Înregistrarea rutelor
console.log('Registering routes...');
app.use('/api/users', usersRoutes); // Rutele pentru utilizatori
app.use('/api/flota', flotaRoutes); // Rutele pentru flotă
app.use('/api/sediu', sediuRoutes); // Rutele pentru sediu
app.use('/api/reparatii', reparatiiRoutes); // Rutele pentru reparații
app.use('/api/accessories', accessoriesRoutes); // Rutele pentru accesorii
app.use('/api/cereri-concediu', cereriConcediuRoutes); // Rutele pentru cereri concediu
app.use('/api/pontaj', pontajRoutes); // Rutele pentru pontaj
app.use('/api/flota-accessories', flotaAccessoriesRoutes); // Rutele pentru flota-accesorii
app.use('/api/notificari', notificariRoutes); // Rutele pentru notificări

// Pornirea serverului
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*
// **Dacă este în mod test, NU porni serverul**
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    module.exports = server; // Exportă serverul doar pentru utilizare normală
}

module.exports = app; // Exportă `app` pentru Jest

/*
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./routes/usersRoutes');
const flotaRoutes = require('./routes/flotaRoutes');
const sediuRoutes = require('./routes/sediuRoutes');
const reparatiiRoutes = require('./routes/reparatiiRoutes');
const accessoriesRoutes = require('./routes/accessoriesRoutes');
const cereriConcediuRoutes = require('./routes/cereriConcediuRoutes');
const pontajRoutes = require('./routes/pontajRoutes');
const flotaAccessoriesRoutes = require('./routes/flotaAccessoriesRoutes');
const notificariRoutes = require('./routes/notificariRoutes');

const { poolPromise } = require('./config/dbConfig');

const app = express();

// Middleware-uri
app.use(cors());
app.use(express.json());

// Test conexiunea la baza de date (executat doar în producție)
if (process.env.NODE_ENV !== 'test') {
    (async () => {
        try {
            console.log('Connecting to database...');
            await poolPromise;
            console.log('Database connection successful');
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    })();
}

// Înregistrarea rutelor
console.log('Registering routes...');
app.use('/api/users', usersRoutes);
app.use('/api/flota', flotaRoutes);
app.use('/api/sediu', sediuRoutes);
app.use('/api/reparatii', reparatiiRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/cereri-concediu', cereriConcediuRoutes);
app.use('/api/pontaj', pontajRoutes);
app.use('/api/flota-accessories', flotaAccessoriesRoutes);
app.use('/api/notificari', notificariRoutes);

// Pornirea serverului (doar pentru producție)
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Exportă aplicația pentru testare
module.exports = app;
*/