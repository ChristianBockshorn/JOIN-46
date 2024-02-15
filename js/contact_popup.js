function addUserDialog() {
    document.getElementById('add_user_window').classList.remove('d-none');
}


function updateUserDialog() {
    document.getElementById('update_user_window').classList.remove('d-none');
}


function closeDialog() { 
    document.getElementById('add_user_window').classList.add('d-none');
    document.getElementById('update_user_window').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}





