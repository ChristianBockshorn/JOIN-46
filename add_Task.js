let AllTask = [];


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }

}

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assigned = document.getElementById('assigned').value;
    let date = document.getElementById('date').value;

    let urgent = document.getElementById('Priourgent').value;
    let medium = document.getElementById('Priomedium').value;
    let low = document.getElementById('Priolow').value;



    let Tasks = {
        "title": title,
        "Description": description,
        "Assigned-to": assigned,
        "Due-date": date,
        "Prio": urgent,medium,low,
        "Category": "Technical Task",
        "Subtasks": {}
    };

    AllTask.push(Tasks);

    let AllTaskAsString=JSON.stringify(AllTask);
    localStorage.setItem('AllTask',AllTaskAsString);







}