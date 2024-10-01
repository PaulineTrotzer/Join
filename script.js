async function init() {
  await includeHTML();
  await loadUserData();
  await getLoggedInEmail();
  await checkPersonalheader(loggedInEmail);
}

async function initPrivacyP() {
  await includeHTML();
  await loadUserData();
  await getLoggedInEmail();
  await checkPersonalheader(loggedInEmail);
  checkDisplaySidebar('privacy-link');
  await setOnresizeFunction('body-privacy', 'checkDisplaySidebar(`privacy-link`)');
}

async function initLegalN() {
  await includeHTML();
  await loadUserData();
  await getLoggedInEmail();
  await checkPersonalheader(loggedInEmail);
  checkDisplaySidebar('legal-link');
  await setOnresizeFunction('body-legal', 'checkDisplaySidebar(`legal-link`)');
}


/**
 * This function checks whether an email address was selected before selecting the page and displays the personal head area if the response is positive.
 * 
 * @param {string} loggedInEmail - used mailadress in the login-process
 * @returns - without value, without action
 */
async function checkPersonalheader(loggedInEmail) {
  if ((loggedInEmail.trim() !== "[]")) {
    showElement('header-right');
    showElement('navBar');
    await renderAcronym(loggedInEmail);
  } else {
    return
  }
}


/**
 * This function checks the window width and if a user or guest is logged in - depending on the current state the elements are displayed/ marked
 * 
 * @param {string} idOfElement - id of the element that is marked in the sidebar
 */
function checkDisplaySidebar(idOfElement) {
  if ((loggedInEmail.trim() == "[]") && window.innerWidth < 785) {
    document.getElementById('sidebar').classList.add('d-none');
    document.getElementById('ctn-content').style.paddingBottom = '32px';
  } else if (window.innerWidth < 785) {
    document.getElementById('sidebar').classList.remove('d-none');
    changeSelectedTab(idOfElement);
    document.getElementById('ctn-content').style.paddingBottom = '112px';
  } else {
    document.getElementById('sidebar').classList.remove('d-none');
    changeSelectedTab(idOfElement);
    document.getElementById('ctn-content').style.paddingBottom = '32px';
  }
}


/**
 * This function loads the user data from the back-end using the getItem function and updates the global variable 'users' with the loaded user data
 */
async function loadUserData() {
  const response = await getItem('users');
  const usersData = response['data']['value'];
  if (usersData) {
    users = JSON.parse(usersData);
  }
}

/**
 * This function loads the contacts data from the back-end using the getItem function and updates the global variable 'contacts' with the loaded contacts data
 */
async function loadContacts() {
  const response = await getItem('contacts');
  const contactsData = response['data']['value'];
  if (contactsData) {
    contacts = JSON.parse(contactsData);
  }
}


/**
 * This function adds HTML-Code to elements and can be used to integrate templates
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * This function converts the first letter of a string into a capital letter.
 * 
 * @param {string} string - takes over strings from firstName/lastName
 * @returns - First name/last name with capitalized first letter.
 */
function capitalizeFirstLetter(string) {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


/**
 * This function prevents the default behaviour of further propagation of the current event
 * 
 * @param {object} event 
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * This function changes the source of an img-element (needs to be in the same folder)
 * 
 * @param {string} idOfImg - id of the the img-element that is changed
 * @param {string} nameOfImg - name of the new image 
 */
function changeImgTo(idOfImg, nameOfImg) {
  document.getElementById(idOfImg).src = `./assets/img/${nameOfImg}.svg`;
}


/**
 * This function changes the border color of an element
 * 
 * @param {*} idOfElement - id of the element for which the border color should be changed
 * @param {color} color - color of the border that should be displayed
 */
function changeBorderColorSearchTask(idOfElement, color) {
  document.getElementById(idOfElement).style.border = `1px solid ${color}`;
}


/**
 * This function loads the previous page
 */
function returnToPreviousPage() {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = 'index.html';
  }
}


/**
 * This function hides an element by adding the class "d-none"
 * 
 * @param {string} idOfElement - id of the element that is hidden 
 */
 function hideElement(idOfElement) {
  document.getElementById(idOfElement).classList.add('d-none');
}


/**
 * This function shows an element that was hidden before by removing the class "d-none"
 * 
 * @param {string} idOfElement - 
 */
function showElement(idOfElement) {
  document.getElementById(idOfElement).classList.remove('d-none');
}


/**
 * This functions resets the value in the local storage for the given key
 * 
 * @param {string} key - key of the value(s) in the local storage that is reseted 
 */
function resetInputLocalStorage(key) {
  localStorage.setItem(key, '')  
}


/**
 * This function sets the onresize attribute for an element
 * 
 * @param {string} idOfElement - id of the element for which the onresize attribute is set 
 * @param {string} functionOnresize  - function that is assigned to the onresize attribute
 */
async function setOnresizeFunction(idOfElement, functionOnresize) {
  document.getElementById(idOfElement).setAttribute("onresize", functionOnresize);
}