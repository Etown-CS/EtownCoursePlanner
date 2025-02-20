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
            const response = await fetch("/schedule-view");
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

            //schedulesContainer.classList.remove('hidden');
            
            schedules.forEach(schedule => {
                const scheduleDiv = document.createElement('div');
                scheduleDiv.classList.add('Schedule');

                scheduleDiv.innerHTML = 
                `<div class="Schedule_display"></div>
                <h5 class="title">${schedule.name}</h5>
                <div class="sched_btn">
                    <button type="button" class="btn btn-primary view-sched-btn" data-id="${schedule.id}">View</button>
                </div>`;
                schedulesContainer.appendChild(scheduleDiv);
                // export const schedule_id = schedule.id BUT NOT in loop
            });

            // Add event listeners?
            document.querySelectorAll(".view-sched-btn").forEach(button => {
                button.addEventListener("click", loadSchedule);
            });
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    }


    // Send only schedule ID to a get request and then fetch the get request to create.js
    // EXPORT IT EXPORT IT EXPORT VARIABLE
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

            // Redirect user to create.html - Sent with given schedule ID
            // window.location.href = "createSchedule.html"
                // or `createSchedule.html?schedule_id=${schedule_id}`;

        

            // Save to session storage?
            // sessionStorage.setItem("loadedSchedule", JSON.stringify(savedEvents));
            // // Redirect user to calendar
            // window.location.href = "create.html"; // May have to change -- Testing -- GCP :(
            // /* For later use: 
            // if (sessionStorage.getItem("loadedSchedule")) {
            // Object.assign(events, JSON.parse(sessionStorage.getItem("loadedSchedule")));
            // sessionStorage.removeItem("loadedSchedule");
            // updateTimeRange(); 
            // }*/
            window.location.href = "create.html"; // May have to change for GCP
        } catch (error) {
            console.error("Error");
        }
    }

}) ();