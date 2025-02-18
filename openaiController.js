const openai = require('./server');
const fs = require('fs');
const pdf = require('pdf-parse');
// You might need a package like 'mammoth' or 'docx-parser' for DOCX files.

function FindDocuments() {
    let track = "AI & Data Science";
    let PDF1path;  // Declare PDF1path variable outside the switch statement

    switch (track) {
        case "Hardware":
            PDF1path = "AIDocs\\2024-2025_B.S._in_Computer_Science_-_Hardware_Degree_Planner.pdf";
            console.log("Hardware");
            break;
        case "AI & Data Science":
            PDF1path = "AIDocs\\2024-2025_B.S._in_Computer_Science_-_AI_and_Data_Science_Degree_Planner.pdf"; // Ensure this is a PDF path.
            console.log("Data Science");
            break;
        case "Cyber Security":
            PDF1path = "AIDocs\\2024-2025_B.S._in_Computer_Science_-_Cybersecurity_Degree_Planner.pdf";
            console.log("Cyber Security");
            break;
        case "Web & Application Design":
            PDF1path = "AIDocs\\2024-2025_B.S._in_Computer_Science_-_Web_&_Application_Design_Degree_Planner.pdf";
            console.log("Web & Application Design");
            break;
        default:
            PDF1path = "AIDocs\\2024-2025_B.S._in_Computer_Science_Degree_Planner.pdf";
            console.log("Untracked");
    }
    return PDF1path;  // Return the file path after the switch block
}

    const PDF2path = "AIDocs\\2024-2025_Computer_Science_Degree_Planner_(4_Concentrations).pdf"; // Make sure this is a valid path

    const summarizePDF = async () => {
        try {
            let pdf = FindDocuments();
            // Step 1: Read the PDF file
            const dataBuffer = fs.readFileSync(pdf);  // Use correct variable name here
            const data = await pdf(dataBuffer);
            const pdfText = data.text;

            console.log("Extracted PDF Text:", pdfText.substring(0, 500)); // Debugging: Print first 500 chars

            // Step 2: Send the extracted text to OpenAI for summarization
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user", 
                        content: `Summarize the following PDF content:\n\n${pdfText.substring(0, 2000)}`
                    }
                ],
                max_tokens: 150
            });

            // Debugging: Print full API response
            console.log("Full API Response:", response);

            // Step 3: Handle API response correctly
            if (!response.choices || response.choices.length === 0) {
                throw new Error("No choices returned from OpenAI API");
            }

            console.log("Generated Summary:", response.choices[0].message.content);
            return response.choices[0].message.content;
        } catch (error) {
            console.error("Error processing PDF:", error);
            return "Error processing PDF";
        }
    };

    summarizePDF();

module.exports = { summarizePDF };
