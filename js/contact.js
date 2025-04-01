let positionOfContact;
let contacts = [];
let contactsSorted = [];
let initialLetters = [];
let contactIsSelected = false;
let currentUserAsContact = [];
let guest = false;
nameParts = [];
let confirmation;
let isConfirmationDisplayed = false;




async function initContact() {
  await includeHTML();
  changeSelectedTab("tab-contacts");
  await loadUserData();
  await loadContacts();
  await loadTasks();
  await getLoggedInEmail();
  await proofAuthentification(loggedInEmail);
  await checkPersonalheader(loggedInEmail);
  await checkIfGuestOrCurrentUser();
  await sortArrayContacts();
  await renderContactList();
  checkWindowWidth();
  await setOnresizeFunction('body-contacts', 'checkWindowWidth()');
}

/**
 * This function checks whether a guest is logging in or whether it is a personal account.
 * 
 * @returns returns true if the current user is the guest user. returns false if the user is using personalized access.
 */

async function checkIfGuestOrCurrentUser() {
  currentUserAsContact = contacts.find(c => c.emailContact === loggedInEmail);

  if (!currentUserAsContact && currentUser.email === 'guest@account') {
    guest = true;
    loggedInEmail = 'guest@account';
    return true;
  }
  return currentUserAsContact;
}


/**
 * This function ensures that all elements are displayed correctly regardless of the width of the window and whether a contact is selected or not
 */
function checkWindowWidth() {
  if (contactIsSelected && window.innerWidth < 975) {
    document.getElementById("bg-contact-list").classList.add("d-none");
    document.getElementById("contact-arrow-return").classList.remove("d-none");
    document.getElementById("ctn-content-contacts").classList.remove("d-none");
    document.getElementById("ctn-content-contacts").style =
      "left: var(--margin-left-content) !important";
    document.getElementById("ctn-content-contacts").style =
      "left: var(--margin-left-content) !important";
  } else if (contactIsSelected) {
    document.getElementById("bg-contact-list").classList.remove("d-none");
    document.getElementById("contact-arrow-return").classList.add("d-none");
    document.getElementById("ctn-content-contacts").classList.remove("d-none");
    document.getElementById("ctn-content-contacts").style =
      "left: calc(var(--margin-left-content) + var(--width-contacts-overview)) !important";
    document.getElementById("ctn-content-contacts").style =
      "left: calc(var(--margin-left-content) + var(--width-contacts-overview)) !important";
    closeSubmenuContact();
  } else if (!contactIsSelected && window.innerWidth < 975) {
    document.getElementById("bg-contact-list").classList.remove("d-none");
    document.getElementById("ctn-content-contacts").classList.add("d-none");
  }
}


/**
 * This function navigates back to the contact list and resets the currently selected user
 */
async function returnToContactList() {
  contactIsSelected = false;
  await clearContactList();
  await loadContacts();
  await renderContactList();
  checkWindowWidth();
}


/**
 * This function finds the currentUser and updates the interface with the user's personalized acronym-based icon.
 * 
 * @param {string} loggedInEmail - currently used email-adress
 * @returns - an array with all access information about the current user.
 */
async function renderAcronym(loggedInEmail) {
  currentUser = users.find(u => u.email == loggedInEmail);
  generateUserIcon(currentUser.acronym);
  return currentUser;
}


/**
 * This function checks whether there are contacts that can be rendered.
 * 
 * @returns - true (if no contacts exist) or false (if contacts exist)
 */
async function proofIfContactsexist() {
  if (contacts.length === 0) {
    document.getElementById("ctn-contact-list").innerHTML = await generateNoContactsHTML();
    return true;
  }
  return false;
}


/**
 * This function renders the contact list on the user interface, whereby certain conditions apply to the display of contacts and initial letters.
 */
async function renderContactList() {
  if (!guest && currentUserAsContact) {
    await renderCurrentUserAsContact();
  }
  const proofExecuted = await proofIfContactsexist();
  if (!proofExecuted) {
    for (let j = 0; j < initialLetters.length; j++) {
      const initialLetter = initialLetters[j].toUpperCase();
      if (guest && currentUserAsContact && contactFirstNameInitial.toUpperCase() === currentUserAsContact["firstName"][0].toUpperCase() && k !== 0) {
        continue;
      }
      await generateAndInsertInitialLetterHTML(initialLetter);
      const contactListLetter = document.getElementById(`contact-list-letter-${initialLetter}`);
      if (!contactListLetter.hasAttribute("data-iteration-done")) {
        await processContactsForInitialLetter(contactsSorted, initialLetter);
        contactListLetter.setAttribute("data-iteration-done", true);
        await checkIfContactLetterstillThere(contactsSorted, initialLetter, contactListLetter);
      }
      await updateContactElementStylesForInitialLetter(contactsSorted, initialLetter);
    }
  }
}

/**
 * This function renders an initial letter of a contact.
 * 
 * @param {string} initialLetter - first letter of a contact
 */
async function generateAndInsertInitialLetterHTML(initialLetter) {
  const initialLetterHTML = await generateInitialLetterHTML(initialLetter);
  document.getElementById("ctn-contact-list").innerHTML += initialLetterHTML;
}


/**
 * This function checks whether the initial letter already exists; if there are one or more contacts that share the respective initial letter, it is only displayed once.
 * 
 * @param {array} contactsSorted - array with all contacts, sorted by their first letter
 * @param {string} initialLetter - first letter of a contact 
 * @param {string} contactListLetter - initial letter which is assigned to the respective contact
 */
async function checkIfContactLetterstillThere(contactsSorted, initialLetter, contactListLetter) {
  const contactsWithInitial = contactsSorted.filter(contact => contact["firstName"][0].toUpperCase() === initialLetter);
  if (contactsWithInitial.length === 0) {
    contactListLetter.parentNode.removeChild(contactListLetter);
  }
}


/**
 * This function generates HTML content for contacts and adds it to the corresponding element in the contact list (depending on inital letter). The current user is excluded.
 * 
 * @param {array} contacts - array with all contacts  
 * @param {string} initialLetter - first letter of a contact  
 */
async function processContactsForInitialLetter(contacts, initialLetter) {
  let htmlContent = '';

  for (let k = 0; k < contacts.length; k++) {
    const contactFirstNameInitial = contacts[k]["firstName"][0];
    if (guest && currentUserAsContact && contactFirstNameInitial.toUpperCase() === currentUserAsContact["firstName"][0].toUpperCase() && k !== 0) {
      continue;
    }

    if (contactFirstNameInitial == initialLetter) {
      htmlContent += await generateSingleListContactHTML(k);
    }
  }
  document.getElementById(`contact-list-letter-${initialLetter}`).innerHTML += htmlContent;
}


/**
 * This function runs through the contacts-array and changes the background colors of the HTML elements that represent the initial letter of the individual contact.(except the guest-user)
 * 
 * @param {array} contacts - an array with all contacts
 * @param {string} initialLetter - first letter of a contact 
 */
async function updateContactElementStylesForInitialLetter(contacts, initialLetter) {
  for (let k = 0; k < contacts.length; k++) {
    const contactFirstNameInitial = contacts[k]["firstName"][0];
    if (guest && currentUserAsContact && contactFirstNameInitial.toUpperCase() === currentUserAsContact["firstName"][0].toUpperCase()) {
      continue;
    }
    if (contactFirstNameInitial == initialLetter) {
      const contactElement = document.getElementById(`contact-list-single-contact-acronym-${contacts[k]["ID"]}`);

      if (contactElement) {
        contactElement.style.backgroundColor = contacts[k]["colorContact"];
      }
    }
  }
}


/**
 * this function represents a single contact in the contact book
 * 
 * @param {number} positionOfContact - number of the current contact (in the contacts array)
 * @returns - an empty value (if the current contact is the guest user)
 */
async function generateSingleListContactHTML(positionOfContact) {
  const contactFirstNameInitial = contactsSorted[positionOfContact]["firstName"][0];
  if (guest && currentUserAsContact && contactFirstNameInitial.toUpperCase() === currentUserAsContact["firstName"][0].toUpperCase()) {
    return '';
  }
}


/**
 * this function clears the HTML content of the contact book
 */
async function clearContactList() {
  document.getElementById("ctn-contact-list").innerHTML = "";
}


/**
 * This function renders the current user as a contact. The current user is then displayed as the top contact.
 */
async function renderCurrentUserAsContact() {
  const currentUserHTML = await generateSingleListContactHTMLCurrentUSER(currentUserAsContact);
  document.getElementById("ctn-contact-list").innerHTML += currentUserHTML;
  document.getElementById(`contact-list-single-contact-acronym-${currentUserAsContact["ID"]}`).style.backgroundColor = currentUserAsContact["colorContact"];
}


/**
 * This function sorts the loaded array "contacts" alphabetically
 *
 */
async function sortArrayContacts() {
  if (!currentUserAsContact || !currentUserAsContact.ID) {
    contactsSorted = [...contacts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else {
    contactsSorted = [...contacts].sort((a, b) => {
      if (a && a.ID === currentUserAsContact.ID) {
        return -1;
      }
      if (b && b.ID === currentUserAsContact.ID) {
        return 1;
      }
      const nameA = a && a.name ? a.name : '';
      const nameB = b && b.name ? b.name : '';
      return nameA.localeCompare(nameB);
    });
  }
  await createArrayInitialLetters();
}




/**
 * This function creates an alphabetically sorted array with all the initial letters currently available in the loaded array "contacts"
 */
async function createArrayInitialLetters() {
  initialLetters = [];

  for (i = 0; i < contacts.length; i++) {
    const firstNameInitial = contacts[i]["firstName"][0];

    if (!initialLetters.includes(firstNameInitial)) {
      initialLetters.push(firstNameInitial.toUpperCase());
    }
  }
  initialLetters.sort();
}


/**
 * This function generates values after filling in the input fields and uses them to create a new contact.
 */
async function createContact() {
  let nameInput = document.getElementById('contacts-detail-input-name').value;
  splitName(nameInput);
  let emailInput = document.getElementById('contacts-detail-input-mail').value;
  let phoneNumberInput = document.getElementById('contacts-detail-input-phone').value;

  let newContact = {
    "ID": new Date().getTime(),
    "firstName": filterFirstName(),
    "lastName": filterLastName(),
    "name": filterFirstName() + ' ' + filterLastName(),
    "acronymContact": getAcronym(),
    "colorContact": setBackgroundcolor(),
    "emailContact": emailInput,
    "phoneContact": phoneNumberInput
  };
  await addNewContact(newContact);
}


/**
 * This function adds the new contact to the existing contact list and opens it directly in the detail view.
 * 
 * @param {array} newContact - the new contact to be added to the existing contacts.
 */
async function addNewContact(newContact) {
  const contactExists = await checkIfContactexist(newContact);
  if (!contactExists) {
    contacts.push(newContact);
    contactsSorted.push(newContact);
    contactsSorted.sort((a, b) => a.name.localeCompare(b.name));
    await setItem('contacts', contacts);
    await clearContactList();
    await renderContactList(newContact);
    resetAddContact();
    document.getElementById("overlay-contacts").classList.add("d-none");
    slideInAnimation('pop-up-contacts-add', 'translate-y', true);
    await openContactDetail(newContact["ID"]);
  }
}

/**
 * This function checks whether there is already a contact with the stored e-mail address.
 * 
 * @param {array} newContact - array with the filled in information (to save a new contact)
 * @returns - true (if the contact already exists), false - if the contact does not yet exists.
 */
async function checkIfContactexist(newContact) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].emailContact == newContact.emailContact) {
      let emailInput = document.getElementById('contacts-detail-input-mail');
      displayErrorMessage('Contact already exists', emailInput);
      return true;
    }
  }
  return false;
}


/**
 * This function empties the content of the contact list.
 */
async function clearContactWrapper() {
  document.getElementById("wrapper-contact-details").innerHTML = '';
}
