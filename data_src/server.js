"use strict";

const express = require('express');
const app = express();
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const bcrypt = require('bcrypt'); // Password Hashing
const bodyParser = require('body-parser'); // Parses form body
const dbPath = 'course_planner.db';
const PORT = process.env.PORT || 8080;
require('dotenv').config();
app.use(multer().none());

// Parse incoming url-encoded requests (default format)
app.use(bodyParser.urlencoded({ extended: true }));
// Serves static files
app.use(express.static('./../web_src'));


// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const db = await getDBConnection();
        const query = "SELECT * FROM course"; // Adjust 'courses' to your table name
        const courses = await db.all(query); // Fetch all rows from courses table

        await db.close();
        res.type('json').send(courses); // Send results as JSON

    } catch (error) {
        console.error("Error retrieving courses:", error);
        res.status(500).send('Error on the server. Please try again later.');
    }
});

app.get('/advisors', async (req, res) => {
    try {
        const db = await getDBConnection();
        const query = "SELECT DISTINCT name FROM advisor"; // Adjust 'courses' to your table name
        const advisors = await db.all(query); // Fetch all rows from courses table

        await db.close();
        res.type('json').send(advisors); // Send results as JSON

    } catch (error) {
        console.error("Error retrieving advisors:", error);
        res.status(500).send('Error on the server. Please try again later.');
    }
})

app.post('/register', async function (req, res) {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const v_password = req.body.confirm_password;

        // Username, email, and password are all required, so if any are missing, return error.
        if (!username || !email || !password || !v_password) {
            return res.status(400).json({
                'message': "Missing required field."
            });
        }

        // Checking if email is already in table
        const user = await getUser(email);

        // Usernames must be unique, so if it already exists, return error.
        if (user) {
            return res.status(400).json({
                'message': "Username already in use, try again."
            });
        }

        // Password encryption - security!
        const encrypted_pw = await bcrypt.hash(password, 10);

        // Create user in table and register them, using encrypted password.
        const result = await createUser(username, email, encrypted_pw);

        // Check to see all went as planned, res 200
        if (result) {
            return res.status(200).json({
                'message': "Account created successfully."
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            'message': "Error."
        })
    };
});

app.post('/login', async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                'message': "Missing required field."
            });
        }

        const user = await getUser(email);
        if (!user) {
            return res.status(400).json({
                'message': "User not found. Try again."
            });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            return res.status(200).json({
                'message': "Login successful!"
            });
        } else {
            return res.status(400).json({
                'message': "Password incorrect. Try again."
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// Functions for registration and login purposes.

/**
 * Find the User by email
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user to find.
 * @returns {object} - The user stored in the database.
 */
async function getUser(email) {
    const db = await getDBConnection();

    const query = "SELECT * FROM user WHERE email = ?";
    const user = await db.get(query, [email]);

    await db.close();

    return user;
}

/**
 * Create the new account by email and password
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user to insert.
 * @param {string} username - The username of the user to insert.
 * @param {string} ecrypt_password - The encoded password of the user to insert.
 * @returns {object} - The user stored in the database.
 */
async function createUser(username, email, encrypt_password) {
    const db = await getDBConnection();

    const query = "INSERT INTO user (username, email, password) VALUES (?, ?, ?);";
    const res = await db.run(query, [username, email, encrypt_password]);

    const user = await getUser(username);
    await db.close();

    return user;
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
    const db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    return db;
}

// Basic Route
// app.get('/', (req, res) => {
//     res.send('Welcome to the Underground');
// });

// Start the server
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
