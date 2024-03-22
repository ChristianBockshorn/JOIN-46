function showUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


function showUpdateUserDialog(i) {
    document.getElementById('options').classList.remove('options-slidein');
    document.getElementById('options').classList.remove('show-on-mobile');
    document.getElementById('update_user_window').classList.remove('d-none');
    document.getElementById('name').value = contacts[i]['name'];
    document.getElementById('mail').value = contacts[i]['email'];
    document.getElementById('phone').value = contacts[i]['telephone'];
    document.getElementById('del-btn').value = i;
    document.getElementById('submit-btn').value = i;
}


async function deleteUser(i) {
    let nr = parseInt(document.getElementById('del-btn').value);
    if (!i) {
        i = nr;
    }
    let userNameToDelete = contacts[i]['name'];
    cleanUserFromAvailableTask(userNameToDelete);
    contacts.splice(i, 1);
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('contacts-detail').classList.add('contacts-detail');
    await saveData(contacts);
    await renderContacts();
    closeDialog();
}


async function editUser() {
    debugger;
    let editname = document.getElementById('name').value;
    let editemail = document.getElementById('mail').value;
    let edittelephone = document.getElementById('phone').value;
    let editnr = document.getElementById('submit-btn').value;
    contacts[editnr] = {
        name: editname,
        email: editemail,
        initials: generateInitials(editname),
        usercolor: getRandomColor(),
        telephone: edittelephone
    };
    await saveData(contacts);
    await renderContacts();
    generateDetails(editnr);
    document.getElementById('main-content').style.display = 'flex'
    closeDialog();
}


function clearForm() {
    document.getElementById('newname').value = '';
    document.getElementById('newmail').value = '';
    document.getElementById('newphone').value = '';
}

function getNewContactPos(newname) {
    if (usern = contacts.find(c => c.name == newname)) {
        let arrayPos = contacts.indexOf(usern);
        return arrayPos;
    }
}


async function addNewUser() {
    let newname = document.getElementById('newname').value;
    let newemail = document.getElementById('newmail').value;
    let newtelephone = document.getElementById('newphone').value;
    let obj = {
        name: newname,
        email: newemail,
        initials: generateInitials(newname),
        usercolor: getRandomColor(),
        telephone: newtelephone,
    };
    contacts.push(obj);
    await saveData(contacts);
    closeDialog();
    showSuccessMsg('Contact succefully created');
    await renderContacts();
    let arrayPos = getNewContactPos(newname);
    generateDetails(arrayPos);
    clearForm();
}


function closeDialog() {
    document.getElementById('add_user_window').classList.add('d-none');
    document.getElementById('update_user_window').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}


function closeDetails() {
    document.getElementById('contacts-detail').style.display = 'none';
}

function showOptions() {
    document.getElementById('options').classList.add('options-slidein');
    document.getElementById('options').classList.add('show-on-mobile');
    document.getElementById('options').classList.remove('options');
}


async function cleanUserFromAvailableTask(userNameToDelete) {
    let taskTemp = AllTask.filter(task => task.Assigned.includes(userNameToDelete));
    // let matchingIndexes = AllTask.map((task, index) => task.Assigned.includes(userNameToDelete) ? index : null).filter(index => index !== null);
    console.log(taskTemp);
    for (i = 0; taskTemp.length > i; i++) {
        let currentTask = AllTask.find(c => c.title == taskTemp[i].title);
        let currentTaskPos = AllTask.indexOf(currentTask);
        console.log(currentTaskPos);
        let userIndex = AllTask[currentTaskPos]['Assigned'].indexOf(userNameToDelete);
        console.log(userIndex);
        AllTask[currentTaskPos]['Assigned'][userIndex] = 'gelöscht'
    }
    await save();
}

