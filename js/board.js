let currentDraggedElement;
let currentState;


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



function render() {
    let content = document.getElementById(`open`);
    let noToDoDiv = document.querySelector('.no-to-do');

    content.innerHTML = '';

    if (AllTask.length > 0) {
        for (let i = 0; i < AllTask.length; i++) {
            const task = AllTask[i];

            content.innerHTML += /*html*/`
            <div id="borderBoard-${i}" class="borderBoard" draggable="true" onclick="openTask(${i})" ondragstart="startDragging(${i})" ondrop="moveTo('open')"
                    ondragover="allowDrop(event)">
                <span class="taskCategory">${task.Category}</span>
                <h3 class="taskTitle">${task.title}</h3>
                <span class="taskDescription">${task.Description}</span>
                <span>Assigned to: ${task.Assigned}</span>
                <span>Date: ${task.date}</span>
                <span>Prio: ${task.Prio}</span>
                Subtasks: [],
            </div>
            `;

        }

        noToDoDiv.style.display = 'none';
    } else {
        noToDoDiv.style.display = 'block';
    }
}

// function updateHTML() {
//     let open = AllTask.filter(task => task['state'] == 'todo');

//     document.getElementById('todo').innerHTML = '';

//     for (let index = 0; index < open.length; index++) {
//         const element = AllTask[index];
//         document.getElementById('todo').innerHTML += generateTodoHTML(element);
//     }

// }



function updateHTML() {
    //To Do---------------------------------
    let open = AllTask.filter(task => task['state'] == 'todo');

    document.getElementById('open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    //In Progress---------------------------------
    let closed = AllTask.filter(task => task['state'] == 'todo');

    document.getElementById('closed').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }

    //Await feedback---------------------------------
    let stateAwaitFeedback = AllTask.filter(task => task['state'] == 'todo');

    document.getElementById('open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    //Done---------------------------------
    let stateDone = AllTask.filter(task => task['state'] == 'todo');

    document.getElementById('closed').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }
}


function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}

function startDragging(i) {
    currentDraggedElement = i;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    AllTask[currentDraggedElement]['state'] = category;
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
