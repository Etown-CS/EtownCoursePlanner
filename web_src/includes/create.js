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

    // Add event to multiple days or week
    function addEvent() {
        const titleInput = document.getElementById('event-title');
        const startTimeInput = document.getElementById('event-start-time');
        const endTimeInput = document.getElementById('event-end-time');
        const dayInputs = document.querySelectorAll('.event-day:checked');  // Get checked checkboxes
        const weekInput = document.getElementById('event-week'); // Get week checkbox
        
        const title = titleInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        // Collect selected days
        let selectedDays = [];
        if (weekInput.checked) {
            selectedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        } else {
            dayInputs.forEach(day => selectedDays.push(day.value));
        }

        // Add event to all selected days
        selectedDays.forEach(day => {
            if (title && startTime && endTime) {
                events[day].push({ title, startTime, endTime });
            }
        });

        // Clear the inputs
        titleInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
        document.querySelectorAll('.event-day').forEach(cb => cb.checked = false);
        weekInput.checked = false;

        updateTimeRange();
    }

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

            // Add Edit button
            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                editEvent(day, index); // Pass the day and index of the event to edit
            });

            // Add Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteEvent(day, index); // Pass the day and index of the event to delete
            });

            eventDiv.appendChild(editButton);
            eventDiv.appendChild(deleteButton);
            dayDiv.appendChild(eventDiv);
        });
    }

    function deleteEvent(day, index) {
        // Remove the event from the events array
        events[day].splice(index, 1);

        // Re-render the calendar after deletion
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

    document.addEventListener('DOMContentLoaded', () => {
        displayTimes(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
        displayWeek(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
    });
})();
