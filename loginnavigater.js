document.getElementById('user').addEventListener("click",goUser);
document.getElementById('guest').addEventListener("click",goGuest);


function checkForaPp(){
    let appbox = document.querySelector('#app');
    if (appbox.checked){
        document.getElementById('signUpButton').disabled = false;
    }
    else{
        console.log('Please confirm the Privacy policy.');
        alert('Please confirm the Privacy policy.');
    }
}


function checkForAccess(){
    let mail = document.getElementById('mail');
    let pass = document.getElementById('pass');
    console.log(mail.value);
    console.log(pass.value);
}

function goGuest(){
    console.log("es wurde der Login as Guest Button angeklickt");
    window.location.href = './summary.html';
}

function goUser(){
    console.log("es wurde der Login Button angeklickt");
    checkForAccess();
}

function goSignUp(){
    window.location.href = './index.html';
}