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

let currentContact;
let loggedinuser = [];



/**
 * This function is used to choice a random color out of the randomColor const
 * 
 * @returns {string} - output is a random color
 */
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

/**
 * This function is used to include other html files as template
 * 
 */
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


/**
 * This function is used to show the logout option
 * 
 */
function myFunction() {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


/**
 * This function is used to save information in a remote storage
 * 
 * @param {string} key - it is the keyword for saving the array
 * @param {string} value - is is the array it is to save
 * @returns {Array} - returns the data from remotestorage 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * This function is used to load information from remote storage
 * 
 * @param {string} key - This is the keyword from which we want to retrieve the information
 * @returns {Array} - return the data from remote storage
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}


/**
 * This function is used to sort array Contacts like ASC
 * 
 * @returns {Array} - sortet Contacts
 */
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


/**
 * This function is used to save the contacts on remote Storage
 * 
 * @param {Array} contacts ->all Contacts
 */
async function saveData(contacts) {
    await setItem('Contacts', contacts);
}


/**
 * This function is used to save all Tasks on remote Storage
 * 
 */
async function save() {
    let AllTaskAsString = JSON.stringify(AllTask);
    await setItem('AllTask', AllTaskAsString);
}


/**
 * This function is used to check which user is logged in
 * 
 * @returns {(string|Boolean)} - Name of logged in User | false if no user is logged in
 */
// den eingeloggten Benutzer aus dem localStorage holen und via Return übergeben
function getLoggedInUser() {
    let loggedin = JSON.parse(localStorage.getItem('logged'));
    if (loggedin) {
        let user = loggedin[0]['name'];
        return user;
    } else {
        console.error('Aktuell ist kein Benutzer angemeldet');
        return false;
    }
}


/**
 * This function is used to loggout a user.
 * 
 */
function logout() {
    localStorage.removeItem("logged");
}


/**
 * This function is used to load all Tasks from remote storage
 * 
 */
async function loadAllTasks() {
    let AllTaskAsString = await getItem('AllTask');
    let respons = AllTaskAsString['data']['value'];
    AllTask = JSON.parse(respons);
}


/**
 * This function is used to find the position in allTask Array 
 * 
 * @param {string} element - is the current Task
 * @returns {Number} - the Position of the current task in all Task Array
 */
function getIndexPosition(element) {
    let searchWord = element.title;
    let indexPosition = AllTask.findIndex(task => task.title == searchWord)
    return indexPosition;
}


/**
 * This function is used to show a success message
 * 
 * @param {string} message - is the message that should be displayed
 */
function showSuccessMsg(message) {
    document.getElementById('slideMsg').classList.remove('d-none');
    document.getElementById('infoBoxPosition').classList.remove('d-none');
    document.getElementById('slideMsg').innerHTML = message;
}