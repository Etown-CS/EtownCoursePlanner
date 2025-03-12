"use strict";
require('dotenv').config();
require('dotenv').config();
const express = require('express');
const app = express();
// const axios = require('axios');
const multer = require('multer');
const mysql = require('mysql2/promise');
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

//const { generateMeta } = require('./openaiController')
// const dbPath = 'course_planner.db';
const PORT = process.env.PORT || 8080;

const { Connector } = require('@google-cloud/cloud-sql-connector');
const connector = new Connector();


app.use(multer().none());
app.use(cookieParser());

// const storage = multer.memoryStorage();
// const upload = multer({storage: storage});

// Parse incoming url-encoded requests (default format)
app.use(bodyParser.urlencoded({ extended: true }));
// Serves static files
app.use(express.static("web_src"));
//Validation
const validation = require("./data_src/validation.js")

app.use(express.json()); // app.use(bodyParser.json());
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

app.get('/advisors/emails', async (req, res) => {
    try {
        const db = await getDbPool();
        const query = "SELECT DISTINCT name, id, email FROM advisor";
        const [advisors] = await db.query(query); // Fetch all rows from advisor table

        if (advisors.length === 0) {
            return res.status(404).json({ message: "No advisors found." });
        }
        
        res.type('json').send(advisors); // Send results as JSON

    } catch (error) {
        console.error("Error retrieving advisors:", error);
        res.status(500).send('Error on the server. Please try again later.');
    }
});

app.get('/core', async (req, res) => { // Switch POST?
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

app.get('/schedule-view', async (req, res) => {
    try {
        // Extract token from cookie?
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({message: "User not logged in."});
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.email) {
            return res.status(400).json({message: "Invalid token."});
        }
        
        const db = await getDbPool();

        // Retrieve user ID from email
        const user = await getUser(decoded.email);
        const user_id = user[0].id;
        if (!user_id) {
            return res.status(400).json({ message: "User not found." });
        }
        // const user_id = req.body.user_id;
        console.log("User's ID is", user_id);

        // Query out a students saved schedules
        const query = "SELECT id, name FROM schedule WHERE user_id = ?"; // add img
        const [schedules] = await db.query(query, [user_id]);

        // Convert img to buffers
        // schedules.forEach(schedule => {
        //     if (schedule.img) {
        //         schedule.img = Buffer.from(schedule.img).toString('base64');
        //     }
        // });

        res.type('json').send(schedules);
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).send("Error on the server. Please try again later.");
    }
});

app.get('/load-schedule', async (req, res) => { // Changes based on schedule_id
    try {
        // Extract token from cookie?
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({message: "User not logged in."});
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.email) {
            return res.status(400).json({message: "Invalid token."});
        }

        const db = await getDbPool();
        const user = await getUser(decoded.email);
        const user_id = user[0].id;
        if (!user_id) {
            return res.status(400).json({ message: "User not found." });
        }

        const schedule_id = req.query.schedule_id; // req.query.schedule_id
        console.log("Recieved Schedule ID:", schedule_id);

        if (!schedule_id) {
            return res.status(400).json({message: "No Schedule ID."});
        }

        // TODO: Check if the schedule exists and belongs to the logged in user

        const query =  `SELECT s.name AS schedule_name, sc.*
                        FROM schedule s
                        LEFT JOIN schedule_course sc ON s.id = sc.schedule_id
                        WHERE s.id = ?`;
        const [results] = await db.query(query, [schedule_id]);

        if (results.length == 0) {
            return res.status(400).json({message: "No schedule found."});
        }

        const schedule_name = results[0].schedule_name;
        const courses = results.map(({schedule_name, ...course}) => course);
        res.type('json').send({schedule_name, courses});

    } catch (error) {
        console.error("Error retrieving schedule details:", error);
        res.status(500).send("Error on the server. Please try again later.");
    }
});

app.post('/save-schedule', async (req, res) => { // upload.single('image')
    try {
        const {user_id, schedule_id, scheduleName, events} = req.body;
        if (!user_id || !scheduleName || !events || Object.keys(events).length === 0) {
            return res.status(400).json({message: "Missing required data."});
        }
        // const blob = req.file ? req.file.buffer : null; // Extract image blob
        // console.log("Recieved file:", req.file);
        // console.log("Received events:", events);
        // console.log("Type of events:", typeof events);
        // let events = req.body.events;

        // if (typeof events === "string") {
        //     try {
        //         events = JSON.parse(events);
        //     } catch (error) {
        //         return res.status(400).json({ message: "Invalid events format." });
        //     }
        // }

        const db = await getDbPool();
        let sched_id = schedule_id; // Variable for seeing if the schedule_id is null or not
        // TODO: Check if schedule_id is empty instead of null
        if (schedule_id) { // IF THE SCHEDULE ID IS EXISTING and NOT new
            // Update schedule name
            const nameQuery = "UPDATE schedule SET name = ? WHERE id = ? AND user_id = ?"; // add img
            const [name] = await db.query(nameQuery, [scheduleName, schedule_id, user_id]);
            console.log(name);
            // Delete old associated events
            const delQuery = "DELETE FROM schedule_course WHERE schedule_id = ?";
            await db.query(delQuery, [schedule_id]);
        } else { // If there is no schedule id because the schedule is NEW
            // Insert schedule into schedule table
            const insertSchedule = "INSERT INTO schedule (user_id, name) VALUES (?, ?)"; // add img
            const [scheduleResult] = await db.query(insertSchedule, [user_id, scheduleName]);
            // Get inserted schedule id
            sched_id = scheduleResult.insertId;
        }

        // Insert events into schedule_course table
        const insertEvents = "INSERT INTO schedule_course (schedule_id, custom_name, custom_start, custom_end, color, days) VALUES ?";
        const eventMap = new Map(); // Store events grouped by details

        // Iterate over days and group events
        Object.keys(events).forEach(day => { // Days of week
            events[day].forEach(event => { // Array of events of a day, loops
                const key = `${event.title}-${event.startTime}-${event.endTime}-${event.color}`; // Create unique key 
                // If event has the same key, it's considered the same event across multiple days (maybe)
                if (!eventMap.has(key)) { // If event is not in map, add it
                    eventMap.set(key, {...event, days: [day]});
                } else { // Else update existing event/day/idk
                    eventMap.get(key).days.push(day);
                }
            });
        });

        // Prepare event values
        const eventValues = [...eventMap.values()].map(event => [ // Converts values into array ([...]) 
            sched_id, // The new/old schedule id
            event.title,
            convertToMilitaryTime(event.startTime),
            convertToMilitaryTime(event.endTime),
            event.color,
            event.days.join(",") // Convert days to comma-separated string
        ]);

        if (eventValues.length > 0) {
            await db.query(insertEvents, [eventValues]); // Insert grouped events
            console.log("Inserted events:", eventValues);
        }

        res.status(200).json({message: "Schedule saved successfully.", sched_id});
    } catch (error) {
        console.error("Error saving schedule:", error);
        res.status(500).send("Error on the server. Please try again later.");
    }
});

app.post('/delete-schedule', async (req, res) => {
    try {
        const {user_id, schedule_id} = req.body;
        if (!user_id || !schedule_id) {
            return res.status(400).json({message: "Missing required data."});
        }
        const db = await getDbPool();
        await db.query("START TRANSACTION");
        // Delete courses
        const delCourses = "DELETE FROM schedule_course WHERE schedule_id = ?";
        await db.query(delCourses, [schedule_id]);
        // Delete schedule
        const delSchedule = "DELETE FROM schedule WHERE id = ? and user_id = ?";
        const [result] = await db.query(delSchedule, [schedule_id, user_id]);
        if (result.affectedRows === 0) {
            await db.query("ROLLBACK");
            return res.status(400).json({message: "Schedule not found or unauthorized."});
        }
        // Commit transaction
        await db.query("COMMIT");
        res.status(200).send({message: "Schedule deleted successfully."});
    } catch (error) {
        console.error("Error deleting schedule:", error);
        if (db) await db.query("ROLLBACK"); // Only rollback if DB connection exists
        res.status(500).send("Error on the server. Please try again later.");
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
                username: user[0].username,
                major: user[0].major,
                advisor: user[0].advisor_id,
                id: user[0].id,
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

app.patch('/add-minor', async function (req, res) {
    try {
        const email = req.body.email;
        const minor = req.body.minor;
        const min_advisor = req.body.min_advisor_id;

        if (!minor || !min_advisor) {
            return res.status(400).json({
                message: "Missing required field."
            });
        }

        const result = await addMinor(email, minor, min_advisor);
        if (result) {
            return res.status(200).json({
                message: "Minor added successfully!"
            });
        } else {
            return res.status(400).json({
                message: "Error"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error."
        });
    }
});

app.post('/add-oc-course', async function (req, res) {
    try {
        const email = req.body.email;
        const course_code = req.body.course_code;
        const semester = req.body.semester;

        const db = await getDbPool();

        const query1 = `SELECT * FROM user WHERE email = ?;`;
        const [user] = await db.query(query1, [email]);

        const query = `SELECT *
            FROM course WHERE course_code = ?;`;
        const [course] = await db.query(query, [course_code]);
        
        if (course.length === 0) {
            return res.status(404).json({
                message: "Course not found."
            });
        } 

        const result = await addCourse(user[0].id, course[0].id, semester);
        if (result) {
            return res.status(200).json({
                message: "Course added successfully!"
            });
        } else {
            return res.status(400).json({
                message: "Course could not be added."
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error"
        });
    }
});

// Add description here - surely theres already a function for this???
function convertToMilitaryTime(time) {
    if (!time) return null;
    
    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return time; // If already in military time, return as is

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);

    if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`; // hewo?
}

// Functions for registration and login purposes.

/**
 * Updating the user's minor and minor advisor.
 * Any errors that occur should be caught in the function that calls this one.
 * @param {int} id - The id of the user.
 * @param {int} course_id - The id of the course to insert.
 * @param {string} semester - The semester the course was taken to insert.
 * @returns {object} - The course record stored in the database.
 */
async function addCourse(id, course_id, semester) {
    const db = await getDbPool();

    const query = "INSERT INTO completed_course VALUES (?, ?, ?);";
    const res = await db.query(query, [id, course_id, semester]);
    //await db.end();

    return res;
}

/**
 * Updating the user's minor and minor advisor.
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user.
 * @param {string} minor - The minor of the user to insert.
 * @param {string} advisor - The minor advisor of the user to insert.
 * @returns {object} - The user stored in the database.
 */
async function addMinor(email, minor, advisor) {
    const db = await getDbPool();

    const query = "UPDATE user SET minor=?, min_advisor_id=? WHERE email=?";
    const res = await db.query(query, [minor, advisor, email]);
    // console.log(res);
    const user = await getUser(email);
    //await db.end();

    return user;
}

/**
 * Find the User by email
 * Any errors that occur should be caught in the function that calls this one.
 * @param {string} email - The email of the user to find.
 * @returns {object} - The user stored in the database.
 */
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


//get the AI response
const { summarizePDF } = require('./openaiController.js');

app.get('/summarize-pdf', async (req, res) => {
    try {
        const summary = await summarizePDF();
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Failed to summarize PDF" });
    }
});

//yipieee go me

app.get('/api/get-key', (req, res) => {
    // Replace with authentication if needed
    const apiKey = process.env.API_KEY;
    res.json({ apiKey });
});
  
app.listen(3000, () => console.log('Server running on port 3000'));