const { poolPromise } = require('../config/dbConfig'); // Conexiunea la baza de date
const bcrypt = require('bcrypt'); // Pentru hashuirea parolelor
const sql = require('mssql'); // Pentru interogări SQL
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//const { sendNotification } = require('./notificariController'); // Notificări email/sms
const { addLog } = require('./logController'); // Logarea acțiunilor

// Obține toți utilizatorii
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT id, name, email, role, employee_type, sediu_id, is_active, created_at
            FROM users
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

/*// Autentificare utilizator
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = result.recordset[0];

        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is deactivated. Please contact your administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({ message: 'Login successful.', token });
        await addLog(user.id, 'User login', `User ${user.email} logged in successfully.`);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error while logging in.' });
    }
};
*/
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Răspuns trimis cu succes
        res.status(200).json({ message: 'Login successful.', token });

        // Log-ul se execută separat
        await addLog(user.id, 'User login', `User ${user.email} logged in successfully.`);
    } catch (error) {
        console.error('Error logging in:', error);

        // Asigură-te că răspunsul de eroare este trimis doar dacă nu a fost trimis deja
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error while logging in.' });
        }
    }
};
/*
// Creează un utilizator nou
const createUser = async (req, res) => {
    const { name, email, password, role, employee_type, sediu_id, fingerprint } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    try {
        const pool = await poolPromise;

        const emailCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT COUNT(*) AS count FROM users WHERE email = @email');

        if (emailCheck.recordset[0].count > 0) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userFingerprint = fingerprint || null;

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, role)
            .input('employee_type', sql.NVarChar, employee_type || null)
            .input('sediu_id', sql.Int, sediu_id || null)
            .input('fingerprint', sql.NVarChar, userFingerprint)
            .input('phone', sql.NVarChar, userPhone)
            .query(`
                INSERT INTO users (name, email, password, role, employee_type, sediu_id, fingerprint, phone)
                VALUES (@name, @email, @password, @role, @employee_type, @sediu_id, @fingerprint, @phone)
            `);

        res.status(201).json({ message: 'User created successfully.' });
        await addLog(null, 'User created', `New user ${email} created.`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};*/
const createUser = async (req, res) => {
    const { name, email, password, role, employee_type, sediu_id, fingerprint, phone } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    try {
        const pool = await poolPromise;

        const emailCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT COUNT(*) AS count FROM users WHERE email = @email');

        if (emailCheck.recordset[0].count > 0) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userFingerprint = fingerprint || null;

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, role)
            .input('employee_type', sql.NVarChar, employee_type || null)
            .input('sediu_id', sql.Int, sediu_id || null)
            .input('fingerprint', sql.NVarChar, userFingerprint)
            .input('phone', sql.NVarChar, phone || null) // Fixed issue
            .query(`
                INSERT INTO users (name, email, password, role, employee_type, sediu_id, fingerprint, phone)
                VALUES (@name, @email, @password, @role, @employee_type, @sediu_id, @fingerprint, @phone)
            `);

        res.status(201).json({ message: 'User created successfully.' });
        await addLog(null, 'User created', `New user ${email} created.`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};

/*
// Actualizează un utilizator
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, employee_type, sediu_id, is_active } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name || null)
            .input('email', sql.NVarChar, email || null)
            .input('role', sql.NVarChar, role || null)
            .input('employee_type', sql.NVarChar, employee_type || null)
            .input('sediu_id', sql.Int, sediu_id || null)
            .input('is_active', sql.Bit, is_active !== undefined ? is_active : null)
            .input('phone', sql.NVarChar, phone || null)
            .query(`
                UPDATE users
                SET name = ISNULL(@name, name),
                    email = ISNULL(@email, email),
                    role = ISNULL(@role, role),
                    employee_type = ISNULL(@employee_type, employee_type),
                    sediu_id = ISNULL(@sediu_id, sediu_id),
                    is_active = ISNULL(@is_active, is_active),
                    phone = ISNULL(@phone, phone)
                WHERE id = @id
            `);

        res.status(200).json({ message: 'User updated successfully.' });
        await addLog(id, 'User updated', `User ${id} was updated.`);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};
/** */
const updateUser = async (req, res) => {
    const { id } = req.params; // Preia ID-ul din URL
    const { name, email, role, employee_type, sediu_id, is_active, phone } = req.body; // Preia datele din body

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name || null)
            .input('email', sql.NVarChar, email || null)
            .input('role', sql.NVarChar, role || null)
            .input('employee_type', sql.NVarChar, employee_type || null)
            .input('sediu_id', sql.Int, sediu_id || null)
            .input('is_active', sql.Bit, is_active !== undefined ? is_active : null)
            .input('phone', sql.NVarChar, phone || null)
            .query(`
                UPDATE users
                SET name = ISNULL(@name, name),
                    email = ISNULL(@email, email),
                    role = ISNULL(@role, role),
                    employee_type = ISNULL(@employee_type, employee_type),
                    sediu_id = ISNULL(@sediu_id, sediu_id),
                    is_active = ISNULL(@is_active, is_active),
                    phone = ISNULL(@phone, phone)
                WHERE id = @id
            `);

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};

// Dezactivează un utilizator
const deactivateUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE users
                SET is_active = 0
                WHERE id = @id
            `);

        res.status(200).json({ message: 'User deactivated successfully.' });
        await addLog(id, 'User deactivated', `User ${id} was deactivated.`);
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ message: 'Server error while deactivating user.' });
    }
};

// Șterge un utilizator
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM users WHERE id = @id');

        res.status(200).json({ message: 'User deleted successfully.' });
        await addLog(id, 'User deleted', `User ${id} was deleted.`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deactivateUser,
    loginUser,
    deleteUser,
};
