document.getElementById('app').addEventListener("click",enableButton);
// document.getElementById('signUpButton').addEventListener("click",goSignUp);


function enableButton(event){
    if (event.target.checked) {
        // console.log("der code geht");
        document.getElementById('signUpButton').disabled = false;
    }
    else{
        document.getElementById('signUpButton').disabled = true;
    }
}


function goSignUp(){
    let name = document.getElementById('first-name');
    let mail = document.getElementById('mail');
    let pass = document.getElementById('pass');
    let passconfirm = document.getElementById('pass-confirm');
    console.log(name.value);
    console.log(mail.value);
    console.log(pass.value);
    console.log(passconfirm.value);
    alert("Erfolgreich angemeldet");
    window.location.href = './index.html';
}