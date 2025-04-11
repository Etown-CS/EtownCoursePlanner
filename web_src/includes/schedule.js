"use strict";

(function () {
    window.addEventListener("load", init);
    
    function init() {
       
        

        const user_id = window.sessionStorage.getItem('id');
        if (user_id){ // If the user is logged in, otherwise show default square things - use for report page
            let sortOption = 'newest';  // Default value
        displaySchedules(sortOption);
            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (event) => {
                    const sortOption = event.target.textContent.trim().toLowerCase(); // 'newest' or 'oldest'
                    console.log("Sort option selected:", sortOption);  // Check this in your browser's console
                    displaySchedules(sortOption);
                });
            });
        } else {
            // Clear the schedules
            schedulesContainer.innerHTML = '';
            schedulesContainer.innerHTML = '<p>No schedules found. Create New!</p>';

        }
        document.getElementById("createNew").addEventListener("click", function() {
            // Redirect to the desired page
            window.location.href = "create.html"; // Replace 'newPage.html' with your desired URL
            sessionStorage.removeItem("selectedSchedule");
        });
    }
    

    // Description here
    async function displaySchedules(sortBy) {
        try {
            const response = await fetch('/schedule-view');
            const schedules = await response.json();
            // Error handling?
            const schedulesContainer = document.querySelector('.schedules'); // Gets schedule SECTION
            schedulesContainer.innerHTML = ''; // Clear it?

            // If schedules doesn't return anything
            if (schedules.length === 0) {
                schedulesContainer.innerHTML = '<p>No schedules found. Create New!</p>';
                // schedulesContainer.classList.add("hidden");
                return;
            }

                // Sort schedules based on the sortBy parameter
            if (sortBy === 'newest') {
                schedules.reverse();  // Reverse to show the newest first
            } else if (sortBy === 'oldest') {
                // No change needed if the original order is from oldest to newest
                // If necessary, reverse again to restore the original order;  
            }

            schedules.forEach(schedule => {
                const scheduleDiv = document.createElement('div');
                scheduleDiv.classList.add('schedule-card'); // Added a new class for styling
            
                let imgHTML = '';
                if (schedule.img) {
                    imgHTML = `<img src="data:image/jpeg;base64,${schedule.img}" class="schedule-image" alt="Schedule Image">`;
                }
            
                scheduleDiv.innerHTML = `
                    <div class="schedule-content">
                        <h5 class="schedule-title">${schedule.name}</h5> <!-- Title comes first -->
                        ${imgHTML}
                        <div class="schedule-actions">
                            <button type="button" class="btn btn-outline-primary view-sched-btn" data-id="${schedule.id}">
                                <i class="fa fa-eye"></i> View
                            </button>
                            <button type="button" class="btn btn-outline-danger del-sched-btn" data-id="${schedule.id}">
                                <i class="fa fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            
                schedulesContainer.appendChild(scheduleDiv);
            });
            
            

            // Add event listeners?
            document.querySelectorAll(".view-sched-btn").forEach(button => {
                button.addEventListener("click", loadSchedule);
            });
            document.querySelectorAll(".del-sched-btn").forEach(button => {
                button.addEventListener("click", deleteSchedule);
            });
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    }


    // Send only schedule ID to a get request and then fetch the get request to create.js
    // Description here
    async function loadSchedule(event) {
        const schedule_id = event.currentTarget.getAttribute("data-id");
        if (!schedule_id) {
            console.error("Schedule ID is missing.");
            return;
        }

        try {
            // const response = await fetch(`/load-schedule?schedule_id=${schedule_id}`);
            // const schedule = await response.json();
            // console.log("Schedule to be loaded:", schedule);
            sessionStorage.setItem("selectedSchedule", JSON.stringify(schedule_id));
            window.location.href = "create.html"; // May have to change for GCP
        } catch (error) {
            console.error("Error in loading schedule:", error);
        }
    }

    // Add description here for deleting stuff
    async function deleteSchedule(event) {
        const user_id = window.sessionStorage.getItem('id');
        const schedule_id = event.currentTarget.getAttribute("data-id");
        if (!user_id) {
            console.error("User not logged in.");
            return;
        }
        if (!schedule_id) {
            console.error("Schedule ID is missing.");
            return;
        }
        try {
            const response = await fetch('/delete-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({user_id, schedule_id})
            });
        
            const result = await response.json();
            if (response.ok) { // Checks if successful
                alert(result.message);
                window.location.reload();
            } else {
                alert(result.message || "Error deleting schedule.");
            }
        } catch (error) {
            console.error("Error in deleting schedule:", error);
        }
    }

}) ();