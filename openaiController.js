"use strict";
// const openai = require("./server");
// const openai = require('./openaiClient');
const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path"); 
const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');
const connector = new Connector();
let dbPool;

const{ SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const OpenAI = require("openai");

//a function to get the completed courses to feed to the AI from the database
async function fetchCoursesTaken(userId) {
    // const url = "http://localhost:8080/courses-completed";
 
    try {
        const db = await getDbPool();
        const [rows] = await db.query(
            `SELECT DISTINCT
            c.course_code,
            c.name,
            c.department,
            c.credits
            FROM completed_course cc
            JOIN course c ON cc.course_id = c.id
            WHERE cc.user_id = ?`,
            [userId]
        );
        
        const courseDict = {};
        rows.forEach(course => {
            courseDict[course.course_code] = {
            name:       course.name,
            department: course.department,
            credits:    course.credits
            };
        });
 
        return courseDict;
 
    } catch (error) {
        console.error("Error fetching data:", error);
        return {}; // Return empty dictionary if there's an error
    }
}
 
 
function FindDocuments() {
    let track = "AI & Data Science";//Hard coded for cs but code can be used in future for other majors
    let PDF1path;  
 
    switch (track) {
        case "Hardware":
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_-_Hardware_Degree_Planner.pdf";
            console.log("Hardware");
            break;
        case "AI & Data Science":
            PDF1path = path.join(__dirname, "AIDocs", "2024-2025_Computer_Science_Degree_Planner_(4_Concentrations).pdf");
            console.log("Data Science");
            break;
        case "Cyber Security":
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_-_Cybersecurity_Degree_Planner.pdf";
            console.log("Cyber Security");
            break;
        case "Web & Application Design":
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_-_Web_&_Application_Design_Degree_Planner.pdf";
            console.log("Web & Application Design");
            break;
        default:
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_Degree_Planner.pdf";
            console.log("Untracked");
    }
    return PDF1path;  
}

async function getOpenAIKey() {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: "projects/477922637599/secrets/openai-api-key/versions/latest"
    });
    return version.payload.data.toString("utf8").trim(); // New line character somehow
}
 
const summarizePDF = async (courseDict, openai) => {
    console.log("Inside summarizePDF()...");
    const pdf1 = FindDocuments();  // First PDF
    const pdf3 = path.join(__dirname, "AIDocs", "Spring2025CourseListings.pdf");  // Third PDF (Separate Content)
    // console.log("Calling fetchCourses...");
    // let coursesTaken = await fetchCoursesTaken();
    // coursesTaken = JSON.stringify(coursesTaken);
    // console.log(coursesTaken);
    const coursesTakenStr = JSON.stringify(courseDict, null, 2);

    // const apiKey = await getOpenAIKey();
    // const openai = new OpenAI({apiKey});
 
    try {
        // Step 1: Read and extract text from the first two PDFs (combined)
        const dataBuffer1 = fs.readFileSync(pdf1);
        const data1 = await pdfParse(dataBuffer1);
        const pdfText1 = data1.text;
 
        // Step 2: Read and extract text from the third PDF separately
        const dataBuffer3 = fs.readFileSync(pdf3);
        const data3 = await pdfParse(dataBuffer3);
        const pdfText3 = data3.text;
 
        // Step 3: Send a single request to OpenAI with both summaries
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: `A student has a Data and AI conecntration they already taken the following classes: ${coursesTakenStr}
                    Make a schedule for the spring. The student has 6 semesters left. The following is a document with when classes are typically offered and
                    taken in addtion to what is needed to graduate. \n\nn${pdfText1}
                   
                   A class can only count as a prerequisite if I have explicitly stated that I have taken it.
                   According to department rules, prerequisites must be completed in a different semester and cannot be taken in the
                   same semester as the course that requires them. If a class is listed as a prerequisite for another class in the same
                   semester, do not include it in the schedule, and instead find another class that does not have the prerequisite
                   requirement in the same semester.
 
                    Only include classes from the provided document.
                    **Do not suggest any course the student has already taken.**
                    M = Monday, T = Tuesday, W = Wednesday, H = Thursday, and F = Friday.
                    A typical semester consists of four 4-credit classes.
                    The schedule must include 16 credits.
                    Ensure that class times and days do not overlap.
                    If it is not in the PDF bleow do not include that class as it is not offered.
                    Please the output with class code, Name, credits, day & time of class and indicate whether the prerequisite is satisfied (Yes/No) if no find a new class and do not output this class :
 
                    The input for the schedule is as follows:
                    Common Core Requirements abberviations used in the following document are as follows :
                    PLO Power of Language
                    MA Mathematics
                    CE Creative Expression
                    WCH Western Cultural Heritage
                    NCH Non-Western Cultural Heritage
                    NPS Natural and Physical Sciences
                    SSC Social Sciences
                    HUM Humanities
                    \n\n${pdfText3}`
                }
            ],
            max_tokens: 400
        });
        console.log()
        return response.choices[0].message.content;
 
    } catch (error) {
        console.error("Error processing PDFs:", error);
        return "Error processing PDFs";
    }
};
 
async function createDbPool() {
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
      ipType: 'PUBLIC'
    });
    return mysql.createPool({
      ...clientOpts,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  async function getDbPool() {
    if (!dbPool) {
      dbPool = await createDbPool();
    }
    return dbPool;
  }
   //summarizePDF();
 
module.exports = { getOpenAIKey, fetchCoursesTaken, summarizePDF };