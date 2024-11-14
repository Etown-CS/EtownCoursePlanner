
(function () {
    "use strict";

    const BASE_URL = "http://localhost:8080"; //"https://etown-course-planner.ue.r.appspot.com/courses"
    window.addEventListener("load", init);

    function init() {
        loadCoreProgress();
    }
    
    async function loadCoreProgress() {
        try {
            const response = await fetch(BASE_URL+"/progress");
            const data = await response.json();
            const percentage = data.progressPercentage;
            const bar = document.getElementById("core-progress-bar");
            bar.style.width = `${percentage}%`;
            bar.setAttribute('aria-valuenow', percentage);
            bar.innerText = `${percentage}% Completed`;
            const coreCreditsInfo = document.getElementById("core-credits-info");
            coreCreditsInfo.innerText = `${data.fulfilledCoreCategories} out of ${data.totalCoreCategories} core completed.`;

            populateCompletedTable();

        } catch (error) {
            console.error("Error loading progress:", error);
        }
    }

    /**
     * Populates Completed Courses table with data.
     */
    function populateCompletedTable() {
        // Populate the table with course data
        const url = BASE_URL + "/courses-completed";
        fetch(url)
        .then(res => {
            if(!res.ok) throw new Error('Response not ok');
            return res.json();
        })
        .then(data => {
            const tableBody = document.getElementById('completed-classes-body');
            tableBody.innerHTML = "";
            data.forEach(course => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.innerText = course.course_code;
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.innerText = course.name;
                row.appendChild(nameCell);

                const fieldCell = document.createElement('td');
                fieldCell.innerText = course.department;
                row.appendChild(fieldCell);

                const creditCell = document.createElement('td');
                creditCell.innerText = course.credits;
                row.appendChild(creditCell);

                tableBody.appendChild(row);
                });
            })
        .catch(error => console.error('Error fetching data:', error));
    }
})();