document.getElementById('user').addEventListener("click", goUser);
document.getElementById('guest').addEventListener("click", goGuest);


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


function checkForAccess() {
    let mail = document.getElementById('mail').value;
    let pass = document.getElementById('password').value;
    let userm = contacts.find(c => c.email == mail);
    let userp = contacts.find(c => c.password == pass);
    if (userm && userp) {
        setLogedInHook(mail);
        window.location.href = './summary.html';
    }
    else if (userm && !userp) {
        wrongPassword();
    }
    else {
        noUser();
    }

}

function goGuest() {
    // console.log("es wurde der Login as Guest Button angeklickt");
    window.location.href = './summary.html';
}

function goUser() {
    checkForAccess();
}


function wrongPassword() {
    document.getElementById('textbox').style.color = 'red';
    document.getElementById('mail').style.border = '1px solid #d1d1d1';
    document.getElementById('password').style.border = '1px solid red';
    document.getElementById('textbox').innerHTML = 'Wrong password Ups! Try again.';
}


function noUser() {
    document.getElementById('password').style.border = '1px solid red';
    document.getElementById('mail').style.border = '1px solid red';
    document.getElementById('textbox').innerHTML = 'Not a User.';
}


function iconChangerOnFocus(selected) {
    document.getElementById(`${selected}-img`).src = '/assets/images/visibility_off.svg';
}


// function iconChangerOnFocus(selected) {
//     if (selected == 'passwd') {
//         document.getElementById('new-pass-img').src = '/assets/images/visibility_off.svg';
//     }
//     if (selected == 'confirm') {
//         document.getElementById('new-pass-confirm-img').src = '/assets/images/visibility_off.svg';
//     }
//     if (selected == 'loginpasswd') {
//         document.getElementById('password-img').src = '/assets/images/visibility_off.svg';
//     }
// }


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


function setLogedInHook(mail) {
    user = {
        "mail": mail,
        "time": Date.now()
    };
    logedinuser.push(user);
    let userToString = JSON.stringify(logedinuser);
    localStorage.setItem('loged', userToString);
}


    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg){
        backToIndexSite();
        msg.innerHTML = msg;
        console.log('inhalt');
        console.log(msg);
    }


    function backToIndexSite(){
        document.getElementById('moveToLeft').classList.remove('moveToLeft');
        document.getElementById('moveToLeft').classList.add('leftLogo');
        document.getElementById('fadein').classList.remove('hide');
    }
    