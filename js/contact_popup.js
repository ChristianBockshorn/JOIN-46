function openDialog(text) {
    document.getElementById('front-window').classList.remove('d-none');
    // document.getElementById('window-content').classList.remove('main');

}

function closeDialog() { 
    document.getElementById('front-window').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}





