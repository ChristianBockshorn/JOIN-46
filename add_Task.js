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
}


function loadAllTasks() {
    let AllTaskAsString = localStorage.getItem('AllTask');
    AllTask = JSON.parse(AllTaskAsString);
    console.log('loaded task', AllTask);

    render();

}


function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assigned = document.getElementById('assigned').value;
    let date = document.getElementById('date').value;
    let selectedPrio = document.querySelector('.active-urgent').value;
    let selectElement = document.getElementById('categorySelect').value;

    let newTasks = {
        "title": title,
        "Description": description,
        "Assigned": assigned,
        "date": date,
        "Prio": selectedPrio,
        "Category": selectElement,
        "Subtasks": [],
        'state': 'todo'
    };

    // Überprüfen, ob bereits Aufgaben im AllTask-Array vorhanden sind
    let existingTasksAsString = localStorage.getItem('AllTask');
    let existingTasks = existingTasksAsString ? JSON.parse(existingTasksAsString) : [];
    // Die neue Aufgabe an das vorhandene Array anhängen oder ein neues Array mit der Aufgabe initialisieren
    existingTasks.push(newTasks);
    let updatedTasksAsString = JSON.stringify(existingTasks);
    localStorage.setItem('AllTask', updatedTasksAsString);
    // Das AllTask-Array für den sofortigen Gebrauch aktualisieren
    AllTask = existingTasks;

    window.location.href = 'board.html';
}


function safe() {
    let AllTaskAsString = JSON.stringify(AllTask);
    localStorage.setItem('AllTask', AllTaskAsString);
}

// ############################################################
// generate dropdown content


// Prüfen ob ein klick auserhalb des ddMenüs ist, wenn ja und geöffnet wird es geschlossen
document.addEventListener('click', function myFunction(event) {
    let parentClass = event.target.parentNode.className;
    let targetId = event.target.id;
    // console.log(targetId);
    // console.log(parentClass);
    // console.log(targetId !== 'assigned');
    // console.log(targetId !== 'dd-line');
    // console.log(parentClass !== 'dd-line');
    // console.log(parentClass !== 'dd-line-inline');
    if (targetId !== 'assigned' && targetId !== 'dd-line' && parentClass !== 'dd-line' && parentClass !== 'dd-line-inline') {
        closeDDListWithOutsideClick();
    }
})


// Umschalten zwischen einblenden und ausblenden wenn man in das assigned input feld geklickt hat
function ddListToggle() {
    document.getElementById('dd-list-content').classList.toggle('d-flex');
    if (document.getElementById('dd-list-content').classList.contains('d-flex')) {
        renderDropDownList();
    }
}

// funktions zum ausblenden des ddmenüs
function closeDDListWithOutsideClick() {
    document.getElementById('dd-list-content').classList.remove('d-flex');
}


function addToSelectedPersons(circle,i){
    let selected = document.getElementById('selected-persons');
    selected.innerHTML += `<img src="${circle}" id="${i}">`;
    console.log(`<img src="${circle}" id="${i}">`);
}


async function renderDropDownList() {
    await getData();
    let ddfield = document.getElementById('dd-list-content');
    ddfield.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        // console.log('txt');
        let circle = contacts[i]['imgpath'];
        // console.log(circle);
        let name = contacts[i]['name'];
        ddfield.innerHTML += `
        <div id="dd-line" class="dd-line">
            <div class="dd-line-inline">
                <img src="${circle}"></img>
                ${name}
            </div>
            <input onclick="addToSelectedPersons('${circle}','${i}')" class="assigned-cbox" id="checkbox${i}" type="checkbox"></input>
        </div>`;
    }
}



// ############################################################
// End generate dropdown content