/**
 * Function to add add User form
 */

function showUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


/**
 * Function to show the edit form and load the details from this contact
 * 
 * @param {Number} i - current Contact index Position
 */
function showUpdateUserDialog(i) {
    document.getElementById('options').classList.remove('options-slidein');
    document.getElementById('options').classList.remove('show-on-mobile');
    document.getElementById('update_user_window').classList.remove('d-none');
    document.getElementById('name').value = contacts[i]['name'];
    document.getElementById('mail').value = contacts[i]['email'];
    document.getElementById('contacticon').innerHTML = contacts[i]['initials'];
    document.getElementById('contacticon').style.backgroundColor = contacts[i]['usercolor'];
    document.getElementById('phone').value = contacts[i]['telephone'];
    document.getElementById('del-btn').value = i;
    document.getElementById('submit-btn').value = i;
}


/**
 * Function do delete the selectet User
 * 
 * @param {Number} i - current Contact index Position
 */
async function deleteUser(i) {
    let nr = parseInt(document.getElementById('del-btn').value);
    if (!i) {
        i = nr;
    }
    let userNameToDelete = contacts[i]['name'];
    await cleanUserFromAvailableTask(userNameToDelete);
    contacts.splice(i, 1);
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('contacts-detail').classList.add('contacts-detail');
    await saveData(contacts);
    await renderContacts();
    closeDialog();
}


/**
 * Function to save the edited information on a existing contact
 * 
 */
async function editUser() {
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


/**
 * Function to clean the input Fields
 * 
 */
function clearForm() {
    document.getElementById('newname').value = '';
    document.getElementById('newmail').value = '';
    document.getElementById('newphone').value = '';
}


/**
 * Function to get the Array index position of the last added user
 * 
 * @param {String} newname - The Name of the added Contact
 * @returns {Number} - Returns the Index Positon of the last added User
 */
function getNewContactPos(newname) {
    if (usern = contacts.find(c => c.name == newname)) {
        let arrayPos = contacts.indexOf(usern);
        return arrayPos;
    }
}


/**
 * Function to get inputs from form and save them to the array
 * 
 */
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


/**
 * Function to close the popup Windows for edit and add users
 * 
 */
function closeDialog() {
    document.getElementById('add_user_window').classList.add('d-none');
    document.getElementById('update_user_window').classList.add('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}


/**
 * to close Details Contact informations
 * 
 */
function closeDetails() {
    document.getElementById('contacts-detail').style.display = 'none';
}


/**
 * function to show Contact options on Mobile screens
 * 
 */
function showOptions() {
    document.getElementById('options').classList.add('options-slidein');
    document.getElementById('options').classList.add('show-on-mobile');
}


/**
 * Function to delete a selectet Contact from Assigned user of a Task
 * 
 * @param {String} userNameToDelete - The Name of Contact to be Delete from current Task
 */
async function cleanUserFromAvailableTask(userNameToDelete) {
    let taskTemp = AllTask.filter(task => task.Assigned.includes(userNameToDelete));
    for (i = 0; taskTemp.length > i; i++) {
        let currentTask = await AllTask.find(c => c.title == taskTemp[i].title);
        let currentTaskPos = AllTask.indexOf(currentTask);
        let userIndex = await AllTask[currentTaskPos]['Assigned'].indexOf(userNameToDelete);
        AllTask[currentTaskPos]['Assigned'][userIndex] = 'gelöscht';
    }
    await save();
}

