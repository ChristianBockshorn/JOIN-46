function showUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


function showUpdateUserDialog(i) {
    document.getElementById('update_user_window').classList.remove('d-none');
    document.getElementById('name').value = contacts[i]['name'];
    document.getElementById('mail').value = contacts[i]['email'];
    document.getElementById('phone').value = contacts[i]['telephone'];
    document.getElementById('del-btn').value = i;
    document.getElementById('submit-btn').value = i;
}


async function saveData(contacts) {
    await setItem('Contacts', contacts);
}


function deleteUser(i) {
    let nr = document.getElementById('del-btn').value;
    if (typeof nr === "number") {
        i = nr;
    }
    contacts.splice(i, 1);
    saveData(contacts);
    // debugger;
    document.getElementById('main-content').style.display = 'none'
    saveData(contacts);
    closeDialog();
    renderContacts();
}


function checkAddOrEdit(option) {
    if (option == 'add') {

        return obj;
    }
    if (option == 'edit') {
        let newname = document.getElementById('name').value;
        let newemail = document.getElementById('mail').value;
        let newtelephone = document.getElementById('phone').value;
        let obj = {
            name: newname,
            email: newemail,
            telephone: newtelephone,
            imgpath: "/assets/contacticons/Emmanuel.svg"
        };
        return obj;
    }
}


async function editUser(){
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


function addNewUser() {
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
    saveData(contacts);
    renderContacts();
    closeDialog();
}


function closeDialog() {
    document.getElementById('add_user_window').classList.add('d-none');
    document.getElementById('update_user_window').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}





