(function () {
    "use strict";

    window.addEventListener("load", init);
    let eventNum =0;

    function init() {
        $('#navbar').load('includes/navbar.html', function() {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            });
        });
    

        updateTimeRange();

        const schedule_id = JSON.parse(sessionStorage.getItem("selectedSchedule"));
        if (schedule_id) {
            //console.log("Loaded schedule:", schedule);
            fetchSavedSchedule(schedule_id)
            //sessionStorage.removeItem("selectedSchedule"); // go away BUT NOT YET
        }

        // document.getElementById("add").addEventListener("click", addEvent);
        document.getElementById("msg_btn").addEventListener("click", msgBox);
        document.getElementById("manual_add").addEventListener("click", addEvent2);
        // document.getElementById("delete-selected").addEventListener("click", deleteSelectedEvents); // TODO fix this so it doesnt error when no event is present
        document.getElementById("save").addEventListener("click", saveSchedule);

        let isGenerating = false; // Prevent multiple clicks
    
        document.getElementById("generate_screenshot").addEventListener("click", function() {
            if (isGenerating) return; // Prevent further clicks while generating the screenshot
            isGenerating = true; // Set to true to prevent further clicks
    
            const scheduleContainer = document.getElementById("schedule-container");
            const titleText = document.getElementById("schedule-title").value || "My Schedule";
    
            // Check if the title element already exists and remove it if it does
            const existingTitle = scheduleContainer.querySelector(".schedule-title");
            if (existingTitle) {
                existingTitle.remove();
            }

            //Title for screenshot
            let titleElement = document.createElement("div");
            titleElement.innerText = titleText;
            titleElement.classList.add("schedule-title"); 

            // Insert title at the top of the screenshot
            scheduleContainer.prepend(titleElement);

            // Wait for the title to be rendered before capturing the screenshot
            setTimeout(() => {
                html2canvas(scheduleContainer, {
                    backgroundColor: null // stays transparent
                }).then(canvas => {
                    // Use the title text for the filename, replacing spaces with no spaces
                    let sanitizedTitle = titleText.replace(/\s+/g, '');
                    let fileName = sanitizedTitle + '.png'; // File name based on title

                    let link = document.createElement('a');
                    link.href = canvas.toDataURL("image/png");
                    link.download = fileName; // Sets filename
                    link.click();

                    // Remove the title after capturing the screenshot
                    titleElement.remove();

                    // Re-enable button and allow further clicks
                    isGenerating = false;
                });
            }, 500); // Wait 500ms for the browser to render
        });
    }

    let hasUnsavedChanges = false;
    // Track changes when user modifies schedule
    function markUnsavedChanges() {
        hasUnsavedChanges = true;
    }
    // Listen for input or change events to track modifications (Reacher)
    document.addEventListener("input", markUnsavedChanges);
    document.addEventListener("change", markUnsavedChanges);

    window.addEventListener("beforeunload", (event) => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = ""; // Required for some browsers? says internet
        }
    });
    // Custom confirmation when user clicks a link or tries to navigate
    window.addEventListener("click", (event) => {
        if (hasUnsavedChanges && event.target.tagName === "A") { // Checks for changes and if anchor tag was activated
            event.preventDefault(); // Stop in the name of the law
            showLeavePopup(event.target.href);
        }
    });
    function showLeavePopup(redirectUrl) { // Hold on, wait a minute - Willow
        const leavePage = confirm("You may have unsaved changes. Are you sure you want to leave?"); // Be polite
        if (leavePage) {
            hasUnsavedChanges = false; // Reset changes to avoid looper
            sessionStorage.removeItem("selectedSchedule"); // Be gone satan
            window.location.href = redirectUrl; // Navigate to new page
        }
    }

    const events = { // Events holds all the classes saved for each day. All days (including events in once dict)
        'Sunday': [],
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': []
    };
   
    function displayTimes(startTime, endTime) {
        const timeColumn = document.getElementById('time-column');
        timeColumn.innerHTML = '';

        let currentTime = startTime;
        while (currentTime.isBefore(endTime)) {
            const hourSlot = document.createElement('div');
            hourSlot.className = 'hour-slot';
            hourSlot.innerText = currentTime.format('h A');
            timeColumn.appendChild(hourSlot);
            currentTime = currentTime.add(1, 'hour');
        }
    }

    function displayWeek(startTime, endTime) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const header = document.getElementById('header');
        header.innerHTML = ''; // Clear the header

        // Add "Time" header to align with time column
        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-header';
        timeHeader.textContent = 'Time';
        header.appendChild(timeHeader);

        // Append day headers to the header row
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            header.appendChild(dayHeader);
        });

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; // Clear the calendar

        // Append each day column to the calendar row
        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-column';

            displayEvents(day, dayDiv, startTime, endTime);
            calendar.appendChild(dayDiv);
        });
    }

    function displayEvents(day, dayDiv, defaultStartTime, defaultEndTime) {
        const dayEvents = events[day];
        dayDiv.innerHTML = ''; // Clear the previous events to prevent duplicates
        dayEvents.forEach((event, index) => {
            const eventStart = dayjs().hour(event.startTime.split(":")[0]).minute(event.startTime.split(":")[1]);
            const eventEnd = dayjs().hour(event.endTime.split(":")[0]).minute(event.endTime.split(":")[1]);
    
            const totalHours = defaultEndTime.diff(defaultStartTime, 'hour');
            const pixelsPerHour = 60;
    
            const topPosition = (eventStart.diff(defaultStartTime, 'minute') / 60) * pixelsPerHour;
            const eventHeight = (eventEnd.diff(eventStart, 'minute') / 60) * pixelsPerHour;
    
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.backgroundColor = event.color || '#defaultColor'; // Apply the color
            eventDiv.style.top = `${topPosition}px`;
            eventDiv.style.height = `${eventHeight}px`;
         // Add time range
    const timeRange = document.createElement('div');
    timeRange.textContent = `${event.startTime} - ${event.endTime}`;
    eventDiv.appendChild(timeRange);

    // Add event title on a new line
    const title = document.createElement('div');
    title.textContent = event.title;
    eventDiv.appendChild(title);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.innerHTML = "&times;"; // HTML entity for '×'
            deleteButton.className = "delete-event"; 
            deleteButton.style.position = "absolute";
            deleteButton.style.top = "1px";
            deleteButton.style.right = "1px";
            deleteButton.style.background = "transparent";
            deleteButton.style.border = "none";
            deleteButton.style.color = "white"; // Optional: Choose a color for the 'X'
            deleteButton.style.cursor = "pointer";
            deleteButton.style.fontSize = "16px";
            deleteButton.addEventListener('click', function () {
                deleteEvent(event.eventNum);
            });
            eventDiv.appendChild(deleteButton);
            dayDiv.appendChild(eventDiv);
        });
    }

    function deleteEvent(eventN) {
        let eventNumToRemove = eventN;
        for (let day in events) {
            // Remove the event from the current day's array if eventNum matches
            events[day] = events[day].filter(event => event.eventNum !== eventNumToRemove);
        }
        console.log(events);
        updateTimeRange();
}

    function updateTimeRange() {
        let minTime = dayjs().hour(8).minute(0);
        let maxTime = dayjs().hour(18).minute(0);

        Object.values(events).forEach(dayEvents => {
            dayEvents.forEach(event => {
                const eventStart = dayjs().hour(event.startTime.split(":")[0]).minute(event.startTime.split(":")[1]);
                const eventEnd = dayjs().hour(event.endTime.split(":")[0]).minute(event.endTime.split(":")[1]);

                if (eventStart.isBefore(minTime)) minTime = eventStart;
                if (eventEnd.isAfter(maxTime)) maxTime = eventEnd;
            });
        });

        displayTimes(minTime, maxTime);
        displayWeek(minTime, maxTime);
    }

    function addEvent() {
        const titleInput = document.getElementById('event-title');
        const startTimeInput = document.getElementById('event-start-time');
        const endTimeInput = document.getElementById('event-end-time');
        const colorPicker = document.getElementById('favcolor');
    
        const title = titleInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const selectedColor = colorPicker.value;
    
        if (!title || !startTime || !endTime) {
            alert("Please fill in all fields.");
            return;
        }
    
        const startTimeParsed = dayjs(startTime, 'HH:mm');
        const endTimeParsed = dayjs(endTime, 'HH:mm');
    
        if (startTimeParsed.isAfter(endTimeParsed)) {
            alert("Start time cannot be after end time.");
            return;
        }
    
        const selectedDays = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            const checkbox = document.getElementById(day.toLowerCase());
            if (checkbox.checked) {
                selectedDays.push(day);
            }
        });
    
        if (selectedDays.length === 0) {
            alert("Please select at least one day.");
            return;
        }
        
        selectedDays.forEach(day => { // FORMATTING IS HERE - LOOK HERE!!!!!!!!!!!!!!!!
            events[day].push({ title, startTime, endTime, color: selectedColor, eventNum});
        });
        eventNum++; // TODO: Move inside loop?

        titleInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
    
        updateTimeRange();
    }

    async function saveSchedule() { 
        const scheduleName = document.getElementById("schedule-title").value;
        const user_id = window.sessionStorage.getItem('id');
        const schedule_id = JSON.parse(sessionStorage.getItem("selectedSchedule")); // get data from session storage -- but then when to destroy? idk 
        if (!user_id) {
            alert("Error: No user logged in.");
            return;
        }
        if (!scheduleName) {
            alert("Please enter a schedule name.");
            return;
        }

        try {
            // Get schedule screenshot as Blob
            // const canvas = await html2canvas(document.getElementById('schedule-container'));
            // canvas.toBlob(async (blob) => { // Remember to change img column to longblob
            //     // Append Blob image to FormData
            //     const formData = new FormData();
            //     formData.append("user_id", user_id);
            //     formData.append("schedule_id", schedule_id ?? null);
            //     formData.append("scheduleName", scheduleName);
            //     formData.append("events", JSON.stringify(events));
            //     formData.append("image", blob, "schedule.png"); // Get associated title?

            //     const response = await fetch('/save-schedule', {
            //         method: 'POST',
            //         body: formData, // FormData sets headers automatically
            //     });

            //     const result = await response.json();
            //     if (result.ok) {
            //         alert(result.message);
            //     } else {
            //         alert(result.error || "Error saving schedule. :(");
            //     }
            // }, "image/png");

            const data = {
                user_id,
                schedule_id: schedule_id ?? null, // If schedule_id is null or undefined, send null
                scheduleName,
                events
            };

            // If selectedSchedule (sessionStorage) exists call other API || add id (empty or not) to body
            const response = await fetch('/save-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        
            const result = await response.json();
            //console.log(result.status);
            console.log(result)
            if (response.ok) { // Checks if successful
                alert(result.message);
            } else {
                alert(result.message || "Error saving schedule. :(");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function fetchSavedSchedule(schedule_id) {
        try {
            const response = await fetch(`/load-schedule?schedule_id=${schedule_id}`);
            if (!response.ok) {
                console.error("Failed response for loading schedule.");
            }
            const {schedule_name, courses} = await response.json();
            console.log("Fetched schedule:", schedule_name, courses);
            // Put up the schedule title again
            //console.log(document.getElementById("schedule-title"));
            document.getElementById("schedule-title").value = schedule_name; // Displays name with VALUE
            // What's the point of inner whatever?

            // Remake courses - whyyyyyy
            courses.forEach(row => {
                const days = row.days.split(","); // Convert to array
                days.forEach(day => {
                    if (events[day]) {
                        events[day].push({
                            title: row.custom_name, // Course id - row.course_id
                            startTime: row.custom_start,
                            endTime: row.custom_end,
                            color: row.color,
                            eventNum: eventNum++
                        }); // Twas actually much easier than inserting
                    }
                });
            });
            updateTimeRange(); // Refresh UI?
        } catch (error) {
            console.error("Error fetching saved schedule:", error);
        }
    }

    function msgBox() {
            // Check if the card already exists
        let existingCard = document.getElementById("message-container");
        if (existingCard) {
            existingCard.remove(); // Remove the old card to avoid duplicates
        }

        // Create the container for the card
        const messageContainer = document.createElement("div");
        messageContainer.id = "message-container";
    
        // Add Bootstrap container classes for styling
        messageContainer.className = "container";

        // Create the card
        const card = document.createElement("div");
        card.className = "card";

        // Create the card header with a close (X) button
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header text-white d-flex justify-content-between align-items-center";
        
        // Header text
        const headerText = document.createElement("span");
        headerText.textContent = "Message";

        // Close (X) button
        const closeButton = document.createElement("button");
        closeButton.className = "btn-close btn-close-white";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            messageContainer.remove(); // Remove the card on close
        });

        // Append text and close button to the header
        cardHeader.appendChild(headerText);
        cardHeader.appendChild(closeButton);

        // Create the card body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardText = document.createElement("textarea");
        cardText.className = "card-text";
        cardText.id = "advisorMessage"
        cardText.placeholder = "Type your message here";

        // Create the send button
        const sendButton = document.createElement("button");
        sendButton.className = "btn btn-secondary";
        sendButton.id = "sendBtn"
        sendButton.textContent = "Send";
        sendButton.style.marginTop = "10px";
        sendButton.addEventListener("click", sendEmail);

        // Assemble the card
        cardBody.appendChild(cardText);
        cardBody.appendChild(sendButton);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        messageContainer.appendChild(card);

        // Append the card to the body
        document.body.appendChild(messageContainer);
    }

    function addEvent2() {
        console.log("made it into event function 2");
        let existingCard = document.getElementById("message-container2");
        if (existingCard) {
            existingCard.remove(); // Remove the old card to avoid duplicates
        }
    
        // Create the container for the card
        const messageContainer = document.createElement("div");
        messageContainer.id = "message-container2";
        messageContainer.className = "container";
    
        // Create the card
        const card = document.createElement("div");
        card.className = "card";
    
        // Create the card header
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header text-white d-flex justify-content-between align-items-center";
        const headerText = document.createElement("span");
        headerText.textContent = "Message";
    
        const closeButton = document.createElement("button");
        closeButton.className = "btn-close btn-close-white";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            messageContainer.remove();
        });
    
        cardHeader.appendChild(headerText);
        cardHeader.appendChild(closeButton);
    
        // Create the card body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
    
        const eventFormHTML = `
            <h2>Manual Add</h2>
            <label>Select Days:</label><br>
            <input type="checkbox" id="sunday" value="Sunday"> Sunday<br>
            <input type="checkbox" id="monday" value="Monday"> Monday<br>
            <input type="checkbox" id="tuesday" value="Tuesday"> Tuesday<br>
            <input type="checkbox" id="wednesday" value="Wednesday"> Wednesday<br>
            <input type="checkbox" id="thursday" value="Thursday"> Thursday<br>
            <input type="checkbox" id="friday" value="Friday"> Friday<br>
            <input type="checkbox" id="saturday" value="Saturday"> Saturday<br>
            <br>
            <label for="event-start-time">Start Time:</label>
            <input type="time" id="event-start-time" placeholder="Start Time">
            <label for="event-end-time">End Time:</label>
            <input type="time" id="event-end-time" placeholder="End Time">
            <label for="event-title">Event Title:</label>
            <input type="text" id="event-title" placeholder="Event Title">
            <label for="favcolor">Select a color:</label>
            <input type="color" id="favcolor" value="#ff0000">
            <button id="add">Add Event</button>
        `;
        cardBody.innerHTML = eventFormHTML;
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        messageContainer.appendChild(card);
    
        document.body.appendChild(messageContainer);
        document.getElementById("add").addEventListener("click", () => {
            addEvent();
            messageContainer.remove(); // Remove the card on close
        });
    }
        
    
    document.addEventListener('DOMContentLoaded', () => {
        displayTimes(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
        displayWeek(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
    });

    async function fetchApiKey() {
        try {
          const response = await fetch('/api/get-key');
          if (!response.ok) {
            throw new Error('Failed to fetch API key');
          }
          const data = await response.json();
          return data.apiKey;
        } catch (error) {
          console.error('Error fetching API key:', error);
        }
      }

      async function getAdvisorsEmails() {
        
        try {
            const advisor_id = window.sessionStorage.getItem('advisor');
            console.log(advisor_id);

            const response = await fetch('/advisors/emails'); // Send GET request
            if (!response.ok) throw new Error("Failed to fetch advisors.");
    
            const advisors = await response.json();
            console.log(advisors); // Logs an array of advisors with names, IDs, and emails
    
            // Example: Find an advisor's email by ID
             // Change to the desired advisor name
             const advisor = advisors.find(a => a.id === Number(advisor_id));
            
            if (advisor) {
                console.log('id:',advisor.id)
                console.log(`Advisor Email: ${advisor.email}`);
            } else {
                console.log("Advisor not found.");
            }
            
        } catch (error) {
            console.error("Error fetching advisors:", error);
        }
    }
      
      async function sendEmail() {
        const message = document.getElementById("advisorMessage").value;
      
        // Fetch the API key
        const API_KEY = await fetchApiKey();
        if (!API_KEY) {
          console.error("API key is not available");
          return;
        }

        getAdvisorsEmails()
      
        const url = "https://api.brevo.com/v3/smtp/email";
        // Email data
        const emailData = {
          sender: { name: name, email: "EtownCoursePlanner@gmail.com" },
          to: [{ email: "melissa_patton@outlook.com", name: advisor }],
          subject: "Advising Message",
          htmlContent: message
        };
      
        // Send email using fetch
        console.log(API_KEY);
        fetch(url, {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": API_KEY,
            "content-type": "application/json"
          },
          body: JSON.stringify(emailData)
        })
        .then(response => response.json())  // Parse response as JSON to check the result
        .then(data => {
          if (data && data.messageId) {
            console.log("Email sent successfully! Message ID: ", data.messageId);
          } else {
            console.error("Failed to send email: ", data);
          }
        })
        .catch(error => {
          console.error("Error sending email:", error);
        });
      }
})();