"use strict";

const express = require('express');
const app = express();
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
//const bcrypt = require('bcrypt'); // Password Hashing
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
