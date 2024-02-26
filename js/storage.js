const STORAGE_TOKEN = '6YNH2EX6ZG2XYC0BJS4R41M1AVCZ3HI73LYQR1BW';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


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
    if (typeof contacts === 'string') {
        contacts = JSON.parse(contacts);
    }
    contacts.sort(function (a, b) {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
    return contacts;
}


async function saveData(contacts) {
    await setItem('Contacts', contacts);
}


// den eingeloggten Benutzer aus dem localStorage holen und via Return übergeben
function getLoggedInUser() {
    let loggedin = JSON.parse(localStorage.getItem('logged'));
    let user = loggedin[0]['name'];
    return user;
}