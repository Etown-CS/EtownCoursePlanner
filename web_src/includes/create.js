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
        document.getElementById("manual_add").addEventListener("click", manualAdd);
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

        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-header';
        timeHeader.textContent = 'Time';
        header.appendChild(timeHeader);

        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            header.appendChild(dayHeader);
        });

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; // Clear the calendar

        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-column';

            displayEvents(day, dayDiv, startTime, endTime);
            calendar.appendChild(dayDiv);
        });
    }

    function displayEvents(day, dayDiv, defaultStartTime, defaultEndTime) {
        const dayEvents = events[day];
        dayEvents.forEach(event => {
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

            dayDiv.appendChild(eventDiv);
        });
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
        const dayInput = document.getElementById('event-day');

        const title = titleInput.value;
        const startTime = startTimeInput.value;
        console.log(startTime);
        const endTime = endTimeInput.value;
        const day = dayInput.value;

        if (title && startTime && endTime && day) {
            events[day].push({ title, startTime, endTime });

            titleInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
            dayInput.value = '';

            updateTimeRange();
        }
    }

    function manualAdd(){
        const modalDiv = document.createElement("div");
        modalDiv.className = "modal fade";
        modalDiv.setAttribute("tabindex", "-1");
        modalDiv.setAttribute("role", "dialog");
        modalDiv.id = "manualAddModal";

        const modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog";
        modalDialog.setAttribute("role", "document");

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";

        const modalTitle = document.createElement("h5");
        modalTitle.className = "modal-title";
        modalTitle.textContent = "Add an Event";

        const closeButton = document.createElement("button");
        closeButton.className = "close";
        closeButton.setAttribute("type", "button");
        closeButton.setAttribute("data-bs-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");
        closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';

        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
            <div class="event-form">
                <select id="event-day">
                    <option value="">Select Day</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
                <input type="time" id="event-start-time" placeholder="Start Time">
                <input type="time" id="event-end-time" placeholder="End Time">
                <input type="text" id="event-title" placeholder="Event Title">
                <button id="modal-add-event" class="btn btn-primary mt-2">Add Event</button>
            </div>
        `;

        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        const closeFooterButton = document.createElement("button");
        closeFooterButton.className = "btn btn-secondary";
        closeFooterButton.setAttribute("data-bs-dismiss", "modal");
        closeFooterButton.textContent = "Close";

        modalFooter.appendChild(closeFooterButton);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalDialog.appendChild(modalContent);
        modalDiv.appendChild(modalDialog);
        document.body.appendChild(modalDiv);

        const manualAddModal = new bootstrap.Modal(modalDiv);
        manualAddModal.show();

        document.getElementById("modal-add-event").addEventListener("click", () => {
            addEvent();
            manualAddModal.hide();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        displayTimes(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
        displayWeek(dayjs().hour(8).minute(0), dayjs().hour(18).minute(0));
    });
})();
