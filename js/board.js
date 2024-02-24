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
    let content = document.getElementById(`borderBoard`);
    let noToDoDiv = document.querySelector('.no-to-do');

    content.innerHTML = '';

    if (AllTask.length > 0) {
        for (let i = 0; i < AllTask.length; i++) {
            const task = AllTask[i];

            content.innerHTML += /*html*/`
            <div id="borderBoard(${i})" class="borderBoard" onclick="openTask(${i})">
                <span class="taskCategory">${task.Category}</span>
                <h3 class="taskTitle">${task.title}</h3>
                <span class="taskDescription">${task.Description}</span>
                <span>Assigned to: ${task.Assigned}</span>
                <span>Date: ${task.date}</span>
                <span>Prio: ${task.Prio}</span>
                Subtasks: [],
            </div>
            `;

            // taskContentHtML(i, task, taskTitle);
        }

        noToDoDiv.style.display = 'none';
    } else {
        noToDoDiv.style.display = 'block';
    }
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

let currentDraggedElement;
let selectedSubtaskIndex = null;
let subtaskStatus = {};
let progressBarWidth = {};
let modal;
let boardState = 'todo';

async function initBoard(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchTasks();
    await fetchContacts();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    classifyTask();
    filterTasksByTitle();
    assignContact();
    setMinDate();
    subtaskStatus = loadSubtaskStatusLocal() || {};
    progressBarWidth = loadProgressBarWidthLocal() || {}; // Ändere hier
    initProgressBarWidth();
}


function checkScreenWidth() {
    modal = document.getElementById("myModal");
    if (modal) { // Checks if the modal exists and the window width is less than or equal to 600 pixels.
        if (window.innerWidth <= 600) {
            if (modal.style.display === "block") {
                window.location.href = 'addTask.html'; // Redirects to 'addTask.html' if the modal is currently displayed.
            }
        }
    }
}


function openModal(state) {
    boardState = state;
    saveBoardStateLocal(boardState);
    modal = document.getElementById("myModal");
    if ((window.innerWidth > 600)) {
        fetch("assets/templates/addTask.template.html")
            .then((response) => response.text())
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    } else {
        window.location.href = 'addTask.html';
    }
}

function saveBoardStateLocal(boardState) {
    let boardStateJSON = JSON.stringify(boardState);
    localStorage.setItem('boardState', boardStateJSON);
}


function loadSavedBoardStateLocal() {
    if (localStorage.getItem('boardState')) {
        let boardStateJSON = localStorage.getItem('boardState');
        boardStateJSON = JSON.parse(boardStateJSON);
        return boardStateJSON;
    }
}

function closeModal() {
    modal = document.getElementById("myModal");
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
   
    boardState = 'todo';
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
    saveEditedTaskIdLocal(null);
    saveBoardStateLocal(null);
    initBoard('board');
}


function openTask(taskUIndex) {
    let modal = document.getElementById("customModal");
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    tasks.forEach(task => {
        if (task.uniqueIndex == taskUIndex) {
            renderBigTask(task)
        }
    });
}


function closeTask() {
    const modal = document.getElementById("customModal");

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Closes the modal if the click target is the modal itself.
        }
    }
  
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
}


function filterTasksByTitle() {
    const input = document.getElementById('searchInput');
    const searchTerm = input.value.trim().toLowerCase();
    const taskContainers = document.querySelectorAll('.status-board');

    taskContainers.forEach((taskContainer) => {
        const titleElement = taskContainer.querySelector('.task-title');
        const descriptionElement = taskContainer.querySelector('.short-info');

        if (titleElement && descriptionElement) {
            const title = titleElement.textContent.toLowerCase();
            const description = descriptionElement.textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                taskContainer.style.display = 'block';
            } else {
                taskContainer.style.display = 'none';
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterTasksByTitle();
        });
    }
});

function allowDrop(event) {
    event.preventDefault();
}


function startDragging(id) {
    currentDraggedElement = id;
}

async function moveTo(state) {
    tasks.forEach(task => {
        if (task.uniqueIndex == currentDraggedElement) {
            task.state = state;
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
    initBoard('board');
}



function extractSubtasksFromForm() {
    const subtaskList = document.getElementById('subtaskContainer');
    const subtaskInputs = subtaskList.querySelectorAll('.subtaskListElements');
    const updatedSubtasks = [];

    for (let i = 0; i < subtaskInputs.length; i++) { // Iterates through the subtask list elements and extracts the text content as updated subtasks.
        const subtaskInput = subtaskInputs[i];
        updatedSubtasks.push(subtaskInput.innerText);
    }

    return updatedSubtasks; // Returns the array containing the updated subtasks.
}


subtaskStatus = loadSubtaskStatusLocal() || {};
function renderBigTaskSubtasks(task) {
    return /*html*/`
    <span style="color: #42526E;">Subtasks</span>
    <span>
    <ul id="subtaskIndex${task.uniqueIndex}">
        ${task.subtasks.map((subtask, index) => `
        <li class="list-style">
            <img id="chopImg" class="chop-image ${subtaskStatus[task.uniqueIndex] && subtaskStatus[task.uniqueIndex][index] ? 'changed-image' : 'initial-image'}" src="assets/images/chop.svg" onclick="toggleSubtaskImage(${index}, ${task.uniqueIndex});" alt="">
            <img class="rectangle-image ${subtaskStatus[task.uniqueIndex] && subtaskStatus[task.uniqueIndex][index] ? 'initial-image' : 'changed-image'}" src="assets/images/Rectangle.svg" onclick="toggleSubtaskImage(${index}, ${task.uniqueIndex});" alt="">
            ${subtask}
        </li>
        `).join('')}
    </ul>
    </span>
    `
}

function checkIfRedirectionToBoardIsAvailable() {
    if (window.location.href.includes('board.html')) {
        initBoard('board');
        closeModal();
    } else {
        window.location.href = 'board.html';
    }
    saveEditedTaskIdLocal(null);
}


function saveEditedTaskIdLocal(taskId) {
    let eTaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('taskToEdit', eTaskAsJSON);
}


function loadEditedTaskLocal() {
    if (localStorage.getItem('taskToEdit')) {
        let etaskAsJSON = localStorage.getItem('taskToEdit');
        eTask = JSON.parse(etaskAsJSON);
        return eTask;
    }
}


function saveSubtaskStatusLocal(taskId) {
    let subtaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('subtaskStatus', subtaskAsJSON);
}


function saveProgressBarWidthLocal(taskId, width) {
    const progressBarWidth = loadProgressBarWidthLocal();
    progressBarWidth[taskId] = width;
    localStorage.setItem('progressBarWidth', JSON.stringify(progressBarWidth));
}


function loadSubtaskStatusLocal() {
    if (localStorage.getItem('subtaskStatus')) {
        let subtaskAsJSON = localStorage.getItem('subtaskStatus');
        return JSON.parse(subtaskAsJSON);
    }
    return {};
}


function loadProgressBarWidthLocal() {
    let progressBarWidth = JSON.parse(localStorage.getItem('progressBarWidth')) || {};
    return progressBarWidth; // Gebe progressBarWidth direkt zurück
}