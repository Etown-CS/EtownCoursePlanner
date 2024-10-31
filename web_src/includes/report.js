"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://etown-course-planner.ue.r.appspot.com/courses"
    // Fetch courses when the page loads
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON data from the response
        })
        .then(data => {
            // Populate the table with course data
            const classNeededTable = document.getElementById('class-completed-tbl');
            data.forEach(course => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.innerText = course.id;
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.innerText = course.name;
                row.appendChild(nameCell);

                const fieldCell = document.createElement('td');
                fieldCell.innerText = course.department;
                row.appendChild(fieldCell);

                classNeededTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Issue with the fetch operation:', error);
        });
});
