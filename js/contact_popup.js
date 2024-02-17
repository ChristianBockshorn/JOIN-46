function showUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


function showUpdateUserDialog(i) {
    document.getElementById('update_user_window').classList.remove('d-none');
    document.getElementById('name').value = contacts[i]['name'];
    document.getElementById('mail').value = contacts[i]['email'];
    document.getElementById('phone').value = contacts[i]['telephone'];
    document.getElementById('del-btn').value = i;
}


function saveData(){
    setItem('Contacts',contacts);
}


function deleteUser(i){
    let nr = document.getElementById('del-btn').value;
    if (typeof nr === "number") {
        i = nr;
    }
    contacts.splice(i,1);
    setItem('Contacts',contacts);
    // debugger;
    document.getElementById('main-content').style.display = 'none'
    closeDialog();
    renderContacts();
}


function saveUserDetails(){
    let nextId = ++contacts.length;
    console.log(nextId);
    let newname = document.getElementById('newname').value;
    let newemail = document.getElementById('newmail').value;
    let newtelephone = document.getElementById('newphone').value;
    console.log(newname,newemail,newtelephone);
    let obj = {
        name: newname,
        email: newemail,
        telephone: newtelephone,
        path: "/assets/contacticons/Emmanuel.svg"
    };
    contacts.push(obj);
    setItem('Contacts',contacts);
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





