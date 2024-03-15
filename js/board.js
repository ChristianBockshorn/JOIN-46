let currentDraggedElement;



function openDialog() {
    document.getElementById('dialog').classList.remove('d-none');
    document.getElementById('mainContent').classList.remove('main');
}


function closeDialog() {
    document.getElementById('dialog').classList.add('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}



// function render() {
//     let content = document.getElementById(`stateToDo`);
//     let noToDoDiv = document.querySelector('.no-to-do');

//     content.innerHTML = '';

//     if (AllTask.length > 0) {
//         for (let i = 0; i < AllTask.length; i++) {
//             const element = AllTask[i];
//             content.innerHTML += generateHtmlContent(element,task);            
//         }
//         noToDoDiv.style.display = 'none';
//     } else {
//         noToDoDiv.style.display = 'block';
//     }
// }


function generateHtmlContent(element, index, f) {
    return /*html*/`
        <div id="borderBoard-${element['id']}" class="borderBoard" draggable="true" onclick="openTask(${f})" ondragstart="startDragging(${element['id']})">
            <span class="taskCategory">${element.Category}</span>
            <h3 class="taskTitle">${element.title}</h3>
            <span class="taskDescription">${element.Description}</span>
            <div>Assigned To:
                <div class="pad-l-8 overflow-x">
                    <span class="stapled-icons-line" id="selected-assigned-user-small${f}"></span>
                </div>
            </div>
            <span>Date: ${element.date}</span>
            <span>Prio: ${element.Prio}</span>
            <!--<span class="d-flex ai-start fd-column gap-8" id="subtasks-view${index}"></span>-->
        </div>
    `;
}

// Kontakte laden
async function init() {
    await loadAllTasks();
    await getData();
}



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
            console.error(`Kontakt mit dem Namen ${assignedUsers[i]} nicht gefunden.`);
        }
    }
}


function template_AssignedUsersSmall(assignedUserColor, assignedUserInitials) {
    return `
        <div class="stapled-icons">
            <div style="background-color:${assignedUserColor}" class="initialscirclecontact d-flex center">${assignedUserInitials}</div>
        </div>`;
}


//Funktion zum Wandeln der Übergebenen Personen ID in den Entsprechenden Namen
function getAssignedUser(element, indexPosition) {
    let assignedUsers = element['Assigned'];
    let assignedUsersField = document.getElementById(`selected-assigned-user${indexPosition}`);
    assignedUsersField.innerHTML = 'Assigned To:<br>';
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUserID = contacts.findIndex(x => x.name == assignedUsers[i]);
        let assignedUserName = contacts[assignedUserID]['name'];
        let assignedUserColor = contacts[assignedUserID]['usercolor'];
        let assignedUserInitials = contacts[assignedUserID]['initials'];
        assignedUsersField.innerHTML += template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName);
    }
}


// Funktion zum laden und anzeigen der Untertasks, falls diese Vorhanden sind.
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

async function checkIfSubtaskIsDone(index, i) {
    let selectetTask = AllTask[index]['Subtasks'][i]['stateDone'];
    selectetTask = !selectetTask;
    AllTask[index]['Subtasks'][i]['stateDone'] = selectetTask;
    await saveAllTaskRemote()
}


function renderStateToDo(stateToDo) {
    for (let index = 0; index < stateToDo.length; index++) {
        const element = stateToDo[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateToDo').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUserSmall(element, indexPosition);
    }
}

function renderStateInProgress(stateInProgress) {
    for (let index = 0; index < stateInProgress.length; index++) {
        const element = stateInProgress[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateInProgress').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUserSmall(element, indexPosition);
    }
}

function renderStateAwaitFeedback(stateAwaitFeedback) {
    for (let index = 0; index < stateAwaitFeedback.length; index++) {
        const element = stateAwaitFeedback[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateAwaitFeedback').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUserSmall(element, indexPosition);
    }
}

function renderStateDone(stateDone) {
    for (let index = 0; index < stateDone.length; index++) {
        const element = stateDone[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateDone').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUserSmall(element, indexPosition);
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
        console.log(stateToDo);
        noToDoDiv.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        console.log('kein Task mit state To Do');
        noToDoDiv.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }

    //In Progress---------------------------------
    let stateInProgress = AllTask.filter(task => task['state'] == 'stateInProgress');
    let noToDoDivInProgress = document.querySelector('.no-to-do-InProgress');
    document.getElementById('stateInProgress').innerHTML = '';

    if (stateInProgress.length >= 1) {
        renderStateInProgress(stateInProgress);
        console.log(stateInProgress);
        noToDoDivInProgress.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        console.log('kein Task mit state In progress');
        noToDoDivInProgress.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }

    //Await feedback---------------------------------
    let stateAwaitFeedback = AllTask.filter(task => task['state'] == 'stateAwaitFeedback');
    let noToDoDivAwaitFeedback = document.querySelector('.no-to-do-AwaitFeedback');
    document.getElementById('stateAwaitFeedback').innerHTML = '';

    if (stateAwaitFeedback.length >= 1) {
        renderStateAwaitFeedback(stateAwaitFeedback);
        console.log(stateAwaitFeedback);
        noToDoDivAwaitFeedback.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        console.log('kein Task mit state Await feedback');
        noToDoDivAwaitFeedback.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }

    //Done---------------------------------
    let stateDone = AllTask.filter(task => task['state'] == 'stateDone');
    let noToDoDivDone = document.querySelector('.no-to-do-Done');
    document.getElementById('stateDone').innerHTML = '';

    if (stateDone.length >= 1) {
        renderStateDone(stateDone);
        console.log(stateDone);
        noToDoDivDone.style.display = 'none'; //Ausblenden des grauen Platzhalters "No Task To do"
    } else {
        console.log('kein Task mit state Done');
        noToDoDivDone.style.display = 'block'; //Einblenden des grauen Platzhalters "No Task To do"
    }

}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    document.location = '#board'
    ev.preventDefault();

}

async function moveTo(category) {
    const taskIndex = AllTask.findIndex(task => task.id === currentDraggedElement);

    if (taskIndex !== -1) {
        AllTask[taskIndex].state = category;
        // let updatedTasksAsString = JSON.stringify(AllTask);
        // await setItem('AllTask', updatedTasksAsString);
        await saveAllTaskRemote();
    } else {
        console.error("Task not found in AllTask array");
    }
    updateHTML();
}

function openTask(index) {
    document.getElementById('taskDetail').classList.remove('d-none');
    document.getElementById('searchContent').classList.add('d-none');
    document.getElementById('searchInput').value = '';
    openDetailTask(index);
}


function closeTask() {
    document.getElementById('taskDetail').classList.add('d-none');
}

function openDetailTask(index) {
    let task = AllTask[index];
    taskContentHtML(index, task);
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
            <button onclick="deleteTask(${index})"><img src="assets/images/delete.svg" alt="delete">Delete</button>
            <div class="edit-options-seperator"></div>
            <button onclick="editTask()"><img src="assets/images/edit_white.svg" alt="edit">Edit</button>
        </div>
        
    </div>
    `;
}

async function deleteTask(index) { 
    AllTask.splice(index, 1);
    await saveAllTaskRemote();
    await updateHTML();
    closeTask();
}

async function saveAllTaskRemote() {
    var jsonString = JSON.stringify(AllTask);
    await setItem('AllTask', jsonString);
}



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


function currentContacts() {
    let subtasksHTML = '';
    for (let c = 0; c < contacts.length; c++) {
        subtasksHTML += `<span>${contacts.name}</span>,`;
    }
    return subtasksHTML;
}


function template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName) {
    return `
        <div class="d-flex gap-8 ai-center">
            <div style="background-color:${assignedUserColor}" class="initialscirclecontact d-flex center">${assignedUserInitials}</div>
            <div>${assignedUserName}</div>
        </div>`;
}





function template_SubtasksShow(subtask, i, index, state) {
    return `
    <div class="d-flex gap-8 ai-center">
    <div class="gap-8">
        <input onclick="checkIfSubtaskIsDone(${index},${i})" type="checkbox" ${state} id="${i}" class="d-flex center"></div>
        <div>${subtask['task']}</div>
    </div>
    </div>`;
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('searchInput').addEventListener('focus', showSearchContent);
  });


function searchTask() {
    let pressedKey = document.getElementById('searchInput').value;
    let AllTask_Temp = AllTask.filter(c => c.title.toLowerCase().startsWith(pressedKey.toLowerCase()));
    let setSearchContent = document.getElementById('searchContent');

    setSearchContent.innerHTML = '';
    for (let i = 0; i < AllTask_Temp.length; i++) {
        const element = AllTask_Temp[i];
        let indexPosition = getIndexPosition(element);
        setSearchContent.innerHTML += `<div class="search-field-line" onclick="openTask(${indexPosition})">${element.title}</div>`;
        console.log(element);
    }
}