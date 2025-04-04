async function LoginInit() {
    await includeHTML();
    await loadUserData();
    await loadContacts();
}


/**
 * This function checks whether a forwarding from the SignUp page (including registration) has taken place. If this is the case, createSucessMsg is called (+animation). If only the index page is loaded, an animation is displayed.
 */
async function checkIfforwardingSignUp() {
    const signUpStatus = localStorage.getItem('signUpStatus');
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    if (signUpStatus === 'completed' && msg) {
        await createSuccesmsg(msg);
        await chooseDisplayAnimation();
    } else {
        await chooseDisplayAnimation();
    }
}


/**
 * this function reads the current screen width and adds the animations at a max-width of 670px.
 * 
 * @returns - no value (continues with the following logic)
 */
async function chooseDisplayAnimation() {
    await animationLogo();
    await animationDisplay();
}


/**
 * this function adds an animation class to the dark join logo.
 */
async function animationLogo() {
    let joinLogodark = document.getElementById('logo-login');
    joinLogodark.classList.add('animate-logo');
}


/**
 * this function adds an animation class to the animation overlay.
 */
async function animationDisplay() {
    let displayHelper = document.getElementById('start-animations-helper');
    displayHelper.classList.add('animate-helper');
    setTimeout(() => {
        document.getElementById('start-animations-helper').classList.add('d-none');
    }, 1000);
}


/**
 * This function is part of the forwarding from signUp to login.
 * If the forwarding was successful, a message appears which is generated by a query parameter.
 * 
 */
async function createSuccesmsg(msg) {
    const msgBox = document.getElementById('msgBox');

    const transpOverlay = document.getElementById('transp-overlay');
    transpOverlay.classList.remove('d-none');
    const msgSpan = document.createElement('span');
    msgSpan.innerHTML = msg;
    msgSpan.classList.add('successfullyMessage');
    msgBox.appendChild(msgSpan);
    localStorage.removeItem('signUpStatus');
    slideInAnimation('msgBox', 'translate-xanother', true)
    setTimeout(() => {
        document.getElementById('transp-overlay').classList.add('d-none');
    }, 1000);
}


/**
 * This function checks whether there is stored data in the Local Storage and fills it into the input fields if it exists.
 */
function checkIfRememberedData() {
    if (localStorage.getItem('email')) {
        let rememberedEmail = localStorage.getItem('email');
        let rememberedPassword = localStorage.getItem('password');

        let emailInput = document.getElementById('email');
        let passwordInput = document.getElementById('password');

        emailInput.value = rememberedEmail;
        passwordInput.value = rememberedPassword;

        disableLogInButton();
    }
}


/**
 * This function checks whether the input matches an existing user and then logs this user in with the saved e-mail address.
 */
async function login() {
    let emailInput = document.getElementById('email');
    let convertedEmail = emailInput.value.toLowerCase();
    let passwordInput = document.getElementById('password');
    let currentUser = users.find(u => u.email.toLowerCase() == convertedEmail && u.password == passwordInput.value);
    if (currentUser) {
        loggedInEmail = currentUser.email;
        await setItem('loggedInEmail', loggedInEmail);
        window.location.href = './summary.html';
        checkStatusofCheckBox();
        clearLogIn();
    } else {
        displayErrorMessage('wrong e-mail or password', emailInput);
        displayErrorMessage('wrong e-mail or password', passwordInput);
    }
}


/**
 * This function checks whether all input fields have been filled and then releases the login button.
 */
function disableLogInButton() {
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    const LogInButton = document.getElementById('LogInButton');
    const allFieldsFilled = emailInput.value && passwordInput.value;
    if (allFieldsFilled) {
        LogInButton.removeAttribute('disabled');
        LogInButton.classList.remove('if-button-disabled');
        LogInButton.classList.add('btn-db');

    } else {
        LogInButton.setAttribute('disabled', true);
        LogInButton.classList.add('if-button-disabled');
    }
}


/**
 * This function checks whether the 'remember me' checkbox has been activated. If this is the case, the email and password are saved in the localStorage for the next login.
 */
function checkStatusofCheckBox() {
    let checkbox = document.getElementById('checkbox');
    if (checkbox.checked) {
        let emailInput = document.getElementById('email');
        let passwordInput = document.getElementById('password');
        localStorage.setItem('email', emailInput.value);
        localStorage.setItem('password', passwordInput.value);
    }
}


/**
 * The useGuestLogIn function sets the values of the email and password fields to predefined guest login information and saves the email address as loggedInEmail for later processing. The user is redirected to the summary page.
 */
async function useGuestLogIn() {
    document.getElementById('email').value = 'guest@account';
    document.getElementById('password').value = 'joinGuest2024';
    const guestUser = users.find(user => user.email.toLowerCase() === 'guest@account');
    if (guestUser) {
        // Füge den Guest als Kontakt hinzu, falls er noch nicht existiert
        if (!contactsSorted.some(contact => contact.name.toLowerCase() === "guest")) {
            const guestContact = {
                ID: 0, // Eindeutige ID für den Gast
                name: "Guest",
                firstName: "Guest",
                lastName: "",
                acronymContact: "G", // oder ein anderes Symbol
                colorContact: "#ccc" // Standardfarbe
                // Weitere Eigenschaften, falls nötig
            };
            contactsSorted.push(guestContact);
            contactsSorted.sort((a, b) => a.name.localeCompare(b.name));
            console.log("Guest-Kontakt hinzugefügt. contactsSorted (sortiert):", contactsSorted.map(c => c.name));
        }
        // Setze die eingeloggte Email
        let loggedInEmail = guestUser.email;
        await setItem('loggedInEmail', loggedInEmail);
        window.location.href = './summary.html';
        clearLogIn();
    } else {
        console.error("Guest user nicht gefunden.");
    }
}




/**
 * This function clears the input fields of the login form.
 */
function clearLogIn() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}



