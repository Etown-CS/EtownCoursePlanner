
(function () {
    "use strict";

    const URL = "http://localhost:8080/advisors";

    window.addEventListener("load", init);

    function init() {
        populateDropdown('advisor', 'name', URL);
    }

    function populateDropdown(id, fieldName, url) {
        fetch(url)
        .then(res => {
            if(!res.ok) throw new Error('Response not ok');
            return res.json();
        })
        .then(data => {
            const dropdown = document.getElementById(id);
            data.forEach(element => {
                const option = document.createElement('option');
                option.value = element[fieldName];
                option.text = element[fieldName];
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
})();