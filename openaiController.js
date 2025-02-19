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
            PDF1path = "AIDocs/2024-2025_B.S._in_Computer_Science_-_AI_and_Data_Science_Degree_Planner.pdf"; // Ensure this is a PDF path.
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
    const pdf2 = "AIDocs\\2024-2025_Computer_Science_Degree_Planner_(4_Concentrations).pdf";  // Second PDF
    const pdf3 = "AIDocs\\Spring2025CourseListings.pdf";  // Third PDF (Separate Content)

    try {
        // Step 1: Read and extract text from the first two PDFs (combined)
        const dataBuffer1 = fs.readFileSync(pdf1);
        const data1 = await pdfParse(dataBuffer1);
        const pdfText1 = data1.text;
    
        const dataBuffer2 = fs.readFileSync(pdf2);
        const data2 = await pdfParse(dataBuffer2);
        const pdfText2 = data2.text;

        const combinedText = pdfText1 + "\n\n" + pdfText2;

        // Step 2: Read and extract text from the third PDF separately
        const dataBuffer3 = fs.readFileSync(pdf3);
        const data3 = await pdfParse(dataBuffer3);
        const pdfText3 = data3.text;

        // Step 3: Send a single request to OpenAI with both summaries
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user", 
                    content: `A student has already taken the following classes: CS 121 – Computer Science I, EN 100 – PLE Writing & Language, 
                    FYS 100 – First Year Seminar, and MA 121 – Calculus I. The following is a document with when classes are typically offered and 
                    taken in addtion to what is needed to graduate. \n\nn${combinedText}
                    
                    Using the information above can you use this document with courses offered next semester to generate a singlar schedule for the upcoming semester. M stands for monday, T stands for tuesaday, W stands for wednesday, 
                    H stands for thrusday and F stands for friday. A normal semester includes four 4-credit classes for. The minimun number of credits is 12 and the max is 18 credits please find a schedule that fits within this.
                    Can you also make sure that the class times and days dont overalp:\n\n${pdfText3}`
                }
            ],
            max_tokens: 300
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("Error processing PDFs:", error);
        return "Error processing PDFs";
    }
};

    summarizePDF();

module.exports = { summarizePDF };
