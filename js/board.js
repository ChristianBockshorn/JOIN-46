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
        <div id="borderBoard-${element['id']}" class="borderBoard" draggable="true" onclick="openTask(${element['id']})" ondragstart="startDragging(${element['id']})">
            <span class="taskCategory">${element.Category}</span>
            <h3 class="taskTitle">${element.title}</h3>
            <span class="taskDescription">${element.Description}</span>
            <span class="d-flex ai-start fd-column" id="selected-assigned-user${index}">Assigned to: ${element.Assigned}</span>
            <span>Date: ${element.date}</span>
            <span>Prio: ${element.Prio}</span>
            Subtasks: [],
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
    assignedUsersField.innerHTML = 'Assigned to:<br>';
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUserID = assignedUsers[i];
        let assignedUserName = contacts[assignedUserID]['name'];
        let assignedUserColor = contacts[assignedUserID]['usercolor'];
        let assignedUserInitials = contacts[assignedUserID]['initials'];
        console.log(assignedUserName);
        assignedUsersField.innerHTML += template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName);
    }
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

function openTask(i) {
    document.getElementById('taskDetail').classList.remove('d-none');
    openDetailTask(i);
}


function closeTask() {
    document.getElementById('taskDetail').classList.add('d-none');
}

function openDetailTask(i) {
    const task = AllTask[i];
    taskContentHtML(i, task);
}

function taskContentHtML(i, task) {
    let taskContent = document.getElementById('addtask-dialog');
    taskContent.innerHTML = '';
    taskContent.innerHTML +=  /*html*/`
        
    <div class="borderBoardDetailTask">
        <div class="detailHeader">
            <span class="taskCategory">${task.Category}</span>
            <img class="closeHeader" src="assets/images/close_X_black.svg" alt="close" onclick="closeTask()">
        </div>
        
        <h2 id="taskTitle-${i}" class="taskTitleDetail">${task.title}</h2>
        <span class="taskDescriptionDetail">${task.Description}</span>
        
        <div class="detailDatePrioAssigned">
            <span>Date: ${task.date}</span>
            <span>Prio: ${task.Prio}</span>
            <span>Assigned to: ${task.Assigned}</span>
        </div>
        
    </div>
    `;
}


function template_AssignedUsers(assignedUserColor, assignedUserInitials, assignedUserName) {
    return `
        <div class="d-flex gap-8 ai-center">
            <div style="background-color:${assignedUserColor}" class="initialscirclecontact d-flex center">${assignedUserInitials}</div>
            <div>${assignedUserName}</div>
        </div>`;
}