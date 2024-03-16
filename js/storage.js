const STORAGE_TOKEN = '6YNH2EX6ZG2XYC0BJS4R41M1AVCZ3HI73LYQR1BW';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

const randomColor = [
    "#FF0000", // Rot
    "#00FF00", // Grün
    "#0000FF", // Blau
    "#FFFF00", // Gelb
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#800000", // Dunkelrot
    "#008000", // Dunkelgrün
    "#000080", // Dunkelblau
    "#808000", // Olive
    "#800080", // Dunkelmagenta
    "#008080", // Dunkelcyan
    "#FFA500", // Orange
    "#A52A2A", // Braun
    "#800080", // Lila
    "#ADFF2F", // Grün-Gelb
    "#FF69B4", // Rosa
    "#00FA9A", // Mittelmeergrün
    "#DA70D6", // Orchidee
    "#20B2AA", // Hellgrün
    "#B0C4DE", // Hellblau
    "#4682B4", // Stahlblau
    "#FF6347", // Tomatenrot
    "#8A2BE2", // Blau-Violett
    "#6A5ACD", // Lavendel
    "#7FFF00"  // Chartreuse
];


function getRandomColor() {
    return randomColor[Math.floor(Math.random() * randomColor.length)];
}


function generateInitials(name) {
    let letterOne = name.substr(0, 1);
    let spacePosition = name.indexOf(' ') + 1;
    let letterTwo = name.substr(spacePosition, 1);
    if (spacePosition == 0) {
        letterTwo = '';
    }
    let initials = letterOne + letterTwo;
    return initials.toUpperCase();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


let currentContact;
let loggedinuser = [];

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}


async function getData() {
    contacts = [];
    let all = await getItem('Contacts');
    contacts = all['data']['value'];
    if (!contacts.length == 0) {
        if (typeof contacts === 'string') {
            contacts = JSON.parse(contacts);
            contacts.sort(function (a, b) {
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        }
        return contacts;
    }
    }


    async function saveData(contacts) {
        await setItem('Contacts', contacts);
    }


    // den eingeloggten Benutzer aus dem localStorage holen und via Return übergeben
    function getLoggedInUser() {
        let loggedin = JSON.parse(localStorage.getItem('logged'));
        if(loggedin){
            console.log(loggedin);
            let user = loggedin[0]['name'];
            return user;
        }else{
            console.error('Aktuell ist kein Benutzer angemeldet');
            return false;
        }
    }

    function logout() {
        localStorage.removeItem("logged");
    }


    async function loadAllTasks() {
        // let AllTaskAsString = localStorage.getItem('AllTask');
        let AllTaskAsString = await getItem('AllTask');
        // console.log(AllTaskAsString);
        let respons = AllTaskAsString['data']['value'];
        AllTask = JSON.parse(respons);
        // console.log('loaded task', AllTask);
    }


    function getIndexPosition(element) {
        // console.log(element);
        let searchWord = element.title;
        let indexPosition = AllTask.findIndex(task => task.title == searchWord)
        // console.log(indexPosition);
        return indexPosition;
    }