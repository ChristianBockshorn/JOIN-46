let AllTask = [];
let assignedPersons = [];
let assignedPersonsNames = [];
let k = 0;


function activeBtn(radioname, btnId) {
    let buttons = document.querySelectorAll('.prioCategory');
    buttons.forEach(function (button) {
        button.classList.remove('active-urgent');
    });
    document.querySelector('input[name="' + radioname +'"][value="' + btnId + '"]').checked = true;
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
        "Subtasks": generateSubtasks('subtask-input'),
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


/**
 * Function to get Date on initiating the Site
 */
async function init() {
    await getData();
    loadAllTasks();
}


/**
 * Function is used to change the current user Id Name in diffenrent of edit or add
 * 
 * @param {String} idElement - Id of used HTML Element
 * @returns {String} - return a Id Name for HTML element
 */
function getRightIdName(idElement) {
    let newIdElement = 'selected-persons';
    if (idElement == 'dd-list-editcontent') {
        newIdElement = 'editselected-persons';
    }
    return newIdElement;
}


/**
 * Function is used to render dropdownlist with highlighted users if there are selected
 * 
 * @param {String} idElement - Id of used HTML Element
 */
// erstellen der Dropdownlist mit den aktuell gespeicherten Benutzern
async function renderDropDownList(idElement) {
    let ddfield = document.getElementById(idElement);
    ddfield.innerHTML = '';
    let newIdElement = getRightIdName(idElement);
    for (let i = 0; i < contacts.length; i++) {
        let initials = contacts[i]['initials'];
        let name = contacts[i]['name'];
        let color = contacts[i]['usercolor'];
        if (assignedPersons.find(element => element == i) == i) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, i, color, idElement, newIdElement);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, i, color, idElement, newIdElement);
        }
    }
}


function reload() {
    location.reload();
}


/**
 * Function is used to find contacts with entered Letters
 * 
 * @param {String} idElement - Id of used HTML Element
 */
function searchPattern(idElement) {
    let ddfield = document.getElementById('dd-list-content');
    ddfield.classList.remove('d-none')
    ddfield.classList.add('d-flex')
    ddfield.innerHTML = '';
    let newIdElement = getRightIdName(idElement);
    let searchSign = document.getElementById('assigned').value;
    let contacts_Temp = contacts.filter(c => c.name.toLowerCase().startsWith(searchSign.toLowerCase()));
    for (let i = 0; i < contacts_Temp.length; i++) {
        let initials = contacts_Temp[i]['initials'];
        let name = contacts_Temp[i]['name'];
        let contactsIndex = contacts.findIndex(c => c.name == `${name}`);
        let color = contacts_Temp[i]['usercolor'];
        if (assignedPersons.find(element => element == contactsIndex) == contactsIndex) {
            ddfield.innerHTML += template_InlineFieldChecked(name, initials, contactsIndex, color, idElement, newIdElement);
        }
        else {
            ddfield.innerHTML += template_InlineFieldUnChecked(name, initials, contactsIndex, color, idElement, newIdElement);
        }
    }
}


/**
 * Function is used to generate HTML content to show assigned users with little initials circles
 * 
 * @param {String} idElement - Id of used HTML Element
 */
function renderAssignedPersons(idElement) {
    let selected = document.getElementById(idElement);
    selected.innerHTML = '';
    for (let j = 0; j < assignedPersons.length; j++) {
        selected.innerHTML += `<div style="background-color: ${contacts[assignedPersons[j]]['usercolor']}" class="initialscirclecontact d-flex center">${contacts[assignedPersons[j]]['initials']}</div>`;
    }
}


/**
 *  Event listener that determines which element of the page was clicked on and close the Dropdownlist when it is on view
 *
 */
document.addEventListener('click', function myFunction(event) {
    let parentClass = event.target.parentNode.className;
    let targetId = event.target.id;
    let targetClassName = event.target.className;
    if (targetId !== 'assigned' && targetId !== 'dd-line' && targetClassName !== 'dd-line' && targetClassName !== 'dd-line-dark' && parentClass !== 'dd-line' && parentClass !== 'dd-line-inline') {
        closeDDListWithOutsideClick('dd-list-content');
    }
})


/**
 * Function is used to toogle between show and hide for the dropdownlist
 * 
 * @param {String} idElement - Id of used HTML Element
 */
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


/**
 * Function is used to hide the Dropdownlist
 * 
 * @param {String} idElement - Id of used HTML Element
 */
function closeDDListWithOutsideClick(idElement) {
    document.getElementById(idElement).classList.remove('d-flex');
    document.getElementById(idElement).classList.add('d-none');
}


/**
 * Function is used to add a selected Contact to 2 different Arrays
 * 
 * @param {Number} i - Index Position of Contacts Array
 */
function addAssignedPerson(i) {
    assignedPersons.push(i);
    assignedPersonsNames.push(contacts[i]['name']);
}


/**
 * Function is used to remove a already selected Contact from2 different Arrays
 * 
 * @param {Number} i - Index Position of Contacts Array
 */
function deleteAssignedPerson(i) {
    let toPurge = assignedPersons.indexOf(i);
    assignedPersons.splice(toPurge, 1);
    assignedPersonsNames.splice(toPurge, 1);
}


/**
 * Function is used to add or remove a css class to highlight already selectet contacts
 * 
 * @param {Number} i - Index Position of Contacts Array
 * @param {String} idElement - Id of used HTML Element
 * @param {String} newIdElement - Id of used HTML Element
 */
function addToSelectedPersons(i, idElement, newIdElement) {
    let parentElement = document.getElementById(idElement);
    if (assignedPersons.indexOf(i) == -1) {
        addAssignedPerson(i);
        parentElement.querySelector(`#checkbox${i}`).checked = true;
        parentElement.querySelector(`#dd-line${i}`).classList.add('dd-line-dark');
        parentElement.querySelector(`#dd-line${i}`).classList.remove('dd-line');
    }
    else if (assignedPersons.indexOf(i) > -1) {
        deleteAssignedPerson(i);
        parentElement.querySelector(`#checkbox${i}`).checked = false;
        parentElement.querySelector(`#dd-line${i}`).classList.remove('dd-line-dark');
        parentElement.querySelector(`#dd-line${i}`).classList.add('dd-line');
    }
    renderAssignedPersons(newIdElement);
}


/**
 * Function is used to generate HTML Content to show Assigned users users who are already selected
 * 
 * @param {String} initials - User Initials
 * @param {Number} i - Index Position of Contacts Array
 * @param {String} name - User Name
 * @param {String} color - User Color for Initials circle
 * @param {String} idElement - Id of used HTML Element
 * @param {String} newIdElement - Id of used HTML Element
 * @returns {String} - HTML content as String
 */
function template_InlineFieldChecked(name, initials, i, color, idElement, newIdElement) {
    return `
        <div id="dd-line${i}" class="dd-line-dark" onclick="addToSelectedPersons(${i},'${idElement}', '${newIdElement}')">
            <div class="dd-line-inline">
                <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
                ${name}
            </div>
            <input class="assigned-cbox" id="checkbox${i}" type="checkbox" checked></input>
        </div>
    `;
}

/**
 * Function is used to generate HTML Content to show Assigned users users who are not selected
 * 
 * @param {String} initials - User Initials
 * @param {Number} i - Index Position of Contacts Array
 * @param {String} name - User Name
 * @param {String} color - User Color for Initials circle
 * @param {String} idElement - Id of used HTML Element
 * @param {String} newIdElement - Id of used HTML Element
 * @returns {String} - HTML content as String
 */
function template_InlineFieldUnChecked(name, initials, i, color, idElement, newIdElement) {
    return `
        <div id="dd-line${i}" class="dd-line" onclick="addToSelectedPersons(${i},'${idElement}', '${newIdElement}')">
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


/**
 * Function to add Subtask element on HTML Structure if Enter Key is pressed
 * 
 * @param {Object} event - the Object to check which key are pressed
 */
function saveOnEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let idElement = event.srcElement.id;
        let contentIdElement = 'subtask-content';
        if (idElement == 'editsubtask-input') {
            contentIdElement = 'editsubtask-content'
        }
        renderSubtaskList(idElement, contentIdElement);
    }
};


/**
 * This Function add a state value next to the current SubTask
 * 
 * @param {String} taskInput - the current handelt Subtask
 * @returns {Object} - returns a Object with Subtaskname and state false
 */
function buildArray(taskInput) {
    let obj = {
        task: taskInput,
        done: false
    }
    return obj;
}


/**
 * Function is used to take all li elements and push them to Subtask Array
 * and if it is just contents in input field save this or save this too
 * 
 * @param {String} idElement - Id of HTML Element
 * @returns {Array} - returts all subtasks that the user has entered
 */
function generateSubtasks(idElement) {
    let allLiElements = document.querySelectorAll('li');
    let oneSubTask = document.getElementById(idElement).value;
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


/**
 * Function is used to change icons in a input field
 * 
 */
function changeSubtaskIconToggle() {
    document.getElementById('show-add').classList.toggle('d-none');
    document.getElementById('show-write').classList.toggle('d-none');
    document.getElementById('subtask-input').classList.toggle('pad-r-80');
}


/**
 * Function is used to clear the input field for Subtasks
 * 
 * @param {String} idElement - Id of HTML Element
 */
function cleanSubtaskInputFiled(idElement) {
    document.getElementById(idElement).value = '';
    changeSubtaskIconToggle();
}


/**
 * Function is used to create a Subtask
 * 
 * @param {String} idElement - Id of HTML Element
 * @param {String} contentIdElement - Id of HTML Element
 */
function renderSubtaskList(idElement, contentIdElement) {
    let inputValue = document.getElementById(idElement).value;
    if (inputValue == '') {
        cleanSubtaskInputFiled(idElement);
    }
    else {
        document.getElementById(contentIdElement).innerHTML += template_Subtask(k, inputValue);
        k++;
        cleanSubtaskInputFiled(idElement);
    }
}


/**
 * Function is used to generate Subtask HTML content
 * 
 * @param {Number} k - ID of current SubTask
 * @param {String} inputValue - user input
 * @returns {String} - HTML content as String
 */
function template_Subtask(k, inputValue) {
    return `<div class="pad-add pos-rel" id="delete-line${k}">
    <li class="subtask-line" ondblclick="editSubtaskLine(${k})" id="subtask-line${k}" onkeydown="saveOnEnter(event)">${inputValue}</li>
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


/**
 * Function is used to change li Element to input element to edit as text
 * 
 * @param {Number} k - ID of current Subtask
 */
function editSubtaskLine(k) {
    document.getElementById(`show-edit${k}`).style.display = 'none';
    document.getElementById(`show-save${k}`).style.display = 'flex';
    let listItem = document.getElementById(`subtask-line${k}`);
    let inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', `subtask-edit-line${k}`);
    inputField.setAttribute('class', `subtask-edit-line`);
    inputField.setAttribute('onkeydown', `saveOnEnter(event)`);
    inputField.value = listItem.innerHTML;
    listItem.parentNode.replaceChild(inputField, listItem);
    document.getElementById(`subtask-edit-line${k}`).parentElement.classList.remove('pad-add');
}


/**
 * Funktion to change HTML Element from Input to li Element
 * 
 * @param {Number} k - Id of current SubTask
 */
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


/**
 * Funktion to delete one HTML Line li Element
 * 
 * @param {Number} k - ID if current Subtask
 */
function deleteSubtask(k) {
    document.getElementById(`delete-line${k}`).remove();
}


// ############################################################
// End generate subtask section


/**
 * This Funktion ist used to set the min Property on date Element
 * 
 */
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
    document.getElementById('editdueDate').min = forbiddenDays;
}


/**
 * Function is used to clear HTML Elements and Variables
 * 
 * @param {String} subtasks - Id Name of HTML Element
 * @param {String} selectetPersons - Id Name of HTML Element
 */
function cleanAllTaskFieldInputs(subtasks, selectetPersons) {
    document.getElementById(subtasks).innerHTML = '';
    document.getElementById(selectetPersons).innerHTML = '';
    assignedPersons = [];
    assignedPersonsNames = [];
}