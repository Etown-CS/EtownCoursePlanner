(function () {
    "use strict";

    window.addEventListener("DOMContentLoaded", init);
    
    function init() {
        displaySchedules();
        const email = window.sessionStorage.getItem('email');
        $('#navbar').load('includes/navbar.html', function() {
            // Now that the navbar is loaded, check for the current page and apply "active" class
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            })
            if (email) {
                document.getElementById("li-pfp").classList.remove("hidden");
                document.getElementById("pfp").classList.add("hidden");

                document.getElementById("li-home").classList.remove("hidden");
                document.getElementById("home").classList.add("hidden");
            }  else {
                // If no email, make sure the profile pictures are in the default state
                document.getElementById("li-pfp").classList.add("hidden");
                document.getElementById("pfp").classList.remove("hidden");

                document.getElementById("home").classList.remove("hidden");
                document.getElementById("li-home").classList.add("hidden");
            }

            document.getElementById("logout-btn").addEventListener("click", function() {
                window.sessionStorage.clear();
                location.assign('../index.html');
            });
        });


        async function displaySchedules() {
            try {
                const response = await fetch('/schedule-view');
                const schedules = await response.json();
                const recentContainer = document.querySelector('#Recent .card1'); // Selects the .card1 div inside #Recent
                recentContainer.innerHTML = ''; // Clear it
        
                if (schedules.length === 0) {
                    recentContainer.innerHTML = '<p>No schedules found. Create New!</p>';
                    return;
                }
        
                // Show only up to 3 schedules
                const maxSchedules = schedules.reverse().slice(0, 3);
        
                maxSchedules.forEach(schedule => {
                    const scheduleDiv = document.createElement('div');
                    scheduleDiv.classList.add('schedule-card');
        
                    let imgHTML = '';
                    if (schedule.img) {
                        imgHTML = `<img src="data:image/jpeg;base64,${schedule.img}" class="schedule-image" alt="Schedule Image">`;
                    }
        
                    scheduleDiv.innerHTML = `
                        <div class="schedule-content">
                            <h5 class="schedule-title">${schedule.name}</h5>
                            ${imgHTML}
                            <div class="schedule-actions">
                                <button type="button" class="btn btn-outline-primary view-sched-btn" data-id="${schedule.id}">
                                    <i class="fa fa-eye"></i> View
                                </button>
                            </div>
                        </div>
                    `;
        
                    recentContainer.appendChild(scheduleDiv);
                });
        
                document.querySelectorAll(".view-sched-btn").forEach(button => {
                    button.addEventListener("click", loadSchedule);
                });
            
            } catch (error) {
                console.error('Error loading schedules:', error);
                const recentContainer = document.querySelector('#Recent .card1');
                recentContainer.innerHTML = '<p>Failed to load schedules. Please try again later.</p>';
            }
        }

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



        // Load the footer
        $('#footer').load('includes/footer.html');
    }   
})();