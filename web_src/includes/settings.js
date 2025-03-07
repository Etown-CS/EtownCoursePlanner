"use strict";
(function () {
    window.addEventListener("load", init);

    function init() {
        if (id("on_campus") != null) {
            id("on_campus").addEventListener("click", classType);
            id("transfer").addEventListener("click", classType);
            id("course-btn").addEventListener("click", addCourse)
        }
        if (id("minor-btn") != null) {
            id("minor-btn").addEventListener("click", addMinor);
        }
    }

    function addCourse() {
        const url = "/add-oc-course";
        let params = new FormData();
        let course_code = id("course_code").value;
        let semester = id("semester").value;

        params.append("email", window.sessionStorage.getItem("email"));
        params.append("course_code", course_code);
        params.append("semester", semester);

        const options = {method: "POST", body: params};
        fetch(url, options)
        .then(checkStatus)
        .then((data) => {
            id('message').textContent = data['message'];
        })
        alert("Click ok to add another course.");
        window.location.href = "../course.html";
    }

    function addMinor() {
        const url = "/add-minor";
        let params = new FormData();
        let minor = id('minor').value;
        let min_advisor_id = id('advisor').value;

        params.append("minor", minor);
        params.append("min_advisor_id", min_advisor_id);
        params.append("email", window.sessionStorage.getItem("email"));
        console.log(window.sessionStorage.getItem("email"));

        const options = {method: "PATCH", body: params};

        fetch(url, options)
        .then(checkStatus)
        .then((data) => {
            if (data.message == "Minor added successfully!") {
                window.sessionStorage.setItem('minor', minor);
                window.sessionStorage.setItem('min_advisor_id', min_advisor_id);
                id('message').textContent = data['message'];
            } else {
                id('message').textContent = data['message'];
            }
        })
    }

    function classType() {
        if (id("on_campus").checked) {
            id('oc-class-add').classList.remove("hidden");
            id('transfer-class-add').classList.add("hidden");
        } else {
            id('transfer-class-add').classList.remove("hidden");
            id('oc-class-add').classList.add("hidden");
        }
    }

        /*************** Helper Functions ****************/

    /**
     * This function checks the response and returns it in JSON.
     * @returns {} response
     */
    function checkStatus(response) {
        if (!response.ok) {
            console.log("Error in request: " + response.statusText);
        }
        return response.json();
    }
    /**
     * Helper function to get element by id
     * @param {id} id 
     * @returns the element with the given id
     */
    function id(id) {
        return document.getElementById(id);
    }
})();