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

function loadAllTasks() {
    let AllTaskAsString = localStorage.getItem('AllTask');
    AllTask = JSON.parse(AllTaskAsString);
    console.log('loaded task', AllTask);

    render();
}

function render() {
    console.log('test')
    let content = document.getElementById("borderBoard");
    content.innerHTML = '';
    content.innerHTML += /* html */`
    <span class="taskCategory">${AllTask[0].Category}</span>
    <h3 class="taskTitle">${AllTask[0].title}</h3>
    <span class="taskDescription">${AllTask[0].Description}</span>
    <span>Assigned to: ${AllTask[0].Assigned}</span>
    <span>Date: ${AllTask[0].date}</span>
    <span>Prio: ${AllTask[0].Prio}</span>
    
    Subtasks: [],
    `;
}



