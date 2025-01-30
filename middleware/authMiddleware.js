/*const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrage token-ul din header-ul Authorization

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // Dacă nu există token
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifică dacă token-ul este valid
        req.user = decoded;
        next(); // Continuă către ruta
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' }); // Dacă token-ul este invalid
    }
};

module.exports = { protect };
*/const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization; // Verifică dacă există req.headers și authHeader

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Authorization header missing or invalid");
            return res.status(401).json({ message: "Unauthorized - Missing or invalid token" });
        }

        const token = authHeader.split(" ")[1]; // Extrage token-ul din header
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifică token-ul

        req.user = decoded; // Atașează informațiile utilizatorului la obiectul req
        next(); // Continuă către următoarea rută
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

module.exports = { protect };
