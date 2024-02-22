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


function openTask() {
    document.getElementById('taskDetail').classList.remove('d-none');
    // document.getElementById('taskContent').classList.remove('main');
}


function render() {
    let content = document.getElementById('borderBoard');
    let noToDoDiv = document.querySelector('.no-to-do');
    let taskContent = document.getElementById('taskDetail');

    content.innerHTML = '';

    if (AllTask.length > 0) {
        for (let i = 0; i < AllTask.length; i++) {
            const task = AllTask[i];

            content.innerHTML += /*html*/`
            <div class="borderBoard" onclick="openTask()">
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

    taskContent = '';
    taskContent += taskContentHtML();

}


function taskContentHtML(){
    return /*html*/`
    <h1>test</h1>
    
    
    
    `;
}

