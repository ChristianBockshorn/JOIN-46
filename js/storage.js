const STORAGE_TOKEN = '6YNH2EX6ZG2XYC0BJS4R41M1AVCZ3HI73LYQR1BW';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    // debugger;
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return await fetch(url).then (res => res.json());
}