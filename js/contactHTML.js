/**
 * This function returns the HTML-Code in case that there are no contacts available in the array "contacts"
 *
 * @returns - HTML-Code if no contacts are availabe
 */
async function generateNoContactsHTML() {
  return /*html*/ `
    <div class="contacts-no-contacts">No contacts available</div>
    `;
}


/**
 * This function generates the HTML-Code for the initial letter separator in the contact list
 *
 * @param {string} initalLetter - letter for the alphabetically order in the contact list
 * @returns - HTML-Code for the initial letter separator in the contact list
 */
async function generateInitialLetterHTML(initalLetter) {
  return /*html*/ `
    <div id="contact-list-letter-${initalLetter}">
      <div class="contact-list-initial-letter">${initalLetter}</div>
      <div class="contact-list-separator"></div>
    </div>
    `;
}

/**
 * This function returns the HTML-Code for a single contact element in the contact list
 *
 * @param {number} positionOfContact - position of the contact in the array "contactSorted" for which the HTML-Code is generated
 * @returns - HTML-Code for a single contact element in the contact list
 */
async function generateSingleListContactHTML(positionOfContact) {
  return /*html*/ `
    <div class="contact-list-single-contact" id="${contactsSorted[positionOfContact]["ID"]}" onclick="openContactDetail('${contactsSorted[positionOfContact]['ID']}')">
      <div class="contact-list-single-contact-acronym" id="contact-list-single-contact-acronym-${contactsSorted[positionOfContact]["ID"]}">${contactsSorted[positionOfContact]["acronymContact"]}</div>
      <div class="contact-list-single-contact-right">
          <div id='contact-list-single-contact-identity-text-${contactsSorted[positionOfContact]["name"]}' class="contact-list-single-contact-name">${contactsSorted[positionOfContact].name}</div>
          <span></span>
        <div class="contact-list-single-contact-mail">${contactsSorted[positionOfContact]["emailContact"]}</div>
      </div>
    </div>
    `;
}


/**
 * This function return the code for the contact element of the current user in the contact list
 * 
 * @param {object} currentUserAsContact - JSON containing information for the current user
 * @returns - HTML-Code for the contact element of the current user in the contact list
 */
async function generateSingleListContactHTMLCurrentUSER(currentUserAsContact) {
  return /*html*/ `
    <div class="contact-list-single-contact" id="${currentUserAsContact["ID"]}" onclick="openContactDetail('${currentUserAsContact['ID']}')">
      <div class="contact-list-single-contact-acronym" id="contact-list-single-contact-acronym-${currentUserAsContact["ID"]}">${currentUserAsContact["acronymContact"]}</div>
      <div class="contact-list-single-contact-right">
        <div id='contact-list-single-contact-identity-text-${currentUserAsContact["name"]}' class="contact-list-single-contact-name">${currentUserAsContact["name"]}   (YOU)</div>
        <span></span>
        <div class="contact-list-single-contact-mail">${currentUserAsContact["emailContact"]}</div>
      </div>
    </div>
  `;
}



/**
 * This function return the dynamic part of the submenu so that the currently selected task can be edited or deleted
 * 
 * @param {number} positionOfContact - position of the contact in the array "contactSorted" for which the HTML-Code is generated
 * @returns - HTML-Code for the submenu for editing or deleting a contact (only relevant for mobile view)
 */
async function generateSubmenuEditDeleteContactHTML(positionOfContact) {
  return /*html*/ `
  <div
          class="contacts-detail-edit-delete"
          id="contacts-detail-edit-mobile"
          onmouseover="changeImgTo('img-contacts-detail-edit-mobile', 'edit_lb')"
          onmouseout="changeImgTo('img-contacts-detail-edit-mobile', 'edit_default')"
          onclick="openEditContactOverlay(${positionOfContact})"
        >
          <img
            id="img-contacts-detail-edit-mobile"
            src="./assets/img/edit_default.svg"
          />
          <span>Edit</span>
        </div>
        <div
          class="contacts-detail-edit-delete"
          id="contacts-detail-delete-mobile"
          onmouseover="changeImgTo('img-contacts-detail-delete-mobile', 'delete_lb')"
          onmouseout="changeImgTo('img-contacts-detail-delete-mobile', 'delete_default')"
          onclick="deleteContact(${positionOfContact})"
        >
          <img
            id="img-contacts-detail-delete-mobile"
            src="./assets/img/delete_default.svg"
          />
          <span>Delete</span>
           </div>         
  `;
}

/**
 * This function returns the HTML-Code for the detailed view of the selected contact
 *
 * @param {number} positionOfContact - position of the contact in the array "contactSorted" for which the detailed view shall be displayed
 * @returns - HTML-Code for the detailed view of the selected contact
 */
async function generateContactDetailHTML(positionOfContact) {

  return /*html*/ `
      <div class="ctn-contacts-details-name">
      <div class="contacts-detail-acronym" id="contacts-detail-acronym-${contactsSorted[positionOfContact]["ID"]}">${contactsSorted[positionOfContact]["acronymContact"]}</div>
      <div class="ctn-contacts-details-name-right">
      <div id="contacts-detail-identity-text-${contactsSorted[positionOfContact].ID}" class="contacts-detail-name">${contactsSorted[positionOfContact]["name"]}</div>
          
              <div class="contacts-detail-edit-delete-container">
                <div
                class="contacts-detail-edit-delete"
                onmouseover="changeImgTo('img-contacts-detail-edit', 'edit_lb')"
                onmouseout="changeImgTo('img-contacts-detail-edit', 'edit_default')"
                onclick="openEditContactOverlay(${positionOfContact})"
                 >
                 <img
                 id="img-contacts-detail-edit"
                 src="./assets/img/edit_default.svg"
                 />
                 <span>Edit</span>
                </div>
                <div id="trash-bin-container"
               class="contacts-detail-edit-delete"
               onmouseover="changeImgTo('img-contacts-detail-delete', 'delete_lb')"
               onmouseout="changeImgTo('img-contacts-detail-delete', 'delete_default')"
               onclick="deleteContact(${positionOfContact})"
               >
               <img
               id="img-contacts-detail-delete"
               src="./assets/img/delete_default.svg"
               />
               <span>Delete</span>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contacts-detail-subheadline">Contact Information</div>
            <div class="ctn-contacts-detail-mail-phone">
              <div class="contacts-detail-mail-phone">
                <span>Email</span>
                <a class="contacts-detail-mail" href="mailto:${contactsSorted[positionOfContact]["emailContact"]}">${contactsSorted[positionOfContact]["emailContact"]}</a>
              </div>
              <div class="contacts-detail-mail-phone">
                <span>Phone</span>
                <div id="contacts-detail-phone">${contactsSorted[positionOfContact]["phoneContact"]}</div>
              </div>
      </div>
    `;
}



/**
 * This function return the HTML-Code for editing a contact (overlay) - the input fields are prefilled for the selected contact
 *
 * @param {number} positionOfContact - position of the contact in the array "contactSorted" that shall be edited
 * @returns - HTML-Code for editing a contact (overlay) including prefilled values for the selected contact
 */
async function generateOverlayEditContact(positionOfContact) {
  return /*html*/ `
  <div class="ctn-contacts-edit-add" onclick="stopPropagation(event)">
    <div class="ctn-headline-contacts-edit-add">
      <img class="logo-contacts-edit-add" src="./assets/img/logo_light.svg" />
      <h1 class="headline-contacts-edit-add" id="headline-contacts-edit-add">
        Edit contact
      </h1>
      <div class="separator-contacts-edit-add"></div>
    </div>
    <div class="acronym-contacts-edit-add" id="acronym-contacts-edit-add">${contactsSorted[positionOfContact]["acronymContact"]}</div>
    <div class="ctn-contacts-detail-close" onclick="closeContactsDetails()"></div>
    <form
      class="form-contacts-edit-add"
      onsubmit="editContact(${positionOfContact}); return false;"
    >
      <div class="ctn-input-contact-edit-add">
        <div>
          <input
            type="text"
            id="contacts-detail-input-name"
            minlength="3"
            placeholder="Name"
            required
          />
          <img class="input-icon" src="./assets/img/person.svg" />
        </div>
        <div>
          <input
            type="email"
            id="contacts-detail-input-mail"
            placeholder="Email"
            value="${contactsSorted[positionOfContact]["emailContact"]}"
            required
          />
          <img class="input-icon" src="./assets/img/mail.svg" />
        </div>
        <div>
        <input
  type="text"
  id="contacts-detail-input-phone"
  pattern="[0-9+ ]*"
  placeholder="Phone (optional)"
  oninvalid="this.setCustomValidity('Please enter a valid phone number')"
  oninput="this.setCustomValidity('')"
/>

          <img class="input-icon" src="./assets/img/phone.svg" />
        </div>
      </div>
      <div class="ctn-btns-contact-edit-add">
        <div id="deleteButtonEdit" class="btn-outline" onclick="deleteContact(${positionOfContact})">
          Delete
        </div>
        <button class="btn-db" type="submit">
          Save
          <img src="./assets/img/check_white.svg" />
        </button>
      </div>
    </form>
  </div>;
  `;
}

/**
 * This function returns the HTML-Code for adding a contact (overlay)
 *
 * @returns - This function returns the HTML-Code for adding a contact (overlay)
 */
async function generateOverlayAddContact() {
  return /*html*/ `
  <div class="ctn-contacts-edit-add" onclick="stopPropagation(event)">
        <div class="ctn-headline-contacts-edit-add">
          <img class="logo-contacts-edit-add" src="./assets/img/logo_light.svg" />
          <h1 class="headline-contacts-edit-add" id="headline-contacts-edit-add">
            Add contact
          </h1>
          <div class="sub-headline-contacts-add" id="sub-headline-contacts-add">
            Tasks are better with a team!
          </div>
          <div class="separator-contacts-edit-add"></div>
        </div>
        <div class="acronym-contacts-edit-add" id="acronym-contacts-edit-add"><img class="icon-acronym-contacts-add" src="./assets/img/person_white.svg"></div>
        <div class="ctn-contacts-detail-close" onclick="closeContactsDetails()"></div>
        <form
          class="form-contacts-edit-add"
          onsubmit="createContact(); return false;"
        >
          <div class="ctn-input-contact-edit-add">
            <div>
              <input
                type="text"
                id="contacts-detail-input-name"
                minlength="3"
                placeholder="Name"
                required
              />
              <img class="input-icon" src="./assets/img/person.svg" />
            </div>
            <div>
              <input
                type="email"
                id="contacts-detail-input-mail"
                placeholder="Email"
                required
              />
              <img class="input-icon" src="./assets/img/mail.svg" />
            </div>
            <div>
              <input
                type="text"
                id="contacts-detail-input-phone"
                pattern="[+0-9 ]*"
                placeholder="Phone (optional)"
                oninvalid="this.setCustomValidity('Please enter a valid phone number')"
                oninput="this.setCustomValidity('')"
              />
              <img class="input-icon" src="./assets/img/phone.svg" />
            </div>
          </div>
          <div class="ctn-btns-contact-edit-add">
            <div class="btn-outline btn-cancel-contacts" onclick="resetAddContact()"  onmouseover="changeImgTo('icon-btn-cancel-contacts', 'close_lb')"
            onmouseout="changeImgTo('icon-btn-cancel-contacts', 'close_black')">
              Cancel
              <img class="icon-btn-cancel-contacts" id="icon-btn-cancel-contacts" src="./assets/img/close_black.svg" />
            </div>
            <button class="btn-db" type="submit">
              Create Contact
              <img src="./assets/img/check_white.svg" />
            </button>
          </div>
        </form>
      </div>
  `;
}
