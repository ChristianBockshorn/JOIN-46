/**
 * This Listener ist used to wait for complete DOM load adn execute the render Function
 * 
 */
document.addEventListener('DOMContentLoaded', function () {
  renderContacts();
});


/**
 * This function is used to render Complete Contacts in a list and sort bei Alphabet
 * 
 */
async function renderContacts() {
  await getData();
  closeMsgDialog();
  let con_content = document.getElementById('contact-content');
  con_content.innerHTML = '';
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
    let name = contacts[i]['name'];
    let mail = contacts[i]['email'];
    let initials = contacts[i]['initials'];
    let color = contacts[i]['usercolor'];
    con_content.innerHTML += template_NameFrame(i, name, mail, initials, color);
  }
}


/**
 * This function is used to close the success message
 */
function closeMsgDialog() {
  document.getElementById('slideMsg').classList.add('d-none');
  document.getElementById('infoBoxPosition').classList.add('d-none');
}


/**
 * Function is used to generate a Line with one Letter as HTML Code
 * 
 * @param {String} letter - The current Letter for alphabetical List
 * @returns {String} - Returns 1 Line with as HTML Code
 */
function template_letterFrame(letter) {
  return `
    <div class="letter-container">
      <div class="letter">${letter}</div>
    </div>
    <div class="grayline"></div>
  `;
}


/**
 * This Function is used to collect Informations of the current User
 * 
 * @param {Number} i - Index Position of the current Contact
 */
function generateDetails(i) {
  document.getElementById('contacts-detail').style.display = 'block';
  changeColorSelectedContact(i);
  let name = contacts[i]['name'];
  let mail = contacts[i]['email'];
  let initials = contacts[i]['initials'];
  let color = contacts[i]['usercolor'];
  let phone = contacts[i]['telephone'];
  let detailFrame = document.getElementById('main-content');
  detailFrame.innerHTML = template_ContactDetails(i, name, mail, phone, initials, color);
}


/**
 * This Function ist used to change the style if a contect is selected or not on a  special screen width
 * 
 * @param {Number} i - Index Position of the current Contact
 */
function changeColorSelectedContact(i) {
  const screenWidth = window.innerWidth;
  if (currentContact == i) {
    if (screenWidth < 500) {
      document.getElementById('main-content').style.display = 'flex';
    }
    else {
      document.getElementById('main-content').style.display = 'none';
      document.getElementById(i).classList.remove('contacts-list-highlight');
      currentContact = -1;
    }
  }
  else if (currentContact != i && currentContact != undefined && currentContact != -1) {
    document.getElementById('main-content').style.display = 'flex'
    document.getElementById(currentContact).classList.remove('contacts-list-highlight');
    document.getElementById(i).classList.add('contacts-list-highlight');
    currentContact = i;
  }
  else {
    document.getElementById('main-content').style.display = 'flex'
    document.getElementById(i).classList.add('contacts-list-highlight');
    currentContact = i;
  }
}


/**
 * This function is used to generate dynamic HTML code to show Initials and Name of a Contact
 * 
 * @param {Number} i - current contact index Position
 * @param {Sting} name - current contact Name
 * @param {Sting} mail  - current contact Mail Adress
 * @param {Sting} initials  - current contact initial
 * @param {Sting} color  - current contact color
 * @returns {String} - One Line with Initials and Name as dynamic HTML Code
 */
function template_NameFrame(i, name, mail, initials, color) {
  return `
          <div class="content-container d-flex ai-center gap-35" id="${i}" onclick="generateDetails(${i})">
            <div style="background-color: ${color}" class="initialscirclecontact d-flex center">${initials}</div>
              <div class="frame d-flex fd-column gap-5">
                <div>${name}</div>
                <a href="mailto:${mail}">${mail}</a>
              </div>
            </div>
          `;
};


/**
 * This function is used to generate dynamic HTML code to show Details of selectet contact
 * 
 * @param {Number} i - current contact index Position
 * @param {Sting} name - current contact Name
 * @param {Sting} mail  - current contact Mail Adress
 * @param {String} phone - current contact phone Number
 * @param {Sting} initials  - current contact initial
 * @param {Sting} color  - current contact color
 * @returns - Details Contact Informations as dynamic HTML Code
 */
function template_ContactDetails(i, name, mail, phone, initials, color) {
  return `<div class="d-flex ai-center gap-54 mobile-gap-20">
        <div style="background-color: ${color}" class="initialscircle d-flex center">${initials}</div>
          <div class="d-flex fd-column gap-8">
            <h5>${name}</h5>
            <div id="options" class="options d-flex gap-12 f-size-16">
              <div onclick="showUpdateUserDialog(${i})" class="d-flex gap-8 ai-center highlight">
                <svg width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"/>
                </svg>Edit
              </div>
              <div onclick="deleteUser(${i})" class="d-flex gap-8 ai-center highlight">
                <svg width="16" height="18" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"/>
                </svg>Delete
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
    </div>
      `;
}