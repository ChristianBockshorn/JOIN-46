function checkForaPp(){
    let appbox = document.querySelector('#app');
    if (appbox.checked){
        document.getElementById('signUpButton').disabled = false;
    };
}
