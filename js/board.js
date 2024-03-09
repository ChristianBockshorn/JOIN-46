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
            <span class="d-flex ai-start fd-column gap-8" id="selected-assigned-user${f}"></span>
            <span>Date: ${element.date}</span>
            <span>Prio: ${element.Prio}</span>
            <span class="d-flex ai-start fd-column gap-8" id="subtasks-view${index}"></span>
        </div>
    `;
}

// Kontakte laden
async function init() {
    await loadAllTasks();
    await getData();
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

function checkIfSubtaskIsDone(index, i) {
    let selectetTask = AllTask[index]['Subtasks'][i]['stateDone'];
    selectetTask = !selectetTask;
    AllTask[index]['Subtasks'][i]['stateDone'] = selectetTask;
    var jsonString = JSON.stringify(AllTask);
    localStorage.setItem('AllTask', jsonString);
    // setItem('AllTask', jsonString);
}

function getIndexPosition(element){
    // console.log(element);
    let searchWord = element.title;
    let indexPosition = AllTask.findIndex(task => task.title == searchWord)
    // console.log(indexPosition);
    return indexPosition;
}


async function updateHTML() {
    await init();

    //To Do---------------------------------
    let stateToDo = AllTask.filter(task => task['state'] == 'stateToDo');

    document.getElementById('stateToDo').innerHTML = '';
    for (let index = 0; index < stateToDo.length; index++) {
        const element = stateToDo[index];
        // console.log(element);
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateToDo').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUser(element, indexPosition);
    }

    //In Progress---------------------------------
    let stateInProgress = AllTask.filter(task => task['state'] == 'stateInProgress');

    document.getElementById('stateInProgress').innerHTML = '';

    for (let index = 0; index < stateInProgress.length; index++) {
        const element = stateInProgress[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateInProgress').innerHTML += generateHtmlContent(element, index,indexPosition);
        getAssignedUser(element, indexPosition);
    }

    //Await feedback---------------------------------
    let stateAwaitFeedback = AllTask.filter(task => task['state'] == 'stateAwaitFeedback');

    document.getElementById('stateAwaitFeedback').innerHTML = '';

    for (let index = 0; index < stateAwaitFeedback.length; index++) {
        const element = stateAwaitFeedback[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateAwaitFeedback').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUser(element, indexPosition);
    }

    //Done---------------------------------
    let stateDone = AllTask.filter(task => task['state'] == 'stateDone');

    document.getElementById('stateDone').innerHTML = '';

    for (let index = 0; index < stateDone.length; index++) {
        const element = stateDone[index];
        let indexPosition = getIndexPosition(element);
        document.getElementById('stateDone').innerHTML += generateHtmlContent(element, index, indexPosition);
        getAssignedUser(element, indexPosition);
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
        let updatedTasksAsString = JSON.stringify(AllTask);
        setItem('AllTask',updatedTasksAsString);
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
    getIndexPosition = 
    getAssignedUser(task, index);
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
            <!-- <span>Assigned to: ${contacts[index].name}</span>
            // <span>Assigned to: ${currentContacts()}</span>-->
            <!--<span>Subtasks: ${currentSubtasks(task)}</span>-->
            <span>Subtasks: ${getSubtasks(task, index)}</span>
        </div>
        
    </div>
    `;
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