let contacts = [];


async function getData(){
  let all = await getItem('Contacts');
  contacts = all['data']['value'];
  contacts = contacts.sort();
  console.log(contacts);
  return contacts;
}


async function renderContacts() {
  let con_content = document.getElementById('contact-content');
  con_content.innerHTML = '';
  let all = await getItem('Contacts');
  contacts = all['data']['value'];
  console.log(contacts);
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
    }else{
      j = 0;
    }
    console.log(letter);
    let name = contacts[i]['name'];
    let mail = contacts[i]['email'];
    let path = contacts[i]['imgpath'];
    console.log(path);
    con_content.innerHTML += template_NameFrame(name, mail,path);
  }
}


function template_letterFrame(letter){
  return `
          <div class="letter-container d-flex fd-column ai-start gap-8">
              <div class="letter">${letter}</div>
              <div class="grayline"></div>
            </div>
          `;
}


function template_NameFrame(name, mail, path){
  return `
          <div class="content-container d-flex ai-center gap-35">
              <img src="${path}">
              <div class="frame d-flex fd-column gap-5">
                <div>${name}</div>
                <a href="mailto:${mail}">${mail}</a>
              </div>
            </div>
          `;
};


document.addEventListener('DOMContentLoaded', function() {
  renderContacts();
});