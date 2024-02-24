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
/**
 * Initializes the task board with the specified active section.
 *
 * @param {string} activeSection - The ID of the section that should be marked as active.
 */
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


// REDIRECTION FROM BOARD TO ADD TASK - START
/**
 * Event listener for the "resize" event, triggering the checkScreenWidth function.
 *
 * @event window
 * @type {EventListener}
 */
window.addEventListener("resize", checkScreenWidth);


/**
 * Checks the screen width and redirects to 'addTask.html' if necessary.
 * 
 * @param {HTMLElement} modal - The modal element with the ID "myModal".
 */
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


/**
 * Opens the modal and fetches the addTask template if the window width is greater than 600 pixels.
 * Redirects to 'addTask.html' if the window width is 600 pixels or less.
 *
 * @param {HTMLElement} modal - The modal element with the ID "myModal".
 */
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

/**
 * Saves the provided board state to local storage after converting it to JSON.
 *
 * @param {string} boardState 
 */
function saveBoardStateLocal(boardState) {
    let boardStateJSON = JSON.stringify(boardState);
    localStorage.setItem('boardState', boardStateJSON);
}

/**
 * Loads the saved board state from local storage and parses it from JSON.
 * 
 * @returns {string} - The parsed board state if found in local storage, or null if not found.
 */
function loadSavedBoardStateLocal() {
    if (localStorage.getItem('boardState')) {
        let boardStateJSON = localStorage.getItem('boardState');
        boardStateJSON = JSON.parse(boardStateJSON);
        return boardStateJSON;
    }
}

/**
 * Closes the modal, sets body overflow to 'visible', saves the edited task ID as null,
 * and initializes the board with the active section set to 'board'.
 *
 * @param {HTMLElement} modal - The modal element with the ID "myModal".
 * @event window
 * @type {EventListener} - Event listener for clicks outside the modal, closing the modal if clicked.
 */
function closeModal() {
    modal = document.getElementById("myModal");
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    /**
     * Closes the modal, sets body overflow to 'visible', saves the edited task ID as null,
     * and initializes the board with the active section set to 'board'.
     */
    boardState = 'todo';
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
    saveEditedTaskIdLocal(null);
    saveBoardStateLocal(null);
    initBoard('board');
}


/**
 * Event listener for the "resize" event, triggering the checkScreenWidth function.
 *
 * @event window
 * @type {EventListener}
 */
window.addEventListener("resize", checkScreenWidth);
// REDIRECTION FROM BOARD TO ADD TASK - END


/**
 * Opens a modal displaying detailed information about a specific task.
 *
 * @param {string|number} taskUIndex - The unique index of the task to be displayed.
 * @param {HTMLElement} modal - The modal element with the ID "customModal".
 */
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


/**
 * Closes the task modal, sets body overflow to 'visible'.
 *
 * @param {HTMLElement} modal - The modal element with the ID "customModal".
 * @type {EventListener} - Event listener for clicks outside the modal, closing the modal if clicked.
 */
function closeTask() {
    const modal = document.getElementById("customModal");

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Closes the modal if the click target is the modal itself.
        }
    }
    /**
     * Closes the modal and sets body overflow to 'visible'.
     */
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
}


//Filter Function
/**
 * This function filters the available tasks by its state (todo, in progress, await feedback etc) and displays them at its section.
 * If there is no Task for a section, no task todo will be shown.
 *
 * @param {string} state - The parameter which to sort, also for the ID of its div-element.
 */
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

/**
 * Attaches an event listener to the 'DOMContentLoaded' event to handle tasks when the document is fully loaded.
 *
 * @event DOMContentLoaded
 * @param {Function} callback - The function to be executed when the 'DOMContentLoaded' event occurs.
 */
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterTasksByTitle();
        });
    }
});


//Drag n' Drop
/**
 * Allows a drop event by preventing its default behavior, making an element droppable.
 *
 * @param {Event} event - The drop event object.
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * Initiates the dragging operation by setting the currently dragged element.
 *
 * @param {string} id - The identifier of the element to be dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * Moves a task to a new state and updates the task list in local storage.
 * 
 * @param {string} state - The new state to which the task should be moved.
 */
async function moveTo(state) {
    tasks.forEach(task => {
        if (task.uniqueIndex == currentDraggedElement) {
            task.state = state;
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
    initBoard('board');
}


/**
 * Extracts the updated subtasks from the subtask form in the UI (Board).
 *
 * @returns {string[]} - An array containing the updated subtasks.
 * @param {HTMLElement} subtaskList - The HTML element representing the container for subtasks in the UI.
 * @param {NodeList} subtaskInputs - The NodeList containing all subtask list elements in the subtask form.
 * @param {string[]} updatedSubtasks - An array to store the updated subtasks.
 *
 */
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


/**
 * Generates HTML template for displaying subtasks in the big task view.
 * 
 * @param {Object} task - The task object containing subtasks to be displayed.
 * @returns {string} The HTML template for displaying subtasks in the big task view.
 */
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


/**
 * Checks if the current page is 'board.html', and takes appropriate actions.
 * 
 */
function checkIfRedirectionToBoardIsAvailable() {
    if (window.location.href.includes('board.html')) {
        initBoard('board');
        closeModal();
    } else {
        window.location.href = 'board.html';
    }
    saveEditedTaskIdLocal(null);
}


/**
 * Saves the provided task ID to local storage for later retrieval.
 * 
 * @param {string|number} taskId - The ID of the task to be edited
 */
function saveEditedTaskIdLocal(taskId) {
    let eTaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('taskToEdit', eTaskAsJSON);
}


/**
 * Retrieves and parses the edited task from local storage.
 * 
 * @returns {Object|null} The edited task object, or null if not found.
 */
function loadEditedTaskLocal() {
    if (localStorage.getItem('taskToEdit')) {
        let etaskAsJSON = localStorage.getItem('taskToEdit');
        eTask = JSON.parse(etaskAsJSON);
        return eTask;
    }
}



/**
 * Saves the provided task ID to local storage for later retrieval.
 * 
 * @param {string|number} taskId - The ID of the task to be edited
 */
function saveSubtaskStatusLocal(taskId) {
    let subtaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('subtaskStatus', subtaskAsJSON);
}


/**
 * Saves the width of the progress bar for a specific task to local storage.
 * 
 * @param {string|number} taskId - The ID of the task.
 * @param {number} width - The width of the progress bar.
 */

function saveProgressBarWidthLocal(taskId, width) {
    const progressBarWidth = loadProgressBarWidthLocal();
    progressBarWidth[taskId] = width;
    localStorage.setItem('progressBarWidth', JSON.stringify(progressBarWidth));
}


/**
 * Loads the saved subtask status from local storage and parses it from JSON.
 * 
 * @returns {Object} - The parsed subtask status if found in local storage, or an empty object if not found.
 */

function loadSubtaskStatusLocal() {
    if (localStorage.getItem('subtaskStatus')) {
        let subtaskAsJSON = localStorage.getItem('subtaskStatus');
        return JSON.parse(subtaskAsJSON);
    }
    return {};
}


/**
 * Loads the saved progress bar widths from local storage and parses them from JSON.
 * If no progress bar widths are found, returns an empty object.
 * 
 * @returns {Object} - The parsed progress bar widths if found in local storage, or an empty object if not found.
 */
function loadProgressBarWidthLocal() {
    let progressBarWidth = JSON.parse(localStorage.getItem('progressBarWidth')) || {};
    return progressBarWidth; // Gebe progressBarWidth direkt zurück
}