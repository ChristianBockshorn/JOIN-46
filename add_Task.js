let AllTask = [];
let assignedPersons = [];


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
    // render();
    // updateHTML();
}


function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('date').value;
    let selectedPrio = document.querySelector('.active-urgent').value;
    let selectElement = document.getElementById('categorySelect').value;

    let newTasks = {
        "title": title,
        "Description": description,
        "Assigned": assignedPersons,
        "date": date,
        "Prio": selectedPrio,
        "Category": selectElement,
        "Subtasks": [],
        'state': 'todo',
        'id': generateUniqueId(),
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

function generateUniqueId() {
    let timestamp = new Date().getTime();
    let randomNum = Math.floor(Math.random() * 10000);
    let uniqueId = parseInt(timestamp.toString() + randomNum.toString());
    return uniqueId;
}

// ############################################################
// generate dropdown content

async function init() {
    await getData();
}


// erstellen der Dropdownlist mit den aktuell gespeicherten Benutzern
async function renderDropDownList() {
    let ddfield = document.getElementById('dd-list-content');
    ddfield.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let initials = contacts[i]['initials'];
        let name = contacts[i]['name'];
        let color = contacts[i]['usercolor'];
        if (assignedPersons.find(element => element == i) == i) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, i, color);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, i, color);
        }
    }
}


// Filterfunktion die Just in Time prüft ob es einträge mit den entsprechenden Buchstaben bzw. suchmuster gibt
function searchPattern() {
    document.getElementById('dd-list-content').classList.add('d-flex')
    document.getElementById('dd-list-content').classList.remove('d-none')
    let searchSign = document.getElementById('assigned').value;
    let ddfield = document.getElementById('dd-list-content');
    ddfield.innerHTML = '';
    let contacts_Temp = contacts.filter(c => c.name.toLowerCase().startsWith(searchSign.toLowerCase()));
    for (let i = 0; i < contacts_Temp.length; i++) {
        let initials = contacts_Temp[i]['initials'];
        let name = contacts_Temp[i]['name'];
        let contactsIndex = contacts.findIndex(c => c.name == `${name}`);
        let color = contacts[i]['usercolor'];
        if (assignedPersons.find(element => element == contactsIndex) == contactsIndex) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, contactsIndex, color);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, contactsIndex, color);
        }
    }
}


// rendern der ausgewählten Personen um sie unter dem assigned inputfeld anzuzeigen
function renderAssignedPersons() {
    let selected = document.getElementById('selected-persons');
    selected.innerHTML = '';
    for (let j = 0; j < assignedPersons.length; j++) {
        selected.innerHTML += `<div style="background-color: ${contacts[assignedPersons[j]]['usercolor']}" class="initialscirclecontact d-flex center">${contacts[assignedPersons[j]]['initials']}</div>`;
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
    // debugger;
    document.getElementById('dd-list-content').classList.toggle('d-flex');
    document.getElementById('dd-list-content').classList.toggle('d-none');
    // document.getElementById('dd-list-content').style.display = 'flex';
    if (document.getElementById('dd-list-content').classList.contains('d-flex')) {
        renderDropDownList();
        // searchPattern();
    }
}


// funktions zum ausblenden des ddmenüs
function closeDDListWithOutsideClick() {
    document.getElementById('dd-list-content').classList.remove('d-flex');
    document.getElementById('dd-list-content').classList.add('d-none');
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
function template_InlineFieldChecked(name, initials, i, color) {
    return `
        <div id="dd-line" class="dd-line">
            <div class="dd-line-inline">
                <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
                ${name}
            </div>
            <input onclick="addToSelectedPersons('${i}')" class="assigned-cbox" id="checkbox${i}" type="checkbox" checked></input>
        </div>
    `;
}

// Template welches erzeugt wird für Personen die aktuell nicht ausgewählt sind
function template_InlineFieldUnChecked(name, initials, i, color) {
    return `
        <div id="dd-line" class="dd-line">
            <div class="dd-line-inline">
            <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
                ${name}
            </div>
            <input onclick="addToSelectedPersons('${i}')" class="assigned-cbox" id="checkbox${i}" type="checkbox" ></input>
        </div>
    `;
}


// ############################################################
// End generate dropdown content




// ############################################################
// generate subtask section


// onfocus input Feld -> umschalten zu Icon X und Hacken
function changeSubtaskIconToggle() {
    // debugger;
    document.getElementById('show-add').classList.toggle('d-none');
    document.getElementById('show-write').classList.toggle('d-none');
    document.getElementById('subtask-input').classList.toggle('pad-r-80');
}


function cleanSubtaskInputFiled(){
    document.getElementById('subtask-input').value = '';
    changeSubtaskIconToggle();
}


function renderSubtaskList(){
    let inputValue = document.getElementById('subtask-input').value;
    document.getElementById('subtask-content').innerHTML += `${inputValue}<br>`;
    cleanSubtaskInputFiled();
}


// onclick hacken icon -> rendern der Liste unterhalb des input feldes ("subtask-content")
//      -> leeren des impud feldes
//      -> li generieren mit dem inhalt der eingegeben wurde
//      -> beim hover über diese Zeile das "options" menü aufrufen
//          -> beim click auf edit icon umschalten zwischen li zu textfeld wieder anzeigen des menu mit löschen und hacken
//          -> 
// onclick X -> inputfeld leeren und Plus zeichen wieder anzeigen



// ############################################################
// End generate subtask section