let loggedInEmail;
let currentUser;

let prioritiesTask = ['Urgent', 'Medium', 'Low'];

async function initSummary() {
    await includeHTML();
    await loadUserData();
    await loadContacts();
    await getLoggedInEmail();
    await proofAuthentification(loggedInEmail);
    await checkPersonalheader(loggedInEmail);
    await identifyCurrentUser();
    await personalizeAppContent(currentUser);
    await loadTasks();
    await renderOverviewTasks();
    changeSelectedTab('tab-summary');
    checkDisplayGreetingAnimation();
    await setOnresizeFunction('body-summary', 'checkWindowWidthSummary()');
}


/**
 * This function displays/ hides the greeting of the user depending on the window width
 */
function checkWindowWidthSummary() {
    if (window.innerWidth <= 1350) {
        document.getElementById('greeting_and_name_ctn').classList.add('d-none');
    } else {
        document.getElementById('greeting_and_name_ctn').classList.remove('d-none');
    }
}


/**
 * This function checks if the user is forwarded from the login page
 * 
 * @returns - true in case that user is forwarded from the login page
 */
function checkReferringFromIndex() {
    if (document.referrer.slice(-10) == "index.html") {
        return true;
    }
}


/**
 * This function ensures that the greeting animation is displayed correctly depending on the previous page and the current window width
 */
function checkDisplayGreetingAnimation() {
    if (checkReferringFromIndex() && window.innerWidth <= 1350) {
        document.getElementById('greeting_and_name_ctn').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('title_ctn').classList.remove('d-none');
            document.getElementById('summary_content_ctn').classList.remove('d-none');
            document.getElementById('greeting_and_name_ctn').classList.add('d-none');
          }, 1500);
    } else if (window.innerWidth <= 1350) {
        document.getElementById('title_ctn').classList.remove('d-none');
        document.getElementById('summary_content_ctn').classList.remove('d-none');
    } else {
        document.getElementById('title_ctn').classList.remove('d-none');
        document.getElementById('summary_content_ctn').classList.remove('d-none');
        document.getElementById('greeting_and_name_ctn').classList.remove('d-none');
    }
}


/**
 * this function finds the current email address via the getItem function and returns it
 * 
 * @returns - the email the user is currently logged in with
 */
async function getLoggedInEmail() {
    try {
        const response = await getItem('loggedInEmail');
        loggedInEmail = response['data']['value'];
        return loggedInEmail;
    } catch (error) {
        alert('An error has occurred', error);
        return '';
    }
}

/**
 * The proofAuthentification function checks whether the passed loggedInEmail string, after removing spaces, is equal to [] (empty array). If this is the case, user redirection to the "index.html" page is triggered.
 * 
 * @param {string} loggedInEmail - the email which was used for the login
 * @returns - returns with no action
 */
async function proofAuthentification(loggedInEmail) {
    if (loggedInEmail.trim() === "[]") {
        window.location.href = "index.html"; 
    } else {
        return; 
    }
}


/**
 * this function finds the current user in the users json based on the email entered.

 * 
 * @returns - an array with information about the currentUser
 */
async function identifyCurrentUser() {
    currentUser = users.find(u => u.email === loggedInEmail);
    return currentUser;
}


/**
 * This function generates a personal interface in case that it is not the user with the  guest login. Includes: greeting, own contact and acronym.
 * 
 * @param {array} currentUser - current user 
 */
async function personalizeAppContent(currentUser) {
    if (currentUser.name.toLowerCase() !== 'guest') {
        const acronym = currentUser.acronym;
        generateGreeting(currentUser, acronym);
        createOwnContact(currentUser);
    } else {
        const acronym = currentUser.acronym;
        generateGreeting(currentUser, acronym);
    }
}


/**
 * This function checks whether there is already a contact with the user data of the current user. If this is not the case, the new user is added as a contact.
 * 
 * @param {array} currentUser - the current user who has logged in.
 */
async function createOwnContact(currentUser) {
    const existingContact = await checkIfContactAlreadyExist();
    if (!existingContact) {
        let currentUserAsContact = {
            ID: currentUser.ID,
            name: currentUser.name,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            acronymContact: currentUser.acronym,
            colorContact: setBackgroundcolor(),
            emailContact: currentUser.email,
            phoneContact: ""
        }
        contacts.push(currentUserAsContact);
        await setItem('contacts', JSON.stringify(contacts));
    }
}


/**
 * This function checks whether there is already a contact with the email address entered
 * 
 * @returns - a comparison of the current e-mail address and the e-mail addresses in the contacts array
 */
async function checkIfContactAlreadyExist() {
    loggedInEmail = await getLoggedInEmail();
    return contacts.find(contact => contact.emailContact === loggedInEmail);
}


/**
 * This function generates the greeting for the guest login, as well as the personal user and their acronym icons in the header area.
 */
async function generateGreeting() {
    const currentHour = new Date().getHours();

    if (currentUser.name.toLowerCase() === 'guest') {
        greetingGuest(currentHour);
    } else {
        greetingUser(currentHour);
    }
    generateUserIcon();
}


/**
 * This function processes the hourly value of the current time into a welcome text
 * 
 * @param {number} hour - the current hour in your own medium 
 * @returns - greeting text
 */
function getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
}


/**
 * This function renders a welcome text including the user's first (and last) name.
 * 
 * @param {number} currentHour - current hour 
 */
function greetingUser(currentHour) {
    const greetingText = document.getElementById('greetingText');
    greetingText.innerHTML = `${getGreeting(currentHour)}, 
    <br><span class="greeting-username-format">${currentUser.firstName} ${currentUser.lastName}</span>`;
}


/**
 * This function renders a welcome text for the user who logs in with the guest login.
 * 
 * @param {number} currentHour - current hour
 */
function greetingGuest(currentHour) {
    const greetingText = document.getElementById('greetingText');
    greetingText.innerHTML = getGreeting(currentHour);
}


/**
 * This function renders the dynamic content of the summary concerning the tasks
 */
async function renderOverviewTasks() {
    for (let i = 0; i < statusTask.length; i++) {
        let currentStatus = statusTask[i]
        document.getElementById(`summary-tasks-${currentStatus}`).innerHTML = countTasks(currentStatus);
    }

    document.getElementById(`summary-tasks-all`).innerHTML = `${tasks.length}`;
    getUpcomingTask();
}


/**
 * This function counts how many tasks exists for a certain status
 * 
 * @param {string} currentStatus - status for which the tasks are counted
 * @returns - number of tasks existing for the given status 
 */
function countTasks(currentStatus) {
    let counter = 0;
    for (let j = 0; j < tasks.length; j++) {
        if (tasks[j]['statusTask'] == currentStatus) {
            counter++;
        }
    }
    return counter;
}


/**
 * This function iterates through the priorities (in descending order) and calls the function to check whether tasks are available 
 * In case that there are tasks for the current priority the for loop is stopped (and the closest upcoming date is displayed)
 */
function getUpcomingTask() {
    for (k = 0; k < prioritiesTask.length; k++) {
        let currentPriority = prioritiesTask[k];
        if (checkExistingTasksForPriority(currentPriority)) {
            break;
        }
    }

}


/**
 * This function checks whether tasks are available for the given priority (tasks with the status "done" are not included) 
 * In case that tasks are availabe it sets the corresponding values in the summary and returns true (so that the for loop is interrupted)
 * 
 * @param {string} currentPriority - priority for which shall be checked if tasks exist
 * @returns - true if tasks exist for the given priority, else false
 */
async function checkExistingTasksForPriority(currentPriority) {
    let tasksCurrentPriority = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]['priority'] == currentPriority && tasks[i]['statusTask'] !== 'done') {
            tasksCurrentPriority.push(tasks[i]);
        }
    }

    if (tasksCurrentPriority.length > 0) {
        setIconPriority(currentPriority);
        document.getElementById(`summary-number-upcoming-task`).innerHTML = tasksCurrentPriority.length;
        document.getElementById(`summary-priority-upcoming-task`).innerHTML = currentPriority;
        document.getElementById(`summary-date-upcoming-task`).innerHTML = await getClosestDate(tasksCurrentPriority);
        return true;
    }
}


/**
 * This function determinates the task with the closest due date for the selected priority and returns the due date for this task
 * 
 * @param {array} tasksCurrentPriority - array of tasks with the currently selected priority  
 * @returns - formatted date of the closest upcoming task for the selected priority
 */
async function getClosestDate(tasksCurrentPriority) {
    let closestDate = tasksCurrentPriority[0]['dueDate'];
    for (d = 1; d < tasksCurrentPriority.length; d++) {
        let dateCurrentTask = tasksCurrentPriority[d]['dueDate'];
        if (dateCurrentTask < closestDate) {
            closestDate = dateCurrentTask;
        }
    }

    formattedClosestDate = new Date(closestDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return formattedClosestDate;
}


/**
 * This function sets the background color and the img for the highest priority currently available 
 * 
 * @param {string} currentPriority - highest priority curently available in the array tasks
 */
function setIconPriority(currentPriority) {

    if (currentPriority == 'Urgent') {
        document.getElementById(`summary-img-priority`).src = "./assets/img/prio_urgent_white.svg";
        document.getElementById(`summary-icon-priority`).style.backgroundColor = `#FF3D00`;
    } else if (currentPriority == 'Medium') {
        document.getElementById(`summary-img-priority`).src = "./assets/img/prio_medium_white.svg";
        document.getElementById(`summary-icon-priority`).style.backgroundColor = `#FFA800`;
    } else if (currentPriority == 'Low') {
        document.getElementById(`summary-img-priority`).src = "./assets/img/prio_low_white.svg";
        document.getElementById(`summary-icon-priority`).style.backgroundColor = `#7AE229`;
    }
}