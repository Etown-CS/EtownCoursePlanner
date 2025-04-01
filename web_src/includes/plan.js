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

                    // Create a wrapper div for styling
                    const cellDiv = document.createElement("div");
                    cellDiv.classList.add("cell-content");
    
                    // Course text (or placeholder)
                    const courseText = document.createElement("span");
                    const course = semester.courses[row];
                    const courseName = course ? `${course.course_code} ${course.name}` : "Core or Elective";
                    courseText.textContent = courseName;
    
                    // Create an "Edit" button
                    const editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.classList.add("edit-button"); // Add a CSS class for styling
    
                    // Add click listener
                    editButton.addEventListener("click", () => editCourse(course));
    
                    cellDiv.appendChild(courseText);
                    cellDiv.appendChild(editButton);
                    td.appendChild(cellDiv);
    
                    tr.appendChild(td);
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

    async function editCourse(course) {
        let existingCard = document.getElementById("message");
        if (existingCard) {
            existingCard.remove(); 
        }
        
        const messageContainer = document.createElement("div");
        messageContainer.id = "message";
        messageContainer.className = "message-container";
    
       //card body
        const card = document.createElement("div");
        card.className = "card";
    
        // card header 
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header text-white d-flex justify-content-between align-items-center";
        
        // Header text
        const headerText = document.createElement("span");
        headerText.textContent = "Edit Course";
    
        // Close button
        const closeButton = document.createElement("button");
        closeButton.className = "btn-close btn-close-white";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            messageContainer.remove(); 
        });
    
        // Append header elements
        cardHeader.appendChild(headerText);
        cardHeader.appendChild(closeButton);
    
        // card body with the course details
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        
        const courseMessage = document.createElement("p");
        courseMessage.textContent = `To replace: ${course?.course_code || ""}  ${course?.name || "Core or Elective"} select a new class and then click Swap?`;
    
        // Add the course search input
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.id = "course-search";
        searchInput.className = "form-control";
        searchInput.placeholder = "Search for a course...";
        searchInput.onkeyup = () => searchCourses(); 
    
        // Create a list for displaying courses
        const courseList = document.createElement("ul");
        courseList.id = "course-list";
        courseList.className = "list-group mt-3";
    
        // Fetch and display courses
        const courses = await fetchCourses();
    
        function displayCourses(courses) {
            courseList.innerHTML = ''; 
            courses.forEach(course => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item");
                listItem.textContent = `${course.course_code} - ${course.name}`;
                listItem.onclick = () => selectCourse(course, listItem);
                courseList.appendChild(listItem);
            });
        }
    
        // Function to handle course selection
        function selectCourse(course, listItem) {
            const selectedItem = document.querySelector(".list-group-item.selected");
            if (selectedItem) {
                selectedItem.classList.remove("selected");
            }
    
            // Add highlight to the selected course
            listItem.classList.add("selected");
            const swapButton = document.getElementById("swapButton");
            swapButton.disabled = false;  // Enable the button when a course is selected

            document.getElementById("swapButton").addEventListener("click", function() {
                const selectedCourse = document.querySelector(".list-group-item.selected");
                if (selectedCourse) {
                    console.log('Swapping course:', selectedCourse.textContent);
                    //SWAP COURSE HERE
                } else {
                    console.log('No course selected.');
                }
            });
        
            console.log('Selected Course:', course);
   
        }

      
        // Search function
        function searchCourses() {
            const searchTerm = searchInput.value.toLowerCase();
            const courseListItems = document.querySelectorAll("#course-list .list-group-item");
    
            courseListItems.forEach(item => {
                const courseName = item.textContent.toLowerCase();
                item.style.display = courseName.includes(searchTerm) ? "" : "none";
            });
        }
    
        // Button to handle editing
        const editButton = document.createElement("button");
        editButton.className = "btn btn-primary";
        editButton.id ="swapButton"
        editButton.textContent = "Swap";
        editButton.disabled = true;

        const listContainer = document.createElement("div");
        listContainer.className = "course-list-container";
        listContainer.appendChild(searchInput);
        listContainer.appendChild(courseList);

        // div to hold the Swap button 
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        buttonContainer.appendChild(editButton);
    
        cardBody.appendChild(courseMessage);
        cardBody.appendChild(listContainer); 
        cardBody.appendChild(buttonContainer); 
    
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        messageContainer.appendChild(card);

        document.body.appendChild(messageContainer);

        displayCourses(courses);
    }
    
    async function fetchCourses() {
        try {
            const response = await fetch('/courses');
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const courses = await response.json();
            return courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Error fetching courses. Please try again later.');
            return [];
        }
    }

}) ();