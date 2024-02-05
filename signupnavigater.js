document.getElementById('signUpButton').addEventListener("click",goSignUp);


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


function goSignUp(){
    window.location.href = './index.html';
}