document.getElementById('app').addEventListener("click", enableButton);
// document.getElementById('signUpButton').addEventListener("click",goSignUp);


function enableButton(event) {
    if (event.target.checked) {
        // console.log("der code geht");
        document.getElementById('signUpButton').disabled = false;
    }
    else {
        document.getElementById('signUpButton').disabled = true;
    }
}


function check() {
    if (document.getElementById('pass').value !== document.getElementById('pass-confirm').value) {
        document.getElementById('textbox').style.color = 'red';
        document.getElementById('pass-confirm').style.border = '1px solid red';
        document.getElementById('textbox').innerHTML = 'Ups! your password don´t match';
    } else {
        document.getElementById('pass-confirm').style.border = '1px solid #d1d1d1';
        document.getElementById('textbox').innerHTML = '';
    }
}

function iconChanger(selected) {
    if (selected == 'passwd') {
        document.getElementById('new-password-img').src = '/assets/images/visibility_off.svg';
    }
    if (selected == 'confirm') {
        document.getElementById('new-password-confirm-img').src = '/assets/images/visibility_off.svg';
    }
}

function showPasswd(id) {
    let selectedField = document.getElementById(id);
    if (selectedField.type == 'password') {
        selectedField.type = "text";
    }
    else {
        console.log('it is password');
        selectedField.type = "password";
    }
}


function clearFields(){
    document.getElementById('first-name').value = "";
    document.getElementById('mail').value = "";
    document.getElementById('pass').value = "";
    document.getElementById('pass-confirm').value = "";
}


async function goSignUp() {
    // debugger;
    let name = document.getElementById('first-name').value;
    let mail = document.getElementById('mail').value;
    let pass = document.getElementById('pass').value;
    let obj = {
        name: name,
        email: mail,
        password: pass,
        imgpath: "/assets/contacticons/Emmanuel.svg"
    };
    contacts.push(obj);
    await saveData(contacts);
    clearFields();
    window.location.href = './index.html';
}