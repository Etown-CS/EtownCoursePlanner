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
        document.getElementById("msg_btn").addEventListener("click", msgBox);
        document.getElementById("manual_add").addEventListener("click", addEvent2);
    
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
    
            // Create a stylized title element
            let titleElement = document.createElement("div");
            titleElement.innerText = titleText;
            titleElement.classList.add("schedule-title"); // Add a class for easier identification
            titleElement.style.position = "relative";
            titleElement.style.margin = "10px auto";
            titleElement.style.fontSize = "24px";
            titleElement.style.fontWeight = "bold";
            titleElement.style.padding = "10px";
            titleElement.style.color = "#ffffff";
            titleElement.style.backgroundColor = "#004080"; // Etown blue
            titleElement.style.borderRadius = "8px";
            titleElement.style.textAlign = "center";
            titleElement.style.width = "fit-content";
            titleElement.style.display = "block";

            // Insert title at the top of the schedule
            scheduleContainer.prepend(titleElement);
    
            // Wait for the title to be rendered before capturing the screenshot
            setTimeout(() => {
                html2canvas(scheduleContainer, {
                    backgroundColor: null // Keeps transparency
                }).then(canvas => {
                    // Use the title text for the filename, replacing spaces with no spaces
                    let sanitizedTitle = titleText.replace(/\s+/g, '');
                    let fileName = sanitizedTitle + '.png'; // File name based on title
    
                    let link = document.createElement('a');
                    link.href = canvas.toDataURL("image/png");
                    link.download = fileName; // Set the custom file name
                    link.click();
    
                    // Remove the title after capturing the screenshot
                    titleElement.remove();
    
                    // Re-enable button and allow further clicks
                    isGenerating = false;
                });
            }, 500); // Wait 500ms for the browser to render
        });
    }
    
    document.addEventListener("DOMContentLoaded", init);
    
    
    
    
    

    const events = {
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
        
            const pixelsPerHour = 60;
            const topPosition = (eventStart.diff(defaultStartTime, 'minute') / 60) * pixelsPerHour;
            const eventHeight = (eventEnd.diff(eventStart, 'minute') / 60) * pixelsPerHour;
        
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.backgroundColor = event.color || '#cccccc'; // fallback color if needed
            eventDiv.style.top = `${topPosition}px`;
            eventDiv.style.height = `${eventHeight}px`;
        
            // Add time range and title
            const timeRange = document.createElement('div');
            timeRange.textContent = `${event.startTime} - ${event.endTime}`;
            eventDiv.appendChild(timeRange);
        
            const title = document.createElement('div');
            title.textContent = event.title;
            eventDiv.appendChild(title);
        
            // // Create the delete button
            // const deleteButton = document.createElement('button');
            // deleteButton.textContent = "×"; // or "Delete"
            // deleteButton.className = "delete-event"; 
            // deleteButton.style.position = "absolute";
            // deleteButton.style.top = "1px";
            // deleteButton.style.right = "1px";
            // deleteButton.style.cursor = "pointer";
            // deleteButton.addEventListener('click', function () {
            //     deleteEvent(event.eventNum);
            // });
            // eventDiv.appendChild(deleteButton);
        

            // Create and append the edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-event');
            editButton.addEventListener('click', function() {
            editEvent(event.eventNum);
            });
            eventDiv.appendChild(editButton);

            // Append the event to the day column
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

    function editEvent(eventNum) {
        // Find the event details and the days on which it exists.
        let eventDetails = null;
        let daysForEvent = [];
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (let day of daysOfWeek) {
            events[day].forEach(ev => {
                if (ev.eventNum === eventNum) {
                    eventDetails = ev; // assume each occurrence has the same details
                    if (!daysForEvent.includes(day)) {
                        daysForEvent.push(day);
                    }
                }
            });
        }
        if (!eventDetails) return; // No event found
        
        // Remove any existing manual add/edit form
        let existingCard = document.getElementById("message-container2");
        if (existingCard) {
            existingCard.remove();
        }
        
        // Create the container for the edit form (similar to addEvent2)
        const messageContainer = document.createElement("div");
        messageContainer.id = "message-container2";
        messageContainer.className = "container";
        
        const card = document.createElement("div");
        card.className = "card";
        
        // Card Header with Close Button
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header text-white d-flex justify-content-between align-items-center";
        const headerText = document.createElement("span");
        headerText.textContent = "Edit Event";
        
        const closeButton = document.createElement("button");
        closeButton.className = "btn-close btn-close-white";
        closeButton.setAttribute("aria-label", "Close");
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => {
            messageContainer.remove();
        });
        
        cardHeader.appendChild(headerText);
        cardHeader.appendChild(closeButton);
        
        // Card Body with the pre-populated form
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        
        // Build the HTML for the form; checkboxes will be checked if the event exists on that day.
        let formHTML = `
            <h2>Edit Event</h2>
            <label>Select Days:</label><br>
            <input type="checkbox" id="sunday" value="Sunday" ${daysForEvent.includes("Sunday") ? "checked" : ""}> Sunday<br>
            <input type="checkbox" id="monday" value="Monday" ${daysForEvent.includes("Monday") ? "checked" : ""}> Monday<br>
            <input type="checkbox" id="tuesday" value="Tuesday" ${daysForEvent.includes("Tuesday") ? "checked" : ""}> Tuesday<br>
            <input type="checkbox" id="wednesday" value="Wednesday" ${daysForEvent.includes("Wednesday") ? "checked" : ""}> Wednesday<br>
            <input type="checkbox" id="thursday" value="Thursday" ${daysForEvent.includes("Thursday") ? "checked" : ""}> Thursday<br>
            <input type="checkbox" id="friday" value="Friday" ${daysForEvent.includes("Friday") ? "checked" : ""}> Friday<br>
            <input type="checkbox" id="saturday" value="Saturday" ${daysForEvent.includes("Saturday") ? "checked" : ""}> Saturday<br>
            <br>
            <label for="event-start-time">Start Time:</label>
            <input type="time" id="event-start-time" placeholder="Start Time" value="${eventDetails.startTime}">
            <label for="event-end-time">End Time:</label>
            <input type="time" id="event-end-time" placeholder="End Time" value="${eventDetails.endTime}">
            <label for="event-title">Event Title:</label>
            <input type="text" id="event-title" placeholder="Event Title" value="${eventDetails.title}">
            <label for="favcolor">Select a color:</label>
            <input type="color" id="favcolor" value="${eventDetails.color}">
            <button id="saveEdit">Save Changes</button>
        `;
        cardBody.innerHTML = formHTML;
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        messageContainer.appendChild(card);
        document.body.appendChild(messageContainer);
        
        // Add an event listener for saving the changes.
        document.getElementById("saveEdit").addEventListener("click", function(){
            updateEditedEvent(eventNum);
            messageContainer.remove(); // Remove the edit form after saving.
        });
    }

    function updateEditedEvent(eventNum) {
        const title = document.getElementById('event-title').value;
        const startTime = document.getElementById('event-start-time').value;
        const endTime = document.getElementById('event-end-time').value;
        const selectedColor = document.getElementById('favcolor').value;
        
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
        
        // Determine which days are selected.
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let selectedDays = [];
        days.forEach(day => {
             const checkbox = document.getElementById(day.toLowerCase());
             if (checkbox && checkbox.checked) {
                 selectedDays.push(day);
             }
        });
        
        if (selectedDays.length === 0) {
             alert("Please select at least one day.");
             return;
        }
        
        // Update the events object: For each day, remove any event with eventNum.
        // Then, if the day is selected, add the updated event.
        days.forEach(day => {
             // Remove events with the eventNum
             events[day] = events[day].filter(ev => ev.eventNum !== eventNum);
             // If this day is checked, add the updated event.
             if (selectedDays.includes(day)) {
                  events[day].push({ 
                      title: title, 
                      startTime: startTime, 
                      endTime: endTime, 
                      color: selectedColor, 
                      eventNum: eventNum 
                  });
             }
        });
        
        updateTimeRange(); // Refresh the calendar view.
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
        
        selectedDays.forEach(day => {
            events[day].push({ title, startTime, endTime, color: selectedColor, eventNum});
        });
        eventNum++;

        titleInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
    
        updateTimeRange();
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
        sendButton.textContent = "Send";
        sendButton.style.marginTop = "10px";
        sendButton.addEventListener("click", () => {
            // Placeholder functionality for the "Send" button
            alert("Send button clicked (no functionality yet).");
        });

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
})();