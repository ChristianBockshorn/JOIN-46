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


function activeBtn(btnId) {
    // Alle Buttons zurücksetzen (Klasse entfernen)
    let buttons = document.querySelectorAll('.prioCategory');
    buttons.forEach(function (button) {
        button.classList.remove('active-urgent');
    });

    // Gewählten Button als aktiv markieren
    document.getElementById(btnId).classList.add('active-urgent');

    console.log("Ausgewählter Button:", btnId);
}


function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assigned = document.getElementById('assigned').value;
    let date = document.getElementById('date').value;
    let selectedPrio = document.querySelector('.active-urgent').value;
    let selectElement = document.getElementById('categorySelect').value;

    let Tasks = {
        "title": title,
        "Description": description,
        "Assigned-to": assigned,
        "Due-date": date,
        "Prio": selectedPrio,
        "Category": selectElement,
        "Subtasks": [],

    };

    AllTask.push(Tasks);

    let AllTaskAsString = JSON.stringify(AllTask);
    localStorage.setItem('AllTask', AllTaskAsString);
}


