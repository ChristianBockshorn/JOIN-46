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


function generateHtmlContent(element, index) {
    return /*html*/`
        <div id="borderBoard-${element['id']}" class="borderBoard" draggable="true" onclick="openTask(${index})" ondragstart="startDragging(${element['id']})">
            <span class="taskCategory">${element.Category}</span>
            <h3 class="taskTitle">${element.title}</h3>
            <span class="taskDescription">${element.Description}</span>
            <span class="d-flex ai-start fd-column gap-8" id="selected-assigned-user${index}"></span>
            <span>Date: ${element.date}</span>
            <span>Prio: ${element.Prio}</span>
            <span class="d-flex ai-start fd-column gap-8" id="subtasks-view${index}"></span>
        </div>
    `;
}

// Kontakte laden
async function init() {
    await getData();
}


//Funktion zum Wandeln der Übergebenen Personen ID in den Entsprechenden Namen
function getAssignedUser(element, index) {
    let assignedUsers = element['Assigned'];
    let assignedUsersField = document.getElementById(`selected-assigned-user${index}`);
    assignedUsersField.innerHTML = 'Assigned To:<br>';
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUserID = assignedUsers[i];
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
        let checkedState = element['Subtasks'][i]['done'];
        if (checkedState == true){
            state = 'checked';
        }
        else{
            state = 'unchecked';
        }
        console.log(subtask);
        subtasks.innerHTML += template_SubtasksShow(subtask, i, index, state);
    }
}

function checkIfSubtaskIsDone(index, i, event){
    let selectetTask = AllTask[index]['Subtasks'][i]['done'];
    selectetTask = !selectetTask;
    AllTask[index]['Subtasks'][i]['done'] = selectetTask;
    var jsonString = JSON.stringify(AllTask);
    localStorage.setItem('AllTask',jsonString);
}


async function updateHTML() {
    await init();

    //To Do---------------------------------
    let stateToDo = AllTask.filter(task => task['state'] == 'todo');

    document.getElementById('stateToDo').innerHTML = '';
    for (let index = 0; index < stateToDo.length; index++) {
        const element = stateToDo[index];
        document.getElementById('stateToDo').innerHTML += generateHtmlContent(element, index);
        getAssignedUser(element, index);
        getSubtasks(element, index);
    }

    //In Progress---------------------------------
    let stateInProgress = AllTask.filter(task => task['state'] == 'inProgress');

    document.getElementById('stateInProgress').innerHTML = '';

    for (let index = 0; index < stateInProgress.length; index++) {
        const element = stateInProgress[index];
        document.getElementById('stateInProgress').innerHTML += generateHtmlContent(element);
        getAssignedUser(element, index);
    }

    //Await feedback---------------------------------
    let stateAwaitFeedback = AllTask.filter(task => task['state'] == 'awaitFeedback');

    document.getElementById('stateAwaitFeedback').innerHTML = '';

    for (let index = 0; index < stateAwaitFeedback.length; index++) {
        const element = stateAwaitFeedback[index];
        document.getElementById('stateAwaitFeedback').innerHTML += generateHtmlContent(element);
        getAssignedUser(element, index);
    }

    //Done---------------------------------
    let stateDone = AllTask.filter(task => task['state'] == 'done');

    document.getElementById('stateDone').innerHTML = '';

    for (let index = 0; index < stateDone.length; index++) {
        const element = stateDone[index];
        document.getElementById('stateDone').innerHTML += generateHtmlContent(element);
        getAssignedUser(element, index);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();

}

function moveTo(category) {
    const taskIndex = AllTask.findIndex(task => task.id === currentDraggedElement);

    if (taskIndex !== -1) {
        AllTask[taskIndex].state = category;

    } else {
        console.error("Task not found in AllTask array");
    }
    updateHTML();
}

function openTask(index) {
    document.getElementById('taskDetail').classList.remove('d-none');
    openDetailTask(index);
}


function closeTask() {
    document.getElementById('taskDetail').classList.add('d-none');
}

function openDetailTask(index) {
    let task = AllTask[index];
    taskContentHtML(index, task);
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
            <span>Assigned to: ${task.Assigned}</span>
            <span>Subtasks: ${currentSubtasks(task)}</span>
        </div>
        
    </div>
    `;
    taskContent.innerHTML += template_AssignedUsers(task.assignedUserColor, task.assignedUserInitials, task.assignedUserName);
}

function currentSubtasks(task){
    let subtasksHTML = '<span>Subtasks:</span>';
    for (let i = 0; i < task.Subtasks.length; i++) {
        subtasksHTML += `<span>${task.Subtasks[i]}</span>`;
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
        <input onclick="checkIfSubtaskIsDone(${index},${i},${event})" type="checkbox" ${state} id="${i}" class="d-flex center"></div>
        <div>${subtask['task']}</div>
    </div>
    </div>`;
}