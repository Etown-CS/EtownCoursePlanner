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
        document.getElementById("add").addEventListener("click", addEvent);
        document.getElementById("delete-selected").addEventListener("click", deleteSelectedEvents); // Add this event listener

        
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

    document.addEventListener('DOMContentLoaded', () => {
        displayTimes(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
        displayWeek(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
    });
})();
