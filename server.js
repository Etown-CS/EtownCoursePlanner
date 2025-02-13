"use strict";
require('dotenv').config();
const express = require('express');
const app = express();
const multer = require('multer');
const mysql = require('mysql2/promise');
// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
const bcrypt = require('bcrypt'); // Password Hashing
const bodyParser = require('body-parser'); // Parses form body
const jwt = require('jsonwebtoken');
const jwtSecret = "0f21f0a8883cdbfab0d88578e409b702a6461977c93a101ad81ba96b04281563";
const cookieParser = require("cookie-parser");
const readline = require("readline");
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.API_KEY2,
});

module.exports = openai;

const { generateMeta } = require('./openaiController')
// const dbPath = 'course_planner.db';
const PORT = process.env.PORT || 8080;

const { Connector } = require('@google-cloud/cloud-sql-connector');
const connector = new Connector();


app.use(multer().none());

// const createUnixSocketPool = require('./connect-unix.js')

// Parse incoming url-encoded requests (default format)
app.use(bodyParser.urlencoded({ extended: true }));
// Serves static files
app.use(express.static("web_src"));
//Validation
const validation = require("./data_src/validation.js")

let dbPool;

// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const db = await getDbPool();
        const query = "SELECT * FROM course"; 
        const [courses] = await db.query(query); // Fetch all rows from courses table

        //await db.end();
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found." });
        }
        res.type('json').send(courses); // Send results as JSON

    } catch (error) {
        console.error("Error retrieving courses:", error);
        res.status(500).send('Error on the server. Please try again later.');
    }
});

app.get('/courses-completed', async (req, res) => {
    const userId = 1; // Hard code user for now
    try {
        const db = await getDbPool();
        const query = `SELECT c.course_code, c.name, c.department, c.credits 
            FROM completed_course cc JOIN course c ON cc.course_id = c.id 
            WHERE cc.user_id = ?;`;
        const [completedCourses] = await db.query(query, [userId]);
        //await db.end();

        if (completedCourses.length === 0) {
            return res.status(404).json({ message: "No completed courses found."});
        }

        res.type('json').send(completedCourses);
        //console.log(completedCourses);
    } catch (error) {
        console.error("Error fetching completed courses data:", error);
        res.status(500).send("Error on server. Please try again later.");
    }
});

app.get('/major', async (req, res) => {
    //const userId = 1; // have to get user's major too
    const courseIds= [1, 2, 3, 31, 23, 7, 8, 12, 24, 10, 13, 14, 15, 25, 26, 21, 22, 18, 17, 19]
    try {
        const db = await getDbPool();
        const query = `SELECT course_code, name, credits
            FROM course
            WHERE id IN (${courseIds.join(', ')})`;

        const [majorCourses] = await db.query(query);
        
        if (majorCourses.length === 0) {
            return res.status(404).json({ message: "No major courses found."});
        }

        //console.log(majorCourses);
        res.type('json').send(majorCourses);
    } catch (error) {
        console.error("Error fetching major courses data:", error);
        res.status(500).send("Error on server. Please try again later.");
    }
});

app.get('/advisors', async (req, res) => {
    try {
        const db = await getDbPool();
        const query = "SELECT DISTINCT name, id FROM advisor";
        const [advisors] = await db.query(query); // Fetch all rows from courses table

        if (advisors.length === 0) {
            return res.status(404).json({ message: "No advisors found."});
        }
        //await db.end();
        res.type('json').send(advisors); // Send results as JSON

    } catch (error) {
        console.error("Error retrieving advisors:", error);
        res.status(500).send('Error on the server. Please try again later.');
    }
});

app.get('/core', async (req, res) => {
    const userId = 1; // Hard code user for now
    try {
        const db = await getDbPool();
        const query = `SELECT c.course_code, c.name, c.credits, c.core 
        FROM completed_course cc 
        JOIN course c ON cc.course_id = c.id 
        WHERE cc.user_id = ?;`;
        const [completedCourses] = await db.query(query, [userId]);
        //await db.end();

        const coreRequirements = {
            "PLE" : 1,
            "PLO" : 1,
            "MA" : 1,
            "CE" : 4,
            "WCH" : 1,
            "NCH" : 1,
            "NPS" : 1,
            "NPSL" : 1,
            "SSC" : 1,
            "HUM" : 1,
            "SLE" : 2
        };
        
        const coreFulfilled = {};
        let ceCredits = 0;
        const completedCoreCourses = [];

        completedCourses.forEach(course => {
            const coreType = course.core;
            if (coreType && coreType in coreRequirements) {
                completedCoreCourses.push(course);

                if (coreType === "CE") {
                    ceCredits += course.credits;
                } else {
                    coreFulfilled[coreType] = true;
                }
            }
        });

        if (ceCredits >= coreRequirements["CE"]) {
            coreFulfilled["CE"] = true;
        }

        const totalCoreCategories = Object.keys(coreRequirements).length;
        const fulfilledCoreCategories = Object.keys(coreFulfilled).length;
        const progressPercentage = Math.round((fulfilledCoreCategories/totalCoreCategories)*100);

        res.type('json').send({
            completedCoreCourses,
            fulfilledCoreCategories,
            totalCoreCategories,
            progressPercentage
        });
    } catch (error) {
        console.error("Error fetching progress data:", error);
        res.status(500).send("Error on server. Please try again later.");
    }
});

app.post('/register', async function (req, res) {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const major = req.body.major;
        const advisor = req.body.advisor;
        const password = req.body.password;

        // Username, email, and password are all required, so if any are missing, return error.
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing required field."
            });
        }

        //username validation
        const username_err = validation.check_username(username);
        if (username_err != "") {
            return res.status(400).json({
                message: username_err
            });
        }


        // email validation
       const email_err = validation.check_email(email);
       if (email_err != "") {
           return res.status(400).json({
               message: email_err
           });
       }


       // password validation
       const pwd_err = validation.check_password(password);
       if (pwd_err != "") {
           return res.status(400).json({
               message: pwd_err
           });
       }


        // Checking if email is already in table
        const user = await getUser(email);

        // Emails must be unique, so if it already exists, return error.
        if (user) {
            return res.status(400).json({
                message: "Email already in use, try again."
            });
        }

        // Password encryption - security!
        const encrypted_pw = await bcrypt.hash(password, 10);

        // Create user in table and register them, using encrypted password.
        const result = await createUser(username, email, major, advisor, encrypted_pw);

        // Check to see all went as planned, res 200
        if (result) {
            return res.status(200).json({
                message: "Account created successfully."
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error."
        });
    }
});

app.post('/login', async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                message: "Missing required field."
            });
        }

        const user = await getUser(email);
        if (!user || user.length === 0) {
            return res.status(400).json({
                message: "User not found. Try again."
            });
        }

        const result = await bcrypt.compare(password, user[0].password);
        if (result) {
            // Set the cookie using jwt
            const maxAge = 7*24*60*60; // One week in seconds
            const token = jwt.sign(
                {"login": true, "email": email},
                jwtSecret,
                {expiresIn: maxAge}
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 7 hours in miliseconds
            });

            return res.status(200).json({
                message: "Login successful!"
            });
        } else {
            return res.status(400).json({
                message: "Password incorrect. Try again."
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error."
        });
    }
});

// Functions for registration and login purposes.

/**
 * Find the User by email
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user to find.
 * @returns {object} - The user stored in the database.
 */
// async function getUser(email) {
//     const db = await getDbPool();

//     const query = "SELECT * FROM user WHERE email = ?";
//     const [user] = await db.query(query, [email]);

//     //await db.end();

//     return user;
// }

async function getUser(email) {
    const db = await getDbPool();
    const query = "SELECT * FROM user WHERE email = ?";
    const [user] = await db.query(query, [email]);

    if (user.length === 0) {
        return null;
    }

    return user;
}


/**
 * Create the new account by email and password
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user to insert.
 * @param {string} username - The username of the user to insert.
 * @param {string} major - The major of the user to insert.
 * @param {string} advisor - The advisor of the user to insert.
 * @param {string} ecrypt_password - The encoded password of the user to insert.
 * @returns {object} - The user stored in the database.
 */
async function createUser(username, email, major, advisor, encrypt_password) {
    const db = await getDbPool();

    const query = "INSERT INTO user (username, email, major, advisor_id, password) VALUES (?, ?, ?, ?, ?);";
    const res = await db.query(query, [username, email, major, advisor, encrypt_password]);
    // console.log(res);
    const user = await getUser(email);
    //await db.end();

    return user;
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
// async function getDBConnection() {
//     const db = await sqlite.open({
//         filename: dbPath,
//         driver: sqlite3.Database
//     });

//     return db;
// }

async function testDbConnection() {
    try {
        const db = await getDbPool();  // Get the dpool
        //const [results] = await db.query('SELECT * FROM user;');
        //console.log(results);
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}


// Easier to check
async function getDbPool() {
    if (!dbPool) {
        dbPool = await createDbPool();
    }
    return dbPool;
}

async function createDbPool() {
    const clientOpts = await connector.getOptions({
        instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
        ipType: 'PUBLIC',
    });

    const pool = mysql.createPool({
        ...clientOpts,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    return pool;
}

process.on('SIGINT', async () => {
    if (dbPool) {
        await dbPool.end();
        console.log('Pool is now closed');
    }
    process.exit();
})

// Basic Route
// app.get('/', (req, res) => {
//     res.send('Welcome to the Underground');
// });

// Start the server
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    testDbConnection();
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Youtube video title: \n', generateMeta)
