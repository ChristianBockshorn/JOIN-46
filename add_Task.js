let AllTask = [];

let assignedPersons = [];

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
        'state': 'todo',
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

async function init() {
    await getData();
}


// erstellen der Dropdownlist mit den aktuell gespeicherten Benutzern
async function renderDropDownList() {
    let searchSign = document.getElementById('assigned').value;
    let ddfield = document.getElementById('dd-list-content');
    ddfield.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let initialsCircle = contacts[i]['imgpath'];
        let name = contacts[i]['name'];
        if (assignedPersons.find(element => element == i) == i) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initialsCircle, i);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initialsCircle, i);
        }
    }
}


// Filterfunktion die Just in Time prüft ob es einträge mit den entsprechenden Buchstaben bzw. suchmuster gibt
function searchPattern() {
    document.getElementById('dd-list-content').classList.add('d-flex')
    let searchSign = document.getElementById('assigned').value;
    let ddfield = document.getElementById('dd-list-content');
    ddfield.innerHTML = '';
    let contacts_Temp = contacts.filter(c => c.name.toLowerCase().startsWith(searchSign.toLowerCase()));
    for (let i = 0; i < contacts_Temp.length; i++) {
        let initialsCircle = contacts_Temp[i]['imgpath'];
        let name = contacts_Temp[i]['name'];
        let contactsIndex = contacts.findIndex(c => c.name == `${name}`);
        if (assignedPersons.find(element => element == contactsIndex) == contactsIndex) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initialsCircle, contactsIndex);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initialsCircle, contactsIndex);
        }
    }
}


// rendern der ausgewählten Personen um sie unter dem assigned inputfeld anzuzeigen
function renderAssignedPersons() {
    let selected = document.getElementById('selected-persons');
    selected.innerHTML = '';
    for (let j = 0; j < assignedPersons.length; j++) {
        selected.innerHTML += `<img src="${contacts[assignedPersons[j]]['imgpath']}" id="${assignedPersons[j]}">`;
    }
}


// Prüfen ob ein klick auserhalb des ddMenüs ist, wenn ja und geöffnet wird es geschlossen
document.addEventListener('click', function myFunction(event) {
    let parentClass = event.target.parentNode.className;
    let targetId = event.target.id;
    if (targetId !== 'assigned' && targetId !== 'dd-line' && parentClass !== 'dd-line' && parentClass !== 'dd-line-inline') {
        closeDDListWithOutsideClick();
    }
})


// Umschalten zwischen einblenden und ausblenden wenn man in das assigned input feld geklickt hat
function ddListToggle() {
    document.getElementById('dd-list-content').classList.toggle('d-flex');
    if (document.getElementById('dd-list-content').classList.contains('d-flex')) {
        renderDropDownList();
        // searchPattern();
    }
}


// funktions zum ausblenden des ddmenüs
function closeDDListWithOutsideClick() {
    document.getElementById('dd-list-content').classList.remove('d-flex');
}


// ausgewählte Person dem Speicher hinzufügen
function addAssignedPerson(i) {
    assignedPersons.push(i);
}


// entfernen einer bereits ausgewählten Person
function deleteAssignedPerson(i) {
    let toPurge = assignedPersons.indexOf(i);
    assignedPersons.splice(toPurge, 1);
}


// Prüfen ob die ausgewählte Person bereits hinzugefügt ist oder nicht. Wenn ja wird sie entfernt und wenn nicht wird sie hinzugefügt
function addToSelectedPersons(i) {
    if (assignedPersons.indexOf(i) == -1) {
        addAssignedPerson(i);
    }
    else if (assignedPersons.indexOf(i) > -1) {
        deleteAssignedPerson(i);
    }
    renderAssignedPersons();
}


// Template welches für Personen erzeugt wird die bereits sind
function template_InlineFieldChecked(name, initialsCircle, i) {
    return `
        <div id="dd-line" class="dd-line">
            <div class="dd-line-inline">
                <img src="${initialsCircle}"></img>
                ${name}
            </div>
            <input onclick="addToSelectedPersons('${i}')" class="assigned-cbox" id="checkbox${i}" type="checkbox" checked></input>
        </div>
    `;
}

// Template welches erzeugt wird für Personen die aktuell nicht ausgewählt sind
function template_InlineFieldUnChecked(name, initialsCircle, i) {
    return `
        <div id="dd-line" class="dd-line">
            <div class="dd-line-inline">
                <img src="${initialsCircle}"></img>
                ${name}
            </div>
            <input onclick="addToSelectedPersons('${i}')" class="assigned-cbox" id="checkbox${i}" type="checkbox" ></input>
        </div>
    `;
}


// ############################################################
// End generate dropdown content