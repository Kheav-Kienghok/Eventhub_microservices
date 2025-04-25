import express from 'express';
import bodyParser from 'body-parser';
import db_connect from './db_connect.js';
import User from './model/user_schema.js';
import seedAdmin from './seedAdmin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(bodyParser.json());

seedAdmin(User); // Seed the admin user

// User Registration (POST)
app.post('/register', async (req, res) => {
    
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Send a success response
        res.status(201).send({ message: 'User registered successfully' });

    } catch (err) {

        console.error('Registration error:', err); // 👈 log it
        // Send an error response
        res.status(400).send({ message: "Error registering user", err });
    }
});


// User Login (POST)
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    try {

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' });
        };

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful.', token });

    } catch (err) {

        // Send an error response
        res.status(500).send({
            message: 'Error logging in', err
        });
    };

});


app.listen(PORT, () => {
    console.log(`Auth Service is running at http://localhost:${PORT}`);
});