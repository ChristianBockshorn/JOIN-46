function addUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


function updateUserDialog(i) {
    document.getElementById('update_user_window').classList.remove('d-none');
    document.getElementById('name').value = contacts[i]['name'];
    document.getElementById('mail').value = contacts[i]['email'];
    document.getElementById('phone').value = contacts[i]['telephone'];
}


function deleteUser(i){

}


function closeDialog() { 
    document.getElementById('add_user_window').classList.add('d-none');
    document.getElementById('update_user_window').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}





