let AllTask = [];
let assignedPersons = [];
let assignedPersonsNames = [];
let k = 0;

function activeBtn(btnId) {
    // Alle Buttons zurücksetzen (Klasse entfernen)
    let buttons = document.querySelectorAll('.prioCategory');
    buttons.forEach(function (button) {
        button.classList.remove('active-urgent');
    });

    // Gewählten Button als aktiv markieren
    document.querySelector('input[name="prioCategory"][value="' + btnId + '"]').checked = true;
    document.getElementById(btnId).classList.add('active-urgent');
}


async function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('dueDate').value;
    let selectedPrio = document.querySelector('input[name="prioCategory"]:checked').value;
    let selectElement = document.getElementById('categorySelect').value;

    let newTasks = {
        "title": title,
        "Description": description,
        "Assigned": assignedPersonsNames,
        "date": date,
        "Prio": selectedPrio,
        "Category": selectElement,
        "Subtasks": generateSubtasks(),
        'state': 'stateToDo',
        'id': generateUniqueId(),

    };

    // Überprüfen, ob bereits Aufgaben im AllTask-Array vorhanden sind
    let existingTasksAsString = JSON.stringify(AllTask);
    let existingTasks = existingTasksAsString ? JSON.parse(existingTasksAsString) : [];
    // Die neue Aufgabe an das vorhandene Array anhängen oder ein neues Array mit der Aufgabe initialisieren
    existingTasks.push(newTasks);
    let updatedTasksAsString = JSON.stringify(existingTasks);
    await setItem('AllTask', updatedTasksAsString);
    // Das AllTask-Array für den sofortigen Gebrauch aktualisieren
    AllTask = existingTasks;

    window.location.href = 'board.html';
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
    loadAllTasks();
}


// erstellen der Dropdownlist mit den aktuell gespeicherten Benutzern
async function renderDropDownList(idElement) {
    let ddfield = document.getElementById(idElement);
    ddfield.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let initials = contacts[i]['initials'];
        let name = contacts[i]['name'];
        let color = contacts[i]['usercolor'];
        if (assignedPersons.find(element => element == i) == i) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, i, color, idElement);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, i, color, idElement);
        }
    }
}

function reload() {
   location.reload();
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
        let color = contacts_Temp[i]['usercolor'];
        if (assignedPersons.find(element => element == contactsIndex) == contactsIndex) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, contactsIndex, color, idElement);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, contactsIndex, color, idElement);
        }
    }
}


// rendern der ausgewählten Personen um sie unter dem assigned inputfeld anzuzeigen
function renderAssignedPersons(idElement) {
    let selected = document.getElementById(idElement);
    selected.innerHTML = '';
    for (let j = 0; j < assignedPersons.length; j++) {
        selected.innerHTML += `<div style="background-color: ${contacts[assignedPersons[j]]['usercolor']}" class="initialscirclecontact d-flex center">${contacts[assignedPersons[j]]['initials']}</div>`;
    }
}


// Prüfen ob ein klick auserhalb des ddMenüs ist, wenn ja und geöffnet wird es geschlossen
document.addEventListener('click', function myFunction(event) {
    let parentClass = event.target.parentNode.className;
    console.log(parentClass);
    let targetId = event.target.id;
    let targetClassName = event.target.className;
    if (targetId !== 'assigned' && targetId !== 'dd-line' && targetClassName !== 'dd-line' && targetClassName !== 'dd-line-dark' && parentClass !== 'dd-line' && parentClass !== 'dd-line-inline') {
        closeDDListWithOutsideClick('dd-list-content');
    }
})


// Umschalten zwischen einblenden und ausblenden wenn man in das assigned input feld geklickt hat
function ddListToggle(idElement) {
    document.getElementById(idElement).classList.toggle('d-flex');
    document.getElementById(idElement).classList.toggle('d-none');
    if (document.getElementById(idElement).classList.contains('d-flex')) {
        renderDropDownList(idElement);
    }
}

function doNotClose(event) {
    event.stopPropagation();
}

// funktions zum ausblenden des ddmenüs
function closeDDListWithOutsideClick(idElement) {
    document.getElementById(idElement).classList.remove('d-flex');
    document.getElementById(idElement).classList.add('d-none');
}


// ausgewählte Person dem Speicher hinzufügen
function addAssignedPerson(i) {
    console.log(i);
    assignedPersons.push(i);
    assignedPersonsNames.push(contacts[i]['name']);
}


// entfernen einer bereits ausgewählten Person
function deleteAssignedPerson(i) {
    let toPurge = assignedPersons.indexOf(i);
    assignedPersons.splice(toPurge, 1);
    assignedPersonsNames.splice(toPurge, 1);
}


// Prüfen ob die ausgewählte Person bereits hinzugefügt ist oder nicht. Wenn ja wird sie entfernt und wenn nicht wird sie hinzugefügt
function addToSelectedPersons(i, idElement) {
    if (assignedPersons.indexOf(i) == -1) {
        addAssignedPerson(i);
        document.getElementById(`checkbox${i}`).checked = true;
        document.getElementById(`dd-line${i}`).classList.add('dd-line-dark');
        document.getElementById(`dd-line${i}`).classList.remove('dd-line');
    }
    else if (assignedPersons.indexOf(i) > -1) {
        deleteAssignedPerson(i);
        document.getElementById(`checkbox${i}`).checked = false;
        document.getElementById(`dd-line${i}`).classList.remove('dd-line-dark');
        document.getElementById(`dd-line${i}`).classList.add('dd-line');
    }
    renderAssignedPersons(idElement);
}


// Template welches für Personen erzeugt wird die bereits ausgewählt sind
function template_InlineFieldChecked(name, initials, i, color) {
    return `
        <div id="dd-line${i}" class="dd-line-dark" onclick="addToSelectedPersons(${i},'selected-persons')">
            <div class="dd-line-inline">
                <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
                ${name}
            </div>
            <input class="assigned-cbox" id="checkbox${i}" type="checkbox" checked></input>
        </div>
    `;
}

// Template welches erzeugt wird für Personen die aktuell nicht ausgewählt sind
function template_InlineFieldUnChecked(name, initials, i, color) {
    return `
        <div id="dd-line${i}" class="dd-line" onclick="addToSelectedPersons(${i},'selected-persons')">
            <div class="dd-line-inline">
            <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
                ${name}
            </div>
            <input class="assigned-cbox" id="checkbox${i}" type="checkbox" ></input>
        </div>
    `;
}


// ############################################################
// End generate dropdown content




// ############################################################
// generate subtask section

function saveOnEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        renderSubtaskList();
    }
};


function buildArray(taskInput) {
    let obj = {
        task: taskInput,
        done: false
    }
    return obj;
}


function generateSubtasks() {
    let allLiElements = document.querySelectorAll('li');
    let oneSubTask = document.getElementById('subtask-input').value;
    let allArray = [];
    for (let i = 0; i < allLiElements.length; i++) {
        let element = allLiElements[i].innerHTML;
        let obj = buildArray(element);
        allArray.push(obj);
    }
    if (oneSubTask !== '') {
        let obj = buildArray(oneSubTask);
        allArray.push(obj);
    }
    return allArray;
}


// onfocus input Feld -> umschalten zu Icon X und Hacken
function changeSubtaskIconToggle() {
    document.getElementById('show-add').classList.toggle('d-none');
    document.getElementById('show-write').classList.toggle('d-none');
    document.getElementById('subtask-input').classList.toggle('pad-r-80');
}


function cleanSubtaskInputFiled() {
    document.getElementById('subtask-input').value = '';
    changeSubtaskIconToggle();
}


function renderSubtaskList() {
    let inputValue = document.getElementById('subtask-input').value;
    if (inputValue == '') {
        cleanSubtaskInputFiled();
    }
    else {
        document.getElementById('subtask-content').innerHTML += template_Subtask(k, inputValue);
        k++;
        cleanSubtaskInputFiled();
    }
}

function template_Subtask(k, inputValue) {
    return `<div class="pad-add pos-rel" id="delete-line${k}">
    <li class="subtask-line" ondblclick="editSubtaskLine(${k})" id="subtask-line${k}">${inputValue}</li>
    <div class="hiding subtask-edit-icons d-flex center gap-4" id="show-edit${k}">
        <img class="subtask-X-symbol icon-size-24 inputSymbol" id="subtask-input-X" onclick="editSubtaskLine(${k})" src="assets/images/edit_white.svg">
        <div class="edit-options-seperator"></div>
        <img class="subtask-hook-symbol icon-size-24 inputSymbol" id="subtask-input-hook" onclick="deleteSubtask(${k})" src="assets/images/delete_small.svg">
    </div>
    <div class="subtask-edit-icons d-none center gap-4" id="show-save${k}">
        <img class="subtask-X-symbol icon-size-24 inputSymbol" id="subtask-input-X" onclick="deleteSubtask(${k})" src="assets/images/delete_small.svg">
        <div class="edit-options-seperator"></div>
        <img class="subtask-hook-symbol icon-size-24 inputSymbol" id="subtask-input-hook" onclick="saveSubtaskChanges(${k})" src="assets/images/hook.svg">
    </div>
</div>`;
}


function editSubtaskLine(k) {
    document.getElementById(`show-edit${k}`).style.display = 'none';
    document.getElementById(`show-save${k}`).style.display = 'flex';
    let listItem = document.getElementById(`subtask-line${k}`);
    let inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', `subtask-edit-line${k}`);
    inputField.setAttribute('class', `subtask-edit-line`);
    inputField.value = listItem.innerHTML;
    listItem.parentNode.replaceChild(inputField, listItem);
    document.getElementById(`subtask-edit-line${k}`).parentElement.classList.remove('pad-add');
}


function saveSubtaskChanges(k) {
    document.getElementById(`show-edit${k}`).style.display = 'flex';
    document.getElementById(`show-save${k}`).style.display = 'none';
    let fieldItem = document.getElementById(`subtask-edit-line${k}`);
    let listField = document.createElement('li');
    listField.setAttribute('id', `subtask-line${k}`);
    listField.setAttribute('class', 'subtask-line');
    listField.setAttribute('ondblclick', `editSubtaskLine(${k})`);
    listField.innerHTML = fieldItem.value;
    fieldItem.parentNode.replaceChild(listField, fieldItem);
    document.getElementById(`subtask-line${k}`).parentElement.classList.add('pad-add');
}


function deleteSubtask(k) {
    document.getElementById(`delete-line${k}`).remove();
}


// ############################################################
// End generate subtask section


// ############################################################
// Search Filed function


function showSearchContent() {
    document.getElementById('searchContent').classList.remove('d-none');
}


function hideSearchContent() {
    document.getElementById('searchContent').classList.add('d-none');
}


function getPastDate() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = today.getFullYear();
    let forbiddenDays = `${year}-${month}-${day}`;
    document.getElementById('dueDate').min = forbiddenDays;
}


function cleanAllTaskFieldInputs() {
    document.getElementById('subtask-content').innerHTML = '';
    document.getElementById('selected-persons').innerHTML = '';
    assignedPersons = [];
}