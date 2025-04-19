"use strict";
const openai = require('./server');
const fs = require('fs');
const pdfParse = require('pdf-parse');
// You might need a package like 'mammoth' or 'docx-parser' for DOCX files.

function FindDocuments() {
    let track = "AI & Data Science";
    let PDF1path;  // Declare PDF1path variable outside the switch statement

    switch (track) {
        case "Hardware":
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_-_Hardware_Degree_Planner.pdf";
            console.log("Hardware");
            break;
        case "AI & Data Science":
            PDF1path = "AIDocs/2024-2025_Computer_Science_Degree_Planner_(4_Concentrations).pdf"; // Ensure this is a PDF path.
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
    return PDF1path;  // Return the file path after the switch block
}

const summarizePDF = async () => {
    const pdf1 = FindDocuments();  // First PDF
    const pdf3 = "AIDocs/Spring2025CourseListings.pdf";  // Third PDF (Separate Content)

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
                    content: `A student has  a Data and AI conecntration they already taken the following classes: CS 121 – Computer Science I, EN 100 – PLE Writing & Language, 
                    FYS 100 – First Year Seminar, MA 121 – Calculus I, CS 122 - Computer Science II, MA 251 - Probability & Statistics, CS 230 - Computer Architecture, 
                    Core Course (Humanities) - PH 263 – Societal Impacts of Computing, Artificial Intelligence, and Robotics
                    Make a schedule for the spring. The student has 6 semesters left. The following is a document with when classes are typically offered and 
                    taken in addtion to what is needed to graduate. \n\nn${pdfText1}
                    
                   A class can only count as a prerequisite if I have explicitly stated that I have taken it. 
                   According to department rules, prerequisites must be completed in a different semester and cannot be taken in the 
                   same semester as the course that requires them. If a class is listed as a prerequisite for another class in the same 
                   semester, do not include it in the schedule, and instead find another class that does not have the prerequisite 
                   requirement in the same semester.

                    Only include classes from the provided document.
                    M = Monday, T = Tuesday, W = Wednesday, H = Thursday, and F = Friday.
                    A typical semester consists of four 4-credit classes.
                    The schedule must include at least 12 credits and no more than 18 credits.
                    Ensure that class times and days do not overlap.
                    If it is not in the PDF bleow do not include that class as it is not offered.
                    Please format the output in JSON formatting with calss code, Name, credits, day&time of class and indicate whether the prerequisite is satisfied (Yes/No) if no find a new class and do not output this class :

                    The input for the schedule is as follows:
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

    summarizePDF();

module.exports = { summarizePDF };
