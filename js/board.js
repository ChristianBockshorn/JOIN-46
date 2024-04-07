let currentDraggedElement;


function openDialog() {
    document.getElementById('selected-persons').innerHTML = '';
    document.getElementById('dialog').classList.remove('d-none');
    document.getElementById('mainContent').classList.remove('main');
}


/**
 * This function is used to show the Task edit window
 * 
 * @param {Number} index - the current Array Position Number
 */
function openDialogEdit(index) {
    document.getElementById('editselected-persons').innerHTML = '';
    document.getElementById('dialogEdit').classList.remove('d-none');
    document.getElementById('mainContent').classList.remove('main');
    document.getElementById('taskDetail').classList.add('d-none');
    document.getElementById('edittitle').value = AllTask[index]['title'];
    document.getElementById('editdescription').value = AllTask[index]['Description'];
    document.getElementById('editdueDate').value = AllTask[index]['date'];
    document.getElementById('editprioCategory').value = 'edit' + AllTask[index]['Prio'];
    activeBtn('editprioCategory', 'edit' + AllTask[index]['Prio'] + '');
    document.getElementById('editsubtask-content').innerHTML = '';
    document.getElementById('saveEditedTaskBtn').value = index;
    renderEditSubtasks(index);
    fillAssignedPersonsArray(index);
}


/**
 * This function is used to get user changes from form and save them to the current array position
 * 
 */
async function saveEditedTask() {
    document.getElementById('BoardSection').style.overflowY = 'auto';
    let editNr = document.getElementById('saveEditedTaskBtn').value;
    let editTitle = document.getElementById('edittitle').value;
    let editDescription = document.getElementById('editdescription').value;
    let editDueDate = document.getElementById('editdueDate').value;
    let editPrio = document.querySelector('input[name="editprioCategory"]:checked').value;
    editPrio = editPrio.substring(4);
    AllTask[editNr]['title'] = editTitle;
    AllTask[editNr]['Description'] = editDescription;
    AllTask[editNr]['date'] = editDueDate;
    AllTask[editNr]['Prio'] = editPrio;
    AllTask[editNr]['Subtasks'] = generateSubtasks('editsubtask-input');
    AllTask[editNr]['Assigned'] = assignedPersonsNames;
    await save();
    closeDialogEdit();
    updateHTML();
}


/**
 * This function is used to change the style on assigned users if it is not a deletet user
 * 
 * @param {Number} index - the current Array Position Number
 */
function fillAssignedPersonsArray(index) {
    let selectedUsers = AllTask[index]['Assigned'];
    for (let i = 0; i < selectedUsers.length; i++) {
        const selectedUser = selectedUsers[i];
        if (selectedUser !== 'gelöscht') {
            let indexPosition = contacts.findIndex(c => c.name == selectedUser)
            addAssignedPerson(indexPosition);
            renderAssignedPersons('editselected-persons');
        }
    }
}


/**
 * This function is used to render the current Task
 * 
 * @param {Number} index - the current Array Position Number
 */
function renderEditSubtasks(index) {
    for (let i = 0; i < AllTask[index]['Subtasks'].length; i++) {
        const element = AllTask[index]['Subtasks'][i]['task'];
        document.getElementById('editsubtask-content').innerHTML += template_Subtask(i, element);
    }
}


/**
 * is used to close the Task edit window
 * 
 */
function closeDialogEdit() {
    document.getElementById('dialogEdit').classList.add('d-none');
    document.getElementById('editsubtask-input').value = '';
    assignedPersons = [];
    assignedPersonsNames = [];
}


/**
 * This function is used to stop close the parent element on click the child element
 * 
 * @param {Event} event - The current click event
 */
function doNotClose(event) {
    event.stopPropagation();
}


/**
 * used to hide the dialog window and clear the variables
 * 
 */
function closeDialog() {
    document.getElementById('dialog').classList.add('d-none');
    assignedPersons = [];
    assignedPersonsNames = [];
}


/**
 * This function is used to generate dynamic html content.
 * 
 * @param {Array} element - current task
 * @param {Number} f - the index position of the current task
 * @returns {String} - A string representing the HTML content for the task element.
 */
function generateHtmlContent(element, f) {
    return /*html*/`
        <div id="borderBoard-${element['id']}" class="borderBoard" draggable="true" onclick="openTask(${f})" touchstart="startDragging(${element['id']})" ondragstart="startDragging(${element['id']})">
            <span class="taskCategory">${element.Category}</span>
            <h3 class="taskTitle">${element.title}</h3>
            <span class="taskDescription">${element.Description}</span>
            <span id="progress-bar${f}"></span>
            <div>Assigned To:
                <div class="pad-l-8 overflow-x">
                    <span class="stapled-icons-line" id="selected-assigned-user-small${f}"></span>
                </div>
            </div>
            <span>Date: ${element.date}</span>
            <span>Prio: ${element.Prio}</span>
        </div>
    `;
}


/**
 * This function load all tasks and Contacts
 * 
 */
async function init() {
    await loadAllTasks();
    await getData();
}


/**
 * This function is used to load informations about the assigned user from contact Array.
 * 
 * @param {Object} element - current task
 * @param {Number} indexPosition - the index position of the current task
 */
function getAssignedUserSmall(element, indexPosition) {
    let assignedUsers = element['Assigned'];
    let assignedUsersField = document.getElementById(`selected-assigned-user-small${indexPosition}`);
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUserID = contacts.findIndex(x => x.name == assignedUsers[i]);
        if (assignedUserID !== -1 && contacts[assignedUserID]) {
            let assignedUserColor = contacts[assignedUserID]['usercolor'];
            let assignedUserInitials = contacts[assignedUserID]['initials'];
            assignedUsersField.innerHTML += template_AssignedUsersSmall(assignedUserColor, assignedUserInitials);
        } else {
            if (assignedUsers[i] == 'gelöscht') {
                assignedUsersField.innerHTML += template_AssignedUsersSmall('#f2ad00', 'Delete');
            }
            else {
                console.error(`Kontakt mit dem Namen ${assignedUsers[i]} nicht gefunden.`);
            }
        }
    }
}


/**
 * a function to generate the HTML code to show a small view of assigned users
 * 
 * @param {string} assignedUserColor - content is the hex color value
 * @param {string} assignedUserInitials - content is the initials of user
 * @returns {String} - A string representing the HTML content for the task element.
 */
function template_AssignedUsersSmall(assignedUserColor, assignedUserInitials) {
    return `
        <div class="stapled-icons">
            <div style="background-color:${assignedUserColor}" class="initialscirclecontact initialscirclecontactsmall d-flex center">${assignedUserInitials}</div>
        </div>`;
}



/**
 * This function is used to load informations about the assigned user from contact Array.
 * 
 * @param {Object} element - current task
 * @param {Number} indexPosition - the index position of the current task
 */
function getAssignedUser(element, indexPosition) {
    let assignedUsers = element['Assigned'];
    let assignedUsersField = document.getElementById(`selected-assigned-user${indexPosition}`);
    assignedUsersField.innerHTML = 'Assigned To:<br>';
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUserID = contacts.findIndex(x => x.name == assignedUsers[i]);
        if (assignedUserID !== -1 && contacts[assignedUserID]) {
            let assignedUserName = contacts[assignedUserID]['name'];
            let assignedUserColor = contacts[assignedUserID]['usercolor'];
            let assignedUserInitials = contacts[assignedUserID]['initials'];
            assignedUsersField.innerHTML += template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName);
        } else {
            if (assignedUsers[i] == 'gelöscht') {
                assignedUsersField.innerHTML += template_AssignedUsers('#f2ad00', 'Delete', 'der Benutzer wurde gelöscht');
            }
            else {
                console.error(`Kontakt mit dem Namen ${assignedUsers[i]} nicht gefunden.`);
            }
        }
    }
}


/**
 * This function check for subtasks and change the state from true -> checked and false -> unchecked
 * 
 * @param {Object} element - the current Task
 * @param {Number} index - index Position of the Current Task in AllTask
 */
function getSubtasks(element, index) {
    let subtasks = document.getElementById(`subtasks-view${index}`);
    subtasks.innerHTML = 'Subtasks';
    let state = 'unchecked';
    for (let i = 0; i < element['Subtasks'].length; i++) {
        let subtask = element['Subtasks'][i];
        let checkedState = element['Subtasks'][i]['stateDone'];
        if (checkedState == true) {
            state = 'checked';
        }
        else {
            state = 'unchecked';
        }
        subtasks.innerHTML += template_SubtasksShow(subtask, i, index, state);
    }
}


/**
 * this function is used to change the state of a subtask
 * 
 * @param {Number} index - Array position of curent Task
 * @param {Number} i - Array position of the current subtask
 */
async function checkIfSubtaskIsDone(index, i) {
    let selectetTask = AllTask[index]['Subtasks'][i]['stateDone'];
    selectetTask = !selectetTask;
    AllTask[index]['Subtasks'][i]['stateDone'] = selectetTask;
    await saveAllTaskRemote()
    updateHTML();
}


/**
 * this function is used to get the index position of each Array element
 * 
 * @param {Array} stateToDo - all Tasks with a state with ToDo
 */
function renderStateToDo(stateToDo) {
    for (let index = 0; index < stateToDo.length; index++) {
        const element = stateToDo[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateToDo').innerHTML += generateHtmlContent(element, indexPosition);
        getAssignedUserSmall(element, indexPosition);
        generateProgressBar(indexPosition);
    }
}


/**
 * this function is used to get the index position of each Array element
 * 
 * @param {Array} stateToDo - all Tasks with a state with inProgress
 */
function renderStateInProgress(stateInProgress) {
    for (let index = 0; index < stateInProgress.length; index++) {
        const element = stateInProgress[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateInProgress').innerHTML += generateHtmlContent(element, indexPosition);
        getAssignedUserSmall(element, indexPosition);
        generateProgressBar(indexPosition);
    }
}


/**
 * this function is used to get the index position of each Array element
 * 
 * @param {Array} stateToDo - all Tasks with a state with AwaitFeedback
 */
function renderStateAwaitFeedback(stateAwaitFeedback) {
    for (let index = 0; index < stateAwaitFeedback.length; index++) {
        const element = stateAwaitFeedback[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateAwaitFeedback').innerHTML += generateHtmlContent(element, indexPosition);
        getAssignedUserSmall(element, indexPosition);
        generateProgressBar(indexPosition);
    }
}


/**
 * this function is used to get the index position of each Array element
 * 
 * @param {Array} stateToDo - all Tasks with a state with done
 */
function renderStateDone(stateDone) {
    for (let index = 0; index < stateDone.length; index++) {
        const element = stateDone[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateDone').innerHTML += generateHtmlContent(element, indexPosition);
        getAssignedUserSmall(element, indexPosition);
        generateProgressBar(indexPosition);
    }
}


async function updateHTML() {
    await init();
    let noToDoDiv = document.querySelector('.no-to-do');
    //To Do---------------------------------
    let stateToDo = AllTask.filter(task => task['state'] == 'stateToDo');
    document.getElementById('stateToDo').innerHTML = '';
    if (stateToDo.length >= 1) {
        renderStateToDo(stateToDo);
        noToDoDiv.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        noToDoDiv.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }
    //In Progress---------------------------------
    let stateInProgress = AllTask.filter(task => task['state'] == 'stateInProgress');
    let noToDoDivInProgress = document.querySelector('.no-to-do-InProgress');
    document.getElementById('stateInProgress').innerHTML = '';

    if (stateInProgress.length >= 1) {
        renderStateInProgress(stateInProgress);
        noToDoDivInProgress.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        noToDoDivInProgress.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }
    //Await feedback---------------------------------
    let stateAwaitFeedback = AllTask.filter(task => task['state'] == 'stateAwaitFeedback');
    let noToDoDivAwaitFeedback = document.querySelector('.no-to-do-AwaitFeedback');
    document.getElementById('stateAwaitFeedback').innerHTML = '';
    if (stateAwaitFeedback.length >= 1) {
        renderStateAwaitFeedback(stateAwaitFeedback);
        noToDoDivAwaitFeedback.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        noToDoDivAwaitFeedback.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }
    //Done---------------------------------
    let stateDone = AllTask.filter(task => task['state'] == 'stateDone');
    let noToDoDivDone = document.querySelector('.no-to-do-Done');
    document.getElementById('stateDone').innerHTML = '';
    if (stateDone.length >= 1) {
        renderStateDone(stateDone);
        noToDoDivDone.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        noToDoDivDone.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }
}


function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


function startDragging(id) {
    currentDraggedElement = id;
}


function allowDrop(ev) {
    // document.location = '#board'
    ev.preventDefault();
}


async function moveTo(category) {
    const taskIndex = AllTask.findIndex(task => task.id === currentDraggedElement);
    if (taskIndex !== -1) {
        AllTask[taskIndex].state = category;
        await saveAllTaskRemote();
    } else {
        console.error("Task not found in AllTask array");
    }
    updateHTML();
}


/**
 * This function is used to hide scrollbar on main content and open Window for Task detail information
 * 
 * @param {Number} index - Index Position of current Task
 */
function openTask(index) {
    document.getElementById('taskDetail').classList.remove('d-none');
    document.getElementById('searchContent').classList.add('d-none');
    document.getElementById('BoardSection').style.overflowY = 'hidden'
    document.getElementById('searchInput').value = '';
    openDetailTask(index);
}


/**
 * This function close the Task Detail Site and activate the scrollbar
 * 
 */
function closeTask() {
    document.getElementById('taskDetail').classList.add('d-none');
    document.getElementById('BoardSection').style.overflowY = 'auto';
}


/**
 * This Function load all informations of the current Task
 * 
 * @param {Number} index - Index Position of current Task
 */
function openDetailTask(index) {
    let task = AllTask[index];
    taskContentHtML(index, task);
    getCurrentState(task);
    getSubtasks(task, index);
    getAssignedUser(task, index);
}


function taskContentHtML(index, task) {
    let taskContent = document.getElementById('addtask-dialog');
    taskContent.innerHTML = '';
    taskContent.innerHTML +=  /*html*/`
    <div class="borderBoardDetailTask">
        <div class="detailHeader">
            <span class="taskCategory">${task.Category}</span>
            <img class="closeHeader" src="assets/images/close_X_black.svg" alt="close" onclick="closeTask()">
        </div>
        <h2 id="taskTitle-${index}" class="taskTitleDetail">${task.title}</h2>
        <span class="taskDescriptionDetail">${task.Description}</span>
        <div class="detailDatePrioAssigned">
            <span>Date: ${task.date}</span>
            <span>Prio: ${task.Prio}</span>
            <span class="d-flex ai-start fd-column gap-8 overflow" id="selected-assigned-user${index}"></span>
            <span class="d-flex ai-start fd-column gap-8" id="subtasks-view${index}"></span>
        </div>
        <div class="btn-deleteEdit">
            <select name="stateChoice" id="stateChoice" placeholder="change State" onchange="changeState(${index})">
                <option value="stateToDo">To do</option>
                <option value="stateInProgress">in Progress</option>
                <option value="stateAwaitFeedback">await feedback</option>
                <option value="stateDone">Done</option>
            </select>
            <div class="edit-options-seperator"></div>
            <button onclick="deleteTask(${index})"><img src="assets/images/delete.svg" alt="delete">Delete</button>
            <div class="edit-options-seperator"></div>
            <button onclick="openDialogEdit(${index})"><img src="assets/images/edit_white.svg" alt="edit">Edit</button>
        </div>
    </div>
    `;
}

/**
 * This function is used to remove the current Task
 * 
 * @param {Number} index - Index Position of current Task
 */
async function deleteTask(index) {
    AllTask.splice(index, 1);
    await saveAllTaskRemote();
    await updateHTML();
    closeTask();
}


/**
 * This function ist used to save the curent allTask Array
 * 
 */
async function saveAllTaskRemote() {
    var jsonString = JSON.stringify(AllTask);
    await setItem('AllTask', jsonString);
}


/**
 * This function is used to generate a List of all Subtasks as HTML Content
 * 
 * @param {object} task - the current Task
 * @returns {String} - returns List as a HTML code
 */
function currentSubtasks(task) {
    let subtasksHTML = '';
    for (let i = 0; i < task.Subtasks.length; i++) {
        subtasksHTML += `
            <ul>
                <li>${task.Subtasks[i].task}</li>
            </ul>
        `;
    }
    return subtasksHTML;
}


/**
 * This function generate a Name List of all Contacts
 * 
 * @returns {String} - returns List as a HTML Code
 */
function currentContacts() {
    let subtasksHTML = '';
    for (let c = 0; c < contacts.length; c++) {
        subtasksHTML += `<span>${contacts.name}</span>,`;
    }
    return subtasksHTML;
}


/**
 * This function is used to generate a dynamic HTML Code
 * 
 * @param {String} assignedUserColor - is the Color as hex value
 * @param {String} assignedUserInitials - is the initials of user
 * @param {String} assignedUserName - is the Name of User
 * @returns {String} - returns a List as HTML Code
 */
function template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName) {
    return `
        <div class="d-flex gap-8 ai-center">
            <div style="background-color:${assignedUserColor}" class="initialscirclecontact d-flex center">${assignedUserInitials}</div>
            <div>${assignedUserName}</div>
        </div>`;
}


/**
 * This Function is used to generate a dynamic HTML Code
 * 
 * @param {String} subtask - Current Subtask
 * @param {Number} i - index Position of current Subtask in Subtask Array
 * @param {Number} index - index Position of the Current Task in AllTask
 * @param {Boolean} state - State of current Subtask
 * @returns {String} - Returns a List as HTML Code
 */
function template_SubtasksShow(subtask, i, index, state) {
    return `
    <div class="d-flex gap-8 ai-center">
    <div class="gap-8">
        <input onclick="checkIfSubtaskIsDone(${index},${i})" type="checkbox" ${state} id="${i}" class="d-flex center"></div>
        <div>${subtask['task']}</div>
    </div>
    </div>`;
}


// ############################################################
// Search Filed function


/**
 * This functions show the Search content
 */
function searchFieldToggle() {
    document.getElementById('searchContent').classList.toggle('d-none');
}


/**
 * This function get user input and filter the AllTask array on Name
 * 
 */
function searchTask() {
    let pressedKey = document.getElementById('searchInput').value;
    let setSearchContent = document.getElementById('searchContent');
    if (setSearchContent.classList.contains('d-none')) {
        setSearchContent.classList.remove('d-none');
    }
    let AllTask_Temp = AllTask;
    if (pressedKey !== '') {
        AllTask_Temp = AllTask.filter(c => c.title.toLowerCase().startsWith(pressedKey.toLowerCase()));
    }
    generateHtmlSearchContent(AllTask_Temp);
}


/**
 * This Function is used to generate a list of search result as dynamic HTML Code
 * 
 * @param {Array} AllTask_Temp - A Array of filtered Tasks
 */
function generateHtmlSearchContent(AllTask_Temp) {
    let setSearchContent = document.getElementById('searchContent');
    setSearchContent.innerHTML = '';
    for (let i = 0; i < AllTask_Temp.length; i++) {
        const element = AllTask_Temp[i];
        let indexPosition = getIndexPosition(element);
        setSearchContent.innerHTML += `<div class="search-field-line" onclick="openTask(${indexPosition})">${element.title}</div>`;
    }
}


// End Search Filed function
// ############################################################


/**
 * This function is used to get all Subtasks of a Tasks an render a Progress Bar
 * 
 * @param {Number} index - index Position of current Task
 */
function generateProgressBar(index) {
    let subTasksLength = AllTask[index]['Subtasks'].length;
    if (subTasksLength >= 1) {
        let subTasksDoneLength = AllTask[index]['Subtasks'].filter(state => state.stateDone == true).length;
        document.getElementById(`progress-bar${index}`).innerHTML = `<progress id="file" value="${subTasksDoneLength}" max="${subTasksLength}"></progress>Subtasks${subTasksDoneLength}/${subTasksLength}`;
    }
}

// drag drop mobile widget
// ############################################################


/**
 * This function ist used to change the state of the current task in AllTaskk Array
 * 
 * @param {Number} index - index Position of current Task
 */
async function changeState(index) {
    let currentState = document.getElementById('stateChoice').value;
    AllTask[index]['state'] = currentState;
    await save();
    updateHTML();
}


/**
 * This function is used to get the current state of a Task From Storage
 * 
 * @param {Object} task - current Task
 */
function getCurrentState(task) {
    let currentState = task['state'];
    document.getElementById('stateChoice').value = currentState;
}


// End drag drop mobile widget
// ############################################################