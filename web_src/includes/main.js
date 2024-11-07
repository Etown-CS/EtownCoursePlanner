(function () {
    "use strict";

    // Wait until the window is fully loaded
    window.addEventListener("load", init);
    
    function init() {
        // Load the navbar dynamically
        $('#navbar').load('includes/navbar.html', function() {
            // Once the navbar is loaded, apply the "active" class to the current page
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            });
        });

        //Add event listener to the "Create New" button
        // document.getElementById("createNew").addEventListener("click", function() {
        //     // Redirect to the create new page
        //     window.location.href = "create.html"; // Replace with the actual URL
        // });

        // Initialize the display of times and the weekly schedule
        updateTimeRange();
        document.getElementById("add").addEventListener("click", addEvent);
    }

    // Event data for each day of the week
    const events = {
        'Sunday': [],
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': []
    };

    // Function to display times between start and end time
    function displayTimes(startTime, endTime) {
        const timeColumn = document.getElementById('time-column');
        timeColumn.innerHTML = ''; // Clear existing times

        let currentTime = startTime;
        while (currentTime.isBefore(endTime)) {
            const hourSlot = document.createElement('div');
            hourSlot.className = 'hour-slot';
            hourSlot.innerText = currentTime.format('h A');
            timeColumn.appendChild(hourSlot);
            currentTime = currentTime.add(1, 'hour');
        }
    }

    // Function to display the full week with events
    function displayWeek(startTime, endTime) {
        const now = dayjs();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; // Clear the calendar

        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day' + (day === now.format('dddd') ? ' today' : '');

            const dayName = document.createElement('div');
            dayName.className = 'day-name';
            dayName.textContent = day;
            dayDiv.appendChild(dayName);

            calendar.appendChild(dayDiv);
            displayEvents(day, dayDiv, startTime, endTime);
        });
    }

    // Function to display events for each day
    function displayEvents(day, dayDiv, defaultStartTime, defaultEndTime) {
        const dayEvents = events[day];
        dayEvents.forEach(event => {
            const eventStart = dayjs().hour(event.startTime.split(":")[0]).minute(event.startTime.split(":")[1]);
            const eventEnd = dayjs().hour(event.endTime.split(":")[0]).minute(event.endTime.split(":")[1]);

            const totalHours = defaultEndTime.diff(defaultStartTime, 'hour');
            const pixelsPerHour = 50; // Each hour takes up 50px

            const topPosition = (eventStart.diff(defaultStartTime, 'minute') / 60) * pixelsPerHour;
            const eventHeight = (eventEnd.diff(eventStart, 'minute') / 60) * pixelsPerHour;

            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.style.top = `${topPosition}px`;
            eventDiv.style.height = `${eventHeight}px`;
            eventDiv.textContent = `${event.startTime} - ${event.endTime}: ${event.title}`;

            dayDiv.appendChild(eventDiv);
        });
    }

    // Function to update the time range based on events
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

    // Function to add a new event
    function addEvent() {
        const titleInput = document.getElementById('event-title');
        const startTimeInput = document.getElementById('event-start-time');
        const endTimeInput = document.getElementById('event-end-time');
        const dayInput = document.getElementById('event-day');

        const title = titleInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const day = dayInput.value;

        if (title && startTime && endTime && day) {
            events[day].push({ title, startTime, endTime });

            // Clear the inputs after the event is added
            titleInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
            dayInput.value = '';

            // Update the time range and events display
            updateTimeRange();
        }
    }

    // Event listener to initialize display after DOM content is loaded
    document.addEventListener('DOMContentLoaded', () => {
        displayTimes(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
        displayWeek(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
    });

})();
