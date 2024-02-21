function openDialog(text) {
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
    let content = document.getElementById("borderBoard");
    content.innerHTML = '';
    for (let i = 0; i < AllTask.length; i++) {
        const task = AllTask[i];

        content.innerHTML += /*html*/`
        <div class="borderBoard">
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

}





