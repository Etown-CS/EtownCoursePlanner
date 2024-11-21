
(function () {
    "use strict";

    const BASE_URL = "http://localhost:8080"; //"https://etown-course-planner.ue.r.appspot.com/courses"
    window.addEventListener("load", init);

    function init() {
        loadCoreProgress();
        populateCompletedTable();
        populateMajorTable();
    }
    
    async function loadCoreProgress() {
        try {
            const response = await fetch(BASE_URL+"/core");
            const data = await response.json();
            const percentage = data.progressPercentage;
            const bar = document.getElementById("core-progress-bar");
            bar.style.width = `${percentage}%`;
            bar.setAttribute('aria-valuenow', percentage);
            bar.innerText = `${percentage}% Completed`;
            const coreCreditsInfo = document.getElementById("core-credits-info");
            coreCreditsInfo.innerText = `${data.fulfilledCoreCategories} out of ${data.totalCoreCategories} core completed.`;

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

    function populateMajorTable() {
        // PROMISE ALL 
        Promise.all([
            fetch(BASE_URL+"/courses-completed").then(res => {
                if(!res.ok) throw new Error('Response not ok');
                return res.json();
            }),
            fetch(BASE_URL+"/major").then(res => {
                if(!res.ok) throw new Error('Response not ok');
                return res.json();
            })
        ])
        .then(([completedCourses, majorCourses]) => {
            const completedCourseCodes = new Set(completedCourses.map(course => course.course_code)); // Create set of course codes
            const tableBody = document.getElementById('major-classes-body');
            tableBody.innerHTML = "";
            majorCourses.forEach(course => {
                const row = document.createElement('tr');
                if (completedCourseCodes.has(course.course_code)) { // If it's in the set
                    row.classList.add('table-success'); // go green
                }
                const idCell = document.createElement('td');
                idCell.innerText = course.course_code;
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.innerText = course.name;
                row.appendChild(nameCell);

                const creditCell = document.createElement('td');
                creditCell.innerText = course.credits;
                row.appendChild(creditCell);

                tableBody.appendChild(row);
                });
            })
        .catch(error => console.error('Error fetching data:', error));
    }
})();