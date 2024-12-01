(function () {
    "use strict";

    window.addEventListener("load", init);

    function init() {
        $('#navbar').load('includes/navbar.html', function() {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            });
        });

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
            const pixelsPerHour = 50;

            const topPosition = (eventStart.diff(defaultStartTime, 'minute') / 60) * pixelsPerHour;
            const eventHeight = (eventEnd.diff(eventStart, 'minute') / 60) * pixelsPerHour;

            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.top = `${topPosition}px`;
            eventDiv.style.height = `${eventHeight}px`;
            eventDiv.textContent = `${event.startTime} - ${event.endTime}: ${event.title}`;

            // Add a delete button to each event
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-event";
            deleteButton.addEventListener('click', function () {
                deleteEvent(day, index);
            });

            eventDiv.appendChild(deleteButton);
            dayDiv.appendChild(eventDiv);
        });
    }

    function deleteEvent(day, index) {
        events[day].splice(index, 1); // Remove the event from the array
        updateTimeRange(); // Refresh the display after deletion
    }

    function deleteSelectedEvents() {
        const checkboxes = document.querySelectorAll('.event-checkbox:checked');
        checkboxes.forEach(checkbox => {
            const day = checkbox.dataset.day;
            const eventIndex = checkbox.dataset.index;
            events[day].splice(eventIndex, 1); // Remove the event
        });

        updateTimeRange(); // Refresh the display after deletion
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
        console.log("add it into addEvent function yay");
        const titleInput = document.getElementById('event-title');
        const startTimeInput = document.getElementById('event-start-time');
        const endTimeInput = document.getElementById('event-end-time');

        const title = titleInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

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

        // Gather selected days
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

        // Add the event to each selected day
        selectedDays.forEach(day => {
            events[day].push({ title, startTime, endTime });
        });

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

        // Create the message text
        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.textContent = "Soon you will be able to message your advisor here";

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
