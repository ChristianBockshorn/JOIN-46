/**
 * This eventlistener watch guest and login button on loginsite
 * 
 */

document.getElementById('user').addEventListener("click", goUser);
document.getElementById('guest').addEventListener("click", goGuest);


/**
 * This function is used to check if the Privacy Police is accepted or not
 * if its true the signup button is enabled
 * 
 */
function checkForaPp() {
    let appbox = document.querySelector('#app');
    if (appbox.checked) {
        document.getElementById('signUpButton').disabled = false;
    }
    else {
        console.log('Please confirm the Privacy policy.');
        alert('Please confirm the Privacy policy.');
    }
}


/**
 * This function checkk the login Information
 * if the user exist forwarding to summary site
 * 
 */
function checkForAccess() {
    let userp = '';
    let userm = '';
    let mail = document.getElementById('mail').value;
    let pass = document.getElementById('password').value;

    if (userm = contacts.find(c => c.email == mail)) {
        if (userp = contacts.find(c => c.password == pass)) { };
    };
    if (userm && userp) {
        let arrayPos = contacts.indexOf(userm);
        let usern = contacts[arrayPos]['name'];
        setLoggedInHook(mail, usern);
        window.location.href = './summary.html';
    }
    else if (userm && !userp) {
        wrongPassword();
    }
    else {
        noUser();
    }
}


/**
 * This function forwarding the user to the sumary site
 * 
 */
function goGuest() {
    window.location.href = './summary.html';
}


/**
 * execute the checkForAccess function
 * 
 */
function goUser() {
    checkForAccess();
}


/**
 * This function change style if the password is wrong
 * and show a user information
 * 
 */
function wrongPassword() {
    document.getElementById('textbox').style.color = 'red';
    document.getElementById('mail').style.border = '1px solid #d1d1d1';
    document.getElementById('password').style.border = '1px solid red';
    document.getElementById('textbox').innerHTML = 'Wrong password Ups! Try again.';
}


/**
 * This function change style if the user is not known and show a user information
 * 
 */
function noUser() {
    document.getElementById('password').style.border = '1px solid red';
    document.getElementById('mail').style.border = '1px solid red';
    document.getElementById('textbox').innerHTML = 'Not a User.';
}


/**
 * This function change the icon to a eye symbol on focus
 * 
 * @param {string} selected - that is the idname of the selected field
 */
function iconChangerOnFocus(selected) {
    document.getElementById(`${selected}-img`).src = '/assets/images/visibility_off.svg';
}


/**
 * This function toogle the symbol and change between text and password field to show or hide the input
 * 
 * @param {string} id - - that is the idname of the selected field
 */
function showPasswd(id) {
    let selectedField = document.getElementById(id);
    if (selectedField.type == 'password') {
        selectedField.type = "text";
        document.getElementById(`${id}-img`).src = '/assets/images/visibility.svg';
    }
    else {
        selectedField.type = "password";
        document.getElementById(`${id}-img`).src = '/assets/images/visibility_off.svg';
    }
}


/**
 * This function is used to set the current logged in user to the local storage
 * 
 * @param {string} mail - mail as user input
 * @param {string} name - the passwort as user input
 */
function setLoggedInHook(mail, name) {
    user = {
        "name": name,
        "mail": mail,
        "time": Date.now()
    };
    loggedinuser.push(user);
    let userToString = JSON.stringify(loggedinuser);
    localStorage.setItem('logged', userToString);
}


/**
 * This function generate a message on success from the browser Link
 * 
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
if (msg) {
    backToIndexSite();
    msg.innerHTML = msg;
}


/**
 * This function change style
 * 
 */
function backToIndexSite() {
    document.getElementById('moveToLeft').classList.remove('moveToLeft');
    document.getElementById('moveToLeft').classList.add('start-logo');
    document.getElementById('fadein').classList.remove('hide');
}
