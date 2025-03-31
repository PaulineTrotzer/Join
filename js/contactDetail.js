/**
 * This function opens the detailed view of a contact and ensures that only the selected contact is marked in the contact list
 *
/**
 * @param {string} ID - id of the contact for which the details shall be displayed
 */
async function openContactDetail(ID) {
  contactIsSelected = true;
  positionOfContact = contactsSorted.findIndex(contact => String(contact.ID) === String(ID));
  const isCurrentUser = currentUserAsContact && String(currentUserAsContact.ID) === String(ID);

  checkWindowWidth();
  await resetPreviousSelectedContact(ID);
  markSelectedContact(ID);

  if (isCurrentUser) {
    await openContactDetailCurrentUser(positionOfContact)
  }
  else {
    document.getElementById("wrapper-contact-details").innerHTML = await generateContactDetailHTML(positionOfContact);
  }
  document.getElementById(`contacts-detail-acronym-${ID}`).style.backgroundColor = contactsSorted[positionOfContact]["colorContact"];
  slideInAnimation('wrapper-contact-details', 'translate-x', false);
  checkEmptyPhoneNumber(positionOfContact);
}


/**
* This function generates an extra 'open-contact-view' to hide the delete-button to prevent the current user from being deleted.
* 
* @param {number} positionOfContact - the position of the currently selected contact
*/
async function openContactDetailCurrentUser(positionOfContact) {

  document.getElementById("wrapper-contact-details").innerHTML = await generateContactDetailHTML(positionOfContact);
  const deleteButtonContainer = document.getElementById("trash-bin-container");
  deleteButtonContainer.style.display = "none";

  checkEmptyPhoneNumber(positionOfContact);
}


/**
 * This functions resets the format for all contacts in the contact list (required in case that a contact was selected previously)
 * The function also hides the details of the previous contact (essential for the correct display of the slide-in animation of the following contact)
 */
async function resetPreviousSelectedContact(ID) {
  for (let i = 0; i < contactsSorted.length - 1; i++) {
    let currentID = contactsSorted[i]["ID"];
    let elem = document.getElementById(`${currentID}`);
    if (elem) {
      elem.style.pointerEvents = "auto";
      elem.style.backgroundColor = "white";
      elem.style.color = "black";
    } else {
      return
    }
  }
  let wrapper = document.getElementById("wrapper-contact-details");
  if (wrapper) {
    wrapper.classList.add("d-none");
  } 
}



/**
 * This function marks the currently selected contact in the contact list
 *
 * @param {string} ID - id of the contact for which the details are displayed
 */
function markSelectedContact(ID) {
  let elem = document.getElementById(ID);
  if (!elem) {
    return;
  }
  elem.style.pointerEvents = "none";
  elem.style.backgroundColor = "#2A3647";
  elem.style.color = "white";
}



/**
 * This function manages the slide-in animation when opening or editing an element - depending on the parameters the element stays permanently or just pops up
 * 
 * @param {string} idOfElement - id of the element that is suppossed to appear 
 * @param {string} className - class that defines where the element slides in from 
 * @param {boolean} letElementDisappear - defines whether the element lasts or disappears after sliding-in
 */
function slideInAnimation(idOfElement, className, letElementDisappear) {
  document
    .getElementById(idOfElement)
    .classList.add(className);
  setTimeout(() => {
    document
      .getElementById(idOfElement)
      .classList.remove("d-none");
  }, 10);
  setTimeout(() => {
    document
      .getElementById(idOfElement)
      .classList.remove(className);
  }, 100);

  if (letElementDisappear == true) {
    setTimeout(() => {
      document
        .getElementById(idOfElement)
        .classList.add("d-none");
    }, 1500);
  }
}


/**
 * This function opens the overlay for adding a new contact
 */
async function openAddContactOverlay() {
  document.getElementById("overlay-contacts").classList.remove("d-none");
  document.getElementById("overlay-contacts").innerHTML = await generateOverlayAddContact();
}


/**
* This function generates an error message under the passed input field.
* 
* @param {string} message - the message which has to be displayed
* @param {htmlContent} element - the html element under which the message should appear
*/
function displayErrorMessage(message, element) {
  const errorMessageId = 'customErrorMessage';
  let existingErrorMessage = document.getElementById(errorMessageId);
  if (existingErrorMessage) {
    existingErrorMessage.innerHTML = message;
  } else {
    let errorMessage = document.createElement('div');
    errorMessage.innerHTML = message;
    errorMessage.id = errorMessageId;
    errorMessage.style.cssText = 'color: red; margin: -27px 0 9px 6px; font-size: small;';
    element.parentNode.appendChild(errorMessage);
  }
}

/**
 * This function allows the user to reset the inserted values when adding a contact 
 */
function resetAddContact() {
  document.getElementById("contacts-detail-input-name").value = '';
  document.getElementById("contacts-detail-input-mail").value = '';
  document.getElementById("contacts-detail-input-phone").value = '';
}


/**
 * This function opens a small submenu to enable the user to delete or edit a contact (only relevant for mobile view)
 * 
 * @param {number} positionOfContact - position of the contact currently selected in the array "contactsSorted"
 */
async function openSubmenuContact(positionOfContact) {
  document.getElementById("btn-contact-mobile").classList.add("d-none");
  document.getElementById("overlay-contacts-submenu").classList.remove("d-none");
  document.getElementById('ctn-contacts-submenu').innerHTML = await generateSubmenuEditDeleteContactHTML(positionOfContact);
  if (positionOfContact === 0) {
    openSubmenuContactCurrentUser();
  }
}


/**
 * This function hides the delete button to prevent the CU from deleting itself.
 */
function openSubmenuContactCurrentUser() {
  let deleteOptionMobile = document.getElementById('contacts-detail-delete-mobile');
  deleteOptionMobile.classList.add('d-none');
}


/**
 * This function closes the overlay containing the submenu for editing/ deleting a contact and displays the show-more-button (only relevant for mobile view)
 */
function closeSubmenuContact() {
  document.getElementById("overlay-contacts-submenu").classList.add("d-none");
  document.getElementById("btn-contact-mobile").classList.remove("d-none");
}


/**
 * This function opens the overlay for editing a existing contact - the input fields are prefilled with the selected contact
 * 
 * @param {number} positionOfContact - - position of the contact currently selected in the array "contactsSorted"
 */
async function openEditContactOverlay(positionOfContact) {
  await sortArrayContacts();
  document.getElementById("overlay-contacts").classList.remove("d-none");
  document.getElementById("overlay-contacts").innerHTML = await generateOverlayEditContact(positionOfContact);

  document.getElementById("acronym-contacts-edit-add").style.backgroundColor = contactsSorted[positionOfContact]["colorContact"];
  document.getElementById("contacts-detail-input-name").value = contactsSorted[positionOfContact]["name"];
  document.getElementById("contacts-detail-input-mail").value = contactsSorted[positionOfContact]["emailContact"];
  document.getElementById("contacts-detail-input-phone").value = contactsSorted[positionOfContact]["phoneContact"];
  if (positionOfContact === 0) {
    openEditContactOverlayCurrentUser();
  }
}


/**
 * This function hides the delete button to prevent the CU from deleting itself in connection to the EditOverlay
 */
function openEditContactOverlayCurrentUser() {
  let deleteButtonEditOverlay = document.getElementById('deleteButtonEdit');
  deleteButtonEditOverlay.classList.add('d-none');
}


/**
 * This function allows the user to edit a contact, after saving a pop-up with a confirmation is displayed and the edited contact is opened
 * 
 * @param {number} positionOfContact - position of the contact currently selected in the array "contactsSorted"
 */
async function editContact(positionOfContact) {
  const editedName = document.getElementById('contacts-detail-input-name').value;
  const editedEmail = document.getElementById('contacts-detail-input-mail').value;
  const editedPhone = document.getElementById('contacts-detail-input-phone').value;

  contactsSorted[positionOfContact].name = editedName;
  contactsSorted[positionOfContact].emailContact = editedEmail;
  contactsSorted[positionOfContact].phoneContact = editedPhone;
  await setItem('contacts', JSON.stringify(contactsSorted));

  document.getElementById("overlay-contacts").classList.add("d-none");
  slideInAnimation('pop-up-contacts-edit', 'translate-y', true);
  await openContactDetail(contactsSorted[positionOfContact]["ID"]);
}


/**
 * This function deletes the currently selected/ displayed contact, then updates the array contacts and reloads the contact list.
 *
 * @param {number} positionOfContact - position of the contact currently selected in the array "contactsSorted"
 */
async function deleteContact(positionOfContact) {
  if (!isConfirmationDisplayed) {
    const confirmation = await askingforCommitment();
    if (!confirmation) {
      return;
    }
    await removeContactFromTasks(positionOfContact);
    contactsSorted = await spliceContacts(positionOfContact);
    console.log("contactsSorted nach Löschen:", contactsSorted.map(c => c.name));
    await setItem('contacts', JSON.stringify(contactsSorted));
    // Flag zurücksetzen:
    contactsRendered = false;
    checkWindowWidth();
    await clearContactWrapper();
    await returnToContactList();
  
    closeSubmenuContact();
    closeContactsDetails();
    slideInAnimation('pop-up-contacts-delete', 'translate-y', true);
    isConfirmationDisplayed = false;
  }
}



async function askingforCommitment() {
  const confirmationModal = document.getElementById('confirmationModal');
  confirmationModal.classList.remove('d-none');

  const confirmButton = document.getElementById('confirmDelete');
  const cancelButton = document.getElementById('cancelDelete');

  const confirmationPromise = new Promise((resolve) => {
    confirmButton.addEventListener('click', () => resolve(true));
    cancelButton.addEventListener('click', () => resolve(false));
  });

  const confirmation = await confirmationPromise;
  confirmationModal.classList.add('d-none');
  return confirmation;
}


/**
* This function copies the contactsSorted array and removes the currently selected contact from it.
* 
* @param {number} positionOfContact - position of the currently selected contact
* @returns - a copy of the contactsSorted array with the desired change 
*/
async function spliceContacts(positionOfContact) {
  contactsSorted.splice(positionOfContact, 1);
  return [...contactsSorted];
}


/**
* This function closes the overlay for adding or editing a contact
*/
function closeContactsDetails() {
  document.getElementById("overlay-contacts").classList.add("d-none");
}


/**
* This function ensures that a contact is removed from any assigned tasks before this contact is deleted
* 
* @param {number} positionOfContact - position of the contact currently selected in the array "contactsSorted"
*/
async function removeContactFromTasks(positionOfContact) {
  let idOfDeletedContact = contactsSorted[positionOfContact]['ID'];

  for (let i = 0; i < tasks.length; i++) {
    let counterContacts = tasks[i]['assignedContacts'].length;
    for (let j = 0; j < counterContacts; j++) {
      if (tasks[i]['assignedContacts'][j]['idContact'] == idOfDeletedContact) {
        tasks[i]['assignedContacts'].splice(j, 1);
        break;
      }
    }
  }
  saveTasks();
}


/**
 * This function checks if a phone number is available - in case that there is no phone number "n.a." is displayed instead of the phone number/ an empty field
 * @param {number} positionOfContact - position of the contact currently selected in the array "contactsSorted"
*/
function checkEmptyPhoneNumber(positionOfContact) {
  if (contactsSorted[positionOfContact]['phoneContact'] == "") {
    document.getElementById('contacts-detail-phone').innerHTML = "n.a.";
    document.getElementById('contacts-detail-phone').style.color = "#a8a8a8";
  }
}

