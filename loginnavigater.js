
document.getElementById('user').addEventListener("click",goUser);
document.getElementById('guest').addEventListener("click",goGuest);


function checkForAccess(){
    let mail = document.getElementById('mail');
    let pass = document.getElementById('pass');
    // debugger;
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