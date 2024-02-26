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
    if (typeof nr === "number") {
        i = nr;
    }
    contacts.splice(i, 1);
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('contacts-detail').classList.add('contacts-detail');
    await saveData(contacts);
    await renderContacts();
    closeDialog();
}


async function editUser() {
    let editname = document.getElementById('name').value;
    let editemail = document.getElementById('mail').value;
    let edittelephone = document.getElementById('phone').value;
    let editnr = document.getElementById('submit-btn').value;
    contacts[editnr] = {
        name: editname,
        email: editemail,
        telephone: edittelephone,
        imgpath: "/assets/contacticons/Emmanuel.svg"
    };
    await saveData(contacts);
    await renderContacts();
    generateDetails(editnr);
    document.getElementById('main-content').style.display = 'flex'
    closeDialog();
}


function showSuccessMsg() {
    document.getElementById('slideMsg').classList.remove('d-none');
    document.getElementById('infoBoxPosition').classList.remove('d-none');
    document.getElementById('slideMsg').innerHTML = 'Contact succefully created';
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
        telephone: newtelephone,
        imgpath: "/assets/contacticons/Emmanuel.svg"
    };
    contacts.push(obj);
    await saveData(contacts);
    let arrayPos = getNewContactPos(newname);
    closeDialog();
    showSuccessMsg();
    await renderContacts();
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