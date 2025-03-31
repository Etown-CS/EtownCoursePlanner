"use strict";

(function () {
    window.addEventListener("load", init);
    
    function init() {
        loadSemesters();
        console.log("HELLO?");
    }

    async function loadSemesters() {
        try {
            console.log("In semesters function.");
            const response = await fetch('/recommended-plan');
            if (!response.ok) {
                console.error("Failed response for loading semesters.");
            }

            const semesters = await response.json();

            const tableBody = document.getElementById("semester-body");
            tableBody.innerHTML = ""; // Clear any existing stuff
            console.log("element", tableBody);
            // Find max number of courses in semester
            const maxRows = Math.max(...semesters.map(semester => semester.courses.length)); // Array of all semester lengths, takes max
            console.log("max rows:", maxRows);
            // Create table rows dynamically
            for (let row = 0; row < maxRows; row++) {
                const tr = document.createElement("tr");

                semesters.forEach(semester => { // For each list of courses (in semester)
                    const td = document.createElement("td");
                    const course = semester.courses[row]; // Probably 0-7
                    if (course) { 
                        td.textContent = `${course.course_code} ${course.name}`; // Display course names
                    } else { // If course[#] less than max - nonexistant
                        td.textContent = "Core or Elective"; // Empty row
                    }
                    tr.appendChild(td); // Refer to schedule.js
                });
                tableBody.appendChild(tr);
            }

            const creditRow = document.createElement("tr"); // Death row
            semesters.forEach(semester => {
                const td = document.createElement("td");
                td.textContent = `Total Credits: ${semester.total_credits}`;
                td.style.fontWeight = "bold"; // idk
                creditRow.appendChild(td);
            });
            tableBody.appendChild(creditRow); // Append at bottom
            // Make outline of column turn red if overload ¯\_(ツ)_/¯
        } catch(error) {
            console.error("Error fetching semesters:", error);
        }
    }

}) ();