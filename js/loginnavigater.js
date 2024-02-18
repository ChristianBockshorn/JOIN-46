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
    let pass = document.getElementById('pass').value;
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]['email'] == mail) {
            const element = contacts[i]['email'];
            console.log(element);
            if (contacts[i]['password'] == pass) {
                const element = contacts[i]['password'];
                console.log(element);
            }
        }
    }
}

function goGuest() {
    console.log("es wurde der Login as Guest Button angeklickt");
    window.location.href = './summary.html';
}

function goUser() {
    // console.log("es wurde der Login Button angeklickt");
    checkForAccess();
}
