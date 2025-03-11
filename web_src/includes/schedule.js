"use strict";

(function () {
    window.addEventListener("load", init);
    
    function init() {
        const user_id = window.sessionStorage.getItem('id');
        if (user_id){ // If the user is logged in, otherwise show default square things - use for report page
            displaySchedules();
        }
    }

    // Description here
    async function displaySchedules() {
        try {
            const response = await fetch('/schedule-view');
            const schedules = await response.json();
            // Error handling?
            const schedulesContainer = document.querySelector('.schedules'); // Gets schedule SECTION
            schedulesContainer.innerHTML = ''; // Clear it?

            // If schedules doesn't return anything
            if (schedules.length === 0) {
                schedulesContainer.innerHTML = '<p>No schedules found.</p>';
                // schedulesContainer.classList.add("hidden");
                return;
            }

            schedules.forEach(schedule => {
                const scheduleDiv = document.createElement('div');
                scheduleDiv.classList.add('Schedule');
                // If there's an img, create tag
                // let imgHTML = '';
                // if (schedule.img) {
                //     imgHTML = `<img src="data:image/png;base64,${schedule.img}" class="Schedule_display"`;
                // }
                scheduleDiv.innerHTML = 
                `<div class="Schedule_display"></div>
                <h5 class="title">${schedule.name}</h5>
                <div class="sched_btn">
                    <button type="button" class="btn btn-primary view-sched-btn" data-id="${schedule.id}">View</button>
                    <button type="button" class="btn btn-primary del-sched-btn" style="margin-left:4px;background-color:red" data-id="${schedule.id}">Delete</button>
                </div>`;
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
        const schedule_id = event.target.getAttribute("data-id");
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
        const schedule_id = event.target.getAttribute("data-id");
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