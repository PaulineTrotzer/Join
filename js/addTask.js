const SUBTASK_ID = 0;
let taskPrio = "Medium";
let assignedUsers = [];
let category = [];
let contactsRendered = false;

async function initAddTask() {
  await includeHTML();
  await loadUserData();
  await getLoggedInEmail();
  await proofAuthentification(loggedInEmail);
  await checkPersonalheader(loggedInEmail);
  await loadContacts();
  await checkIfGuestOrCurrentUser();
  await sortArrayContacts();
  await loadTasks();
  clearAssignedUsersArray();
  changeSelectedTab("tab-add-task");
  addEventListenerToAddForm();
  setMinDueDate("task-input-dueDate");
  checkReferringFromBoard();
}


/**
 * This function clears the array with the currently assigned users
 */
function clearAssignedUsersArray() {
  assignedUsers = [];
}


/**
 * This function adds an event listener to the add task form element to prevent the default behaviour of the enter key
 */
function addEventListenerToAddForm() {
  document.getElementById("Add-Task-Form").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
}


/**
 * This function can be assigned to single elements so that clicking on enter within this elements submits the form
 *
 * @param {object} event
 */
function checkSubmission(event) {
  if (event.key == "Enter") {
    document.getElementById("submit-btn").click();
  }
}


/**
 * This function ensures that dates in the past can not be selected as due date
 *
 * @param {string} idOfElement - id of the input field for which the min date is set
 */
function setMinDueDate(idOfElement) {
  let startDate = new Date();

  let minYear = startDate.getFullYear();
  let minMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  let minDay = String(startDate.getDate()).padStart(2, "0");

  let today = `${minYear}-${minMonth}-${minDay}`;
  document.getElementById(idOfElement).setAttribute("min", today);
}


/**
 * This function changes the colors of the priority buttons and changes the remaining two buttons back, if switched between them
 */
function changeButtonColorsUrgent() {
  taskPrio = "Urgent";
  document.getElementById("urgentButton").classList.add("urgent-btn-red");
  document.getElementById("urgentButton").classList.remove("prio-btn-neutral");
  document.getElementById("urgent-icon").src = "./assets/img/prio_alta_w.svg";

  document.getElementById("mediumButton").classList.remove("medium-btn-yellow");
  document.getElementById("mediumButton").classList.add("prio-btn-neutral");
  document.getElementById("medium-icon").src = "./assets/img/prio_medium_color.svg";

  document.getElementById("lowButton").classList.remove("low-btn-green");
  document.getElementById("lowButton").classList.add("prio-btn-neutral");
  document.getElementById("low-icon").src = "./assets/img/prio_baja.svg";
}


/**
 * This function changes the colors of the priority buttons and changes the remaining two buttons back, if switched between them
 */
function changeButtonColorsMedium() {
  taskPrio = "Medium";
  document.getElementById("mediumButton").classList.add("medium-btn-yellow");
  document.getElementById("mediumButton").classList.remove("prio-btn-neutral");
  document.getElementById("medium-icon").src = "./assets/img/prio_medium_white.svg";

  document.getElementById("urgentButton").classList.remove("urgent-btn-red");
  document.getElementById("urgentButton").classList.add("prio-btn-neutral");
  document.getElementById("urgent-icon").src = "./assets/img/prio_alta2.svg";

  document.getElementById("lowButton").classList.remove("low-btn-green");
  document.getElementById("lowButton").classList.add("prio-btn-neutral");
  document.getElementById("low-icon").src = "./assets/img/prio_baja.svg";
}


/**
 * This function changes the colors of the priority buttons and changes the remaining two buttons back, if switched between them
 */
function changeButtonColorsLow() {
  taskPrio = "Low";
  document.getElementById("lowButton").classList.add("low-btn-green");
  document.getElementById("lowButton").classList.remove("prio-btn-neutral");
  document.getElementById("low-icon").src = "./assets/img/prio_baja_w.svg";

  document.getElementById("mediumButton").classList.remove("medium-btn-yellow");
  document.getElementById("mediumButton").classList.add("prio-btn-neutral");
  document.getElementById("medium-icon").src = "./assets/img/prio_medium_color.svg";

  document.getElementById("urgentButton").classList.remove("urgent-btn-red");
  document.getElementById("urgentButton").classList.add("prio-btn-neutral");
  document.getElementById("urgent-icon").src = "./assets/img/prio_alta2.svg";
}


/**
 * activates the rotation of the arrow icon of the dropdown menu
 * by checkin the id's style (blocked or none) the dropdown menu will be de-/activated
 */
function activateDropdown() {
  const dropDownMenu = document.getElementById("assignedContactsCtn");
  const dropDownIcon = document.querySelector(".dropDownIcon");

  toggleIconRotation(); 
  dropDownMenu.style.display = dropDownMenu.style.display === "block" ? "none" : "block";
  renderContacts();

  if (dropDownMenu.style.display === "block") {
    document.body.addEventListener("click", clickOutsideHandler);
  } else {
    document.body.removeEventListener("click", clickOutsideHandler);
  }
}


/**
 * Toggles the rotation of the dropdown icon by 180 degrees
 */
function toggleIconRotation() {
  const dropDownIcon = document.querySelector(".dropDownIcon");
  dropDownIcon.classList.toggle("rotate180");
}


/**
 * This function ensures that the drop down with the contacts is closed when the user clicks outside of it in the add task forn
 *
 * @param {object} event
 */
function clickOutsideHandler(event) {
  const dropDownMenu = document.getElementById("assignedContactsCtn");
  if (!dropDownMenu.contains(event.target) && event.target.className !== "input-add-task") {
    dropDownMenu.style.display = "none";
  }
}


/**
 * This function renders the contacts in the drop down (if not available yet)
 */
async function renderContacts() {
  if (!contactsRendered) {
    await renderCurrentUser();
    await renderOtherContacts();
    contactsRendered = true;
  } 
}


/**
 * This function renders the content for the current user in the drop down with the assigned users in the add task form
 */
async function renderCurrentUser() {
  const assignedContacts = document.getElementById("assignedContactsCtn");
  const existingContactNames = Array.from(
    document.querySelectorAll("#assignedContactsCtn .contact span:nth-child(2)")).map((span) => span.innerText.trim());

    const currentUserExists = existingContactNames.includes(currentUser.name);
    if (!currentUserExists && currentUser.name !== 'Guest') {
      const currentUser = contactsSorted[0]
      assignedContacts.innerHTML += await generateCurrentUserDropDownHTML(currentUser);
  }
}


/**
 * This function renders the content for the contacts in the drop down with the assigned users in the add task form
 */
async function renderOtherContacts() {
  const assignedContacts = document.getElementById("assignedContactsCtn");
  const existingContactNames = Array.from(
    document.querySelectorAll("#assignedContactsCtn .contact span:nth-child(2)")
  ).map(span => span.innerText.trim());
  
  let validContacts = contactsSorted.filter(contact => !contact.deleted);
  validContacts.sort((a, b) => {
    if (!a || !b) return 0;
    if (currentUserAsContact && a.ID === currentUserAsContact.ID) {
      return -1;
    }
    if (currentUserAsContact && b.ID === currentUserAsContact.ID) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });
  assignedContacts.innerHTML = ""; 
  for (let i = 0; i < validContacts.length; i++) {
    const contact = validContacts[i];
    if (!contact) {
      console.warn(`Kontakt an Index ${i} ist undefiniert.`);
      continue;
    }
    const contactExists = existingContactNames.includes(contact.name);
    if (!contactExists) {
      const html = await generateContactDropDownHTML(contact);
      assignedContacts.innerHTML += html;
    }
  }
  addClickEventListenersToContactDivs();
}



/**
 * This function adds click event listeners to contact divs to activate the checkboxes.
 */
function addClickEventListenersToContactDivs() {
  var contactDivs = document.getElementsByClassName('contact');
  for (var i = 0; i < contactDivs.length; i++) {
      var div = contactDivs[i];
      div.addEventListener('click', function(event) {     
          var checkbox = this.querySelector('input[type="checkbox"]'); // Die Checkbox innerhalb des Divs finden
          if (event.target === checkbox) { // Überprüfen, ob das Klicken auf die Checkbox selbst erfolgt ist
              return; // Checkbox-Klick, nichts weiter tun
          }
          checkbox.checked = !checkbox.checked; // Wenn ungecheckt Checkbox umschalten

          handleCheckboxClick(checkbox)
      });
  }
}


/**
 * Handles clicking on a checkbox since it has to activate two functions.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element that was clicked.
 */
function handleCheckboxClick(checkbox) {
  saveContactsToArray(checkbox);
  toggleActive(checkbox);
}


/**
 * Toggles the css active state/colorchange of a contact.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element representing the contact.
 */
function toggleActive(checkbox) {
  const contact = checkbox.parentElement;
  if (checkbox.checked) {
    contact.classList.add("active");
  } else {
    contact.classList.remove("active");
  }
}


/**
 * This function searches the id of a contact based on the ID and depending on the status of the chechbox adds or removes it from the array with the assigned users
 *
 * @param {object} checkbox - checkbox of the element that is added or removed to the assigned contacts
 */
async function saveContactsToArray(checkbox) {
  let partsIdCheckbox = checkbox.id.split("-");
  let extractedIdOfUser = partsIdCheckbox.slice(2).join("-");

  if (extractedIdOfUser) {
    let userID = Number(extractedIdOfUser);
    let positionContact = contactsSorted.findIndex((id) => id["ID"] == userID);
    let userName = contactsSorted[positionContact]["name"];

    if (checkbox.checked) {
      assignedUsers.push({ name: userName, ID: userID });
    } else {
      assignedUsers = assignedUsers.filter(contact => contact.ID !== userID);
    }
    await renderCheckedContacts();
  }
}


/**
 * This function renders the icons for the currently selected contacts in the add task form
 */
async function renderCheckedContacts() {
    let checkedContactsCtn = document.getElementById('checkedContactsCtn');
    checkedContactsCtn.innerHTML = ''; 
    
    for (let i = 0; i < assignedUsers.length; i++){
        let foundContact = contactsSorted.find(contact => contact.ID === assignedUsers[i].ID);
        if (foundContact) {
            checkedContactsCtn.innerHTML += await generateIconCheckedContactHTML(foundContact);
        }
    }
}


/**
 * Gets the selected value from the category dropdown and pushes it into the category array
 * deletes the previous category before push
 */
function setCategory(i) {
  taskCategories = document.querySelector("#selectCategory");
  selectedCategory = taskCategories.value;
  category.splice(i, 1);
  category.push(selectedCategory);
}


/**
 * This function clears all inputs and arrays in the add task form
 */
async function clearForm() {
  addedSubtasks = [];
  clearAssignedUsersArray();
  resetFormElements();
  await renderCheckedContacts();
  changeButtonColorsMedium();
  loadNewSubtasks();
}


/**
 * This function resets all the input fields in the add task form
 */
function resetFormElements() {
  document.getElementById("Add-Task-Form").reset();
}