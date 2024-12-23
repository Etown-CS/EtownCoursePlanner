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
        // require('dotenv').config();
        // const apiKey = process.env.API_KEY;
        // console.log(apiKey); // Use the key in your application

        updateTimeRange();
        // document.getElementById("add").addEventListener("click", addEvent);
        document.getElementById("msg_btn").addEventListener("click", msgBox);
        document.getElementById("manual_add").addEventListener("click", addEvent2);
        // document.getElementById("delete-selected").addEventListener("click", deleteSelectedEvents); // TODO fix this so it doesnt error when no event is present
        
    }

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
