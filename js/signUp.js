let nameParts = [];
let userName;
let firstName;
let lastName;

let users = [];

async function initSignUp() {
    await includeHTML();
    await loadContacts();
    await loadUserData();
}

// HILFSFUNKTION (falls Kontakte neu geladen und initialisiert werden müssen//
async function loadContactsJSON() {
    try {
      const response = await fetch('./contacts.json');
      contacts = await response.json();
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }
  
  
  //HILFSFUNKTION (für Speichern der contacts-Daten im Backend)//
  async function storeContacts() {
    try {
      const contactsString = JSON.stringify(contacts);
  
      const response = await setItem('contacts', contactsString);
  
      console.log('Antwort vom Backend:', response);
  
      if (response.status === 'success') {
        const contactsResponse = await getItem('contacts');
        const storedContacts = JSON.parse(contactsResponse.data.value);
  
        console.log('Gespeicherte Benutzerdaten im Backend:', storedContacts);
      } else {
        console.error('Fehler beim Speichern der Benutzerdaten im Backend:', response.message);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Benutzerdaten im Backend:', error);
    }
  }
  
  
  
  //HILFSFUNKTION (falls Dummy-Users neu geladen und initialisiert werden müsen)//
  async function loadUsersJSON() {
    try {
      const response = await fetch('./users.json');
      users = await response.json();
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }
  
  //HILFSFUNKTION (für Speichern der User-Daten im Backend)//
  async function storeUsers() {
    try {
      const usersString = JSON.stringify(users);
      const response = await setItem('users', usersString);
  
      console.log('Antwort vom Backend:', response);
  
      if (response.status === 'success') {
        const usersResponse = await getItem('users');
        const storedUsers = JSON.parse(usersResponse.data.value);
  
        console.log('Gespeicherte Benutzerdaten im Backend:', storedUsers);
      } else {
        console.error('Fehler beim Speichern der Benutzerdaten im Backend:', response.message);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Benutzerdaten im Backend:', error);
    }
  }
  
  


/**
 * This function creates a new user based on the values read from the input fields and calls to validate these values.
 */
async function createSignUpdata() {
    userName = document.getElementById('name').value;
    splitName(userName);
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmedPasswordInput = document.getElementById('confirmedPassword');

    newUser = {
        ID: new Date().getTime(),
        name: capitalizeFirstLetter(userName),
        firstName: filterFirstName(userName),
        lastName: filterLastName(),
        acronym: getAcronym(),
        email: emailInput.value.toLowerCase(),
        password: passwordInput.value,
        confirmedPassword: confirmedPasswordInput.value,
        iconColor: setBackgroundcolor(),
        isDummy: false,
    };
    validateSignUpData(newUser);
}


/**
 * the name is split into two parts by recognizing spaces.
 * 
 * @param {string} userName - the name of the user to be added.
 * @returns - the two strings from the input field of the name. 
 */
function splitName(userName) {
    nameParts = userName.split(' ');
    return nameParts;
}


/**
 * This function takes the first part of the name-parts variable and passes it to display the first letter of it in large letters.
 * 
 * @returns - the first filtered name
 */
function filterFirstName() {
    firstName = capitalizeFirstLetter(nameParts[0]);
    return firstName;
}


/**
 * This function checks whether there is a second name for the new user (last name) and transfers it with the first letter capitalized.
 * 
 * @returns - the second name entered if it exists. Otherwise, an empty value is returned
 */
function filterLastName() {
    lastName = ''
    if (nameParts.length > 1) {
        lastName = nameParts.slice(1).map(part => capitalizeFirstLetter(part)).join(' ');
    }
    return lastName;
}


/**
 * This function uses the first and second name (if available) to combine the first letters into an acronym.
 * 
 * @returns - an acronym consisting of one or two letters
 */
function getAcronym() {
    const formattedFirstNameInitial = firstName.charAt(0).toUpperCase();
    const formattedLastNameInitial = lastName.charAt(0).toUpperCase();
    return acronym = formattedFirstNameInitial + formattedLastNameInitial;
}


/**
 * This function checks whether all input fields (+checkbox) have been filled in. If this is the case, the button is enabled for activation.
 */
function disableSignUpButton() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmedPasswordInput = document.getElementById('confirmedPassword');
    const checkboxInput = document.getElementById('checkbox');
    const signUpButton = document.getElementById('signUpButton');

    const allFieldsFilled = nameInput.value && emailInput.value && passwordInput.value && confirmedPasswordInput.value && checkboxInput.checked;

    if (allFieldsFilled) {
        signUpButton.removeAttribute('disabled');
        signUpButton.classList.remove('if-button-disabled');
        signUpButton.classList.add('btn-db');
    } else {
        signUpButton.setAttribute('disabled', true);
        signUpButton.classList.add('if-button-disabled');
    }
}


/**
 * This function checks whether the name field has been filled in correctly and whether the passwords match.
 * 
 * @param {array} newUser - the completed data of the new user
 */
function validateSignUpData(newUser) {
    if (newUser.name.length >= 2) {
        if (newUser.password === newUser.confirmedPassword) {
            addUser(newUser);
        } else {
            displayErrorMessage("Passwords don't match", document.getElementById('confirmedPassword'));
        }
    } else {
        displayErrorMessage('Name must contain at least two letters', document.getElementById('name'));
    }
}


/** 
 * This function is used to add a new User to the user-array, if the conditions about personal name, email and password are fulfilled.
 * 
 * @param {JSON} users - This JSON contains the information (name,email,password) which are neccessary to sign up
*/
async function addUser(newUser) {
    if (checkIfUserexist(newUser)) {
        displayErrorMessage('A user with this email already exists', confirmedPassword);
    } else {
        users.push(newUser);
        await storeUserItems();
        clearInputfields(newUser);
        localStorage.setItem('signUpStatus', 'completed');
        window.location.href = 'index.html?msg=You%20Signed%20Up%20successfully';
    }
}


/**
 * This function saves the JSON object with the key 'users' to the back end via the setItem function.
 */
async function storeUserItems() {
    await setItem('users', JSON.stringify(users));
}


/**
 * This function checks whether a user with the entered e-mail address already exists.
 * 
 * @param {array} newUser - the completed data of the new user
 * @returns - true (if user already exists), false (if the user does not exist yet.)
 */
function checkIfUserexist(newUser) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email == newUser.email) {
            return true;
        }
    }
    return false;
}


/**
 * This function clear all input-fields from the form-elememt
 * 
 * @param {valueOf} name - contains the value oft the name from the depending input
 * @param {valueOf} email - contains value of the email from dp. input
 * @param {valueOf} password - contains value of the password from dp. input
 * @param {valueOf} confirmedPassword - contains value of the assigned password from dp. input
 */
function clearInputfields(newUser) {
    newUser.name = '';
    newUser.email = '';
    newUser.password = '';
    newUser.confirmedPassword = '';
}


/**
 * A function that outputs an error message if the fields with the id 'name' or 'password/confirmedpassword' have not been filled in correctly.
 * 
 * @param {string} message - it's the message which is shown, if the condition is not fulfilled.
 * @param {valueOf} element - value of the input-box (personal name or confirmed password) 
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
 * A function that changes the icon if you have typed something into the input field with the id 'password/confirmedPassword'.
 * 
 * @param {string} inputId - the id from the first or second password-field (e.g first: password, second: confirmedPassword)
 * @param {string} iconId - the id from the first or second icon in the password-field (e.g first: password, second: confirmedPassword)
 */
function togglePasswordIcon(inputId, iconId) {
    let passwordInput = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);

    if (passwordInput.value.length > 0) {
        passwordIcon.setAttribute('src', './assets/img/visibility_off.svg');
    } else {
        passwordIcon.setAttribute('src', './assets/img/lock.svg');
    }
}


/**
 * The changePasswordVisibility function is responsible for changing the visibility of the password field and the associated icon when the icon is clicked.
 * 
 * @param {ID} - inputId 
 * @param {ID} - iconId 
 */
function changePasswordVisibility(inputId, iconId) {
    let passwordInput = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.setAttribute('src', './assets/img/visibility.svg');
    } else {
        passwordInput.type = "password";
        passwordIcon.setAttribute('src', './assets/img/visibility_off.svg');
    }
}
/**
 * A function that makes it possible to display the password/confirmedPassword via onclick.
 * 
 * @param {string} inputId - the id from the first or second password-field (e.g first: password, second: confirmedPassword)
 */
function showPassword(inputId, iconId) {
    changePasswordVisibility(inputId, iconId);
}

