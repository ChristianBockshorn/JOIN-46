let contacts = [];
let currentContact;

async function getData() {
  let all = await getItem('Contacts');
  contacts = all['data']['value'];
  // contacts = contacts.sort(); /*Sortiefunktion muss überarbeitet werden geht so nicht*/
  // console.log(contacts);
  return contacts;
}


async function renderContacts() {
  await getData();
  let con_content = document.getElementById('contact-content');
  con_content.innerHTML = '';
  // let all = await getItem('Contacts');
  // contacts = all['data']['value'];
  // console.log(contacts);
  // contacts = getData();
  // debugger;
  j = 0;
  let letterold = '';
  for (let i = 0; i < contacts.length; i++) {
    let letter = contacts[i]['name'].substr(0, 1);
    if (letter != letterold || j < 1) {
      con_content.innerHTML += template_letterFrame(letter);
      letterold = letter;
      j++
    } else {
      j = 0;
    }
    // console.log(letter);
    let name = contacts[i]['name'];
    let mail = contacts[i]['email'];
    let path = contacts[i]['imgpath'];
    // console.log(path);
    con_content.innerHTML += template_NameFrame(i, name, mail, path);
  }
}


function template_letterFrame(letter) {
  return `
          <div class="letter-container d-flex fd-column ai-start gap-8">
              <div class="letter">${letter}</div>
              <div class="grayline"></div>
            </div>
          `;
}


document.addEventListener('DOMContentLoaded', function () {
  renderContacts();
});

function generateDetails(i){
  checkDisplayNone(i);
  let name = contacts[i]['name'];
  let mail = contacts[i]['email'];
  let path = contacts[i]['imgpath'];
  let phone = contacts[i]['telephone'];
  let detailFrame = document.getElementById('main-content');
  detailFrame.innerHTML = template_ContactDetails(name, path, mail, phone);
}

function checkDisplayNone(i){
  if(currentContact == i){
    document.getElementById('main-content').style.display = 'none'
    currentContact = '-1';
  }
  else{
    document.getElementById('main-content').style.display = 'flex'
    currentContact = i;
  }
}


function template_NameFrame(i, name, mail, path) {
  return `
          <div class="content-container d-flex ai-center gap-35" id="${i}" onclick="generateDetails(${i})">
              <img src="${path}">
              <div class="frame d-flex fd-column gap-5">
                <div>${name}</div>
                <a href="mailto:${mail}">${mail}</a>
              </div>
            </div>
          `;
};


function template_ContactDetails(name, path, mail, phone){
return `<div class="d-flex ai-center gap-54">
        <img src="${path}" alt="Icon mit Initialen">
          <div class="d-flex fd-column gap-8">
            <h5>${name}</h5>
            <div class="options d-flex gap-12">
              <div class="d-flex gap-8">
                <img src="/assets/images/edit_white.svg" alt="">Edit
              </div>
              <div class="d-flex gap-8">
                <img src="/assets/images/delete.svg" alt="">Delete
              </div>
            </div>
          </div>
        </div>
        <div class="height-74 d-flex ai-center">Contact Information</div>
        <div class="f-weight-700 d-flex fd-column gap-22">
          <div class="d-flex fd-column gap-15">
            Email
            <a href="mailto:${mail}">${mail}</a>
          </div>
          <div class="d-flex fd-column gap-15">
            Phone
            <a href="tel:${phone}">${phone}</a>
          </div>
        </div>
      `;
}