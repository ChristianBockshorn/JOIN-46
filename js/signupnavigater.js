/**
 * Listener to start a function if app Button is clicked
 */
document.getElementById('app').addEventListener("click", enableButton);


/**
 * 
 * @param {Object} event - Object is needed to check whether checkbox is checked
 */
function enableButton(event) {
    if (event.target.checked) {
        document.getElementById('signUpButton').disabled = false;
        document.getElementById('signUpButton').classList.add('colored-btn');
    }
    else {
        document.getElementById('signUpButton').disabled = true;
        document.getElementById('signUpButton').classList.remove('colored-btn');
    }
}


/**
 * Function to compare whether both Password inputs match and highlight if its not match
 */
function check() {
    if (document.getElementById('new-password').value !== document.getElementById('new-password-confirm').value) {
        document.getElementById('textbox').style.color = 'red';
        document.getElementById('new-password-confirm').style.border = '1px solid red';
        document.getElementById('textbox').innerHTML = 'Ups! your password don´t match';
    } else {
        document.getElementById('new-password-confirm').style.border = '1px solid #d1d1d1';
        document.getElementById('textbox').innerHTML = '';
    }
}


/**
 * This Function is used to change icons on focus
 * 
 * @param {String} selected - id to check which field are selected
 */
function iconChangerOnFocus(selected) {
    if (selected == 'passwd') {
        document.getElementById('new-password-img').src = '/assets/images/visibility_off.svg';
    }
    if (selected == 'confirm') {
        document.getElementById('new-password-confirm-img').src = '/assets/images/visibility_off.svg';
    }
}


/**
 * Function is used to view the input in password field and toggle the Eye Icon
 * 
 * @param {String} id - Id to check which field are selected
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
 * Function is used to clear input Fields
 * 
 */
function clearFields() {
    document.getElementById('first-name').value = "";
    document.getElementById('mail').value = "";
    document.getElementById('new-password').value = "";
    document.getElementById('new-password-confirm').value = "";
}


/**
 * 
 * Function is used to save new sign up user information in remote storage and view a success message
 */
async function goSignUp() {
    document.getElementById('slideMsg').classList.remove('d-none');
    document.getElementById('infoBoxPosition').classList.remove('d-none');
    document.getElementById('slideMsg').innerHTML = 'You Signed Up successfully'
    let name = document.getElementById('first-name').value;
    let mail = document.getElementById('mail').value;
    let pass = document.getElementById('new-password').value;
    let obj = {
        name: name,
        email: mail,
        password: pass,
        initials: generateInitials(name),
        usercolor: getRandomColor()
    };
    contacts.push(obj);
    await saveData(contacts);
    clearFields();
    let slideMsg = document.getElementById('slideMsg');
    slideMsg.addEventListener('animationend', function (event) {
        window.location.href = './index.html?msg=stop';
    });
}

