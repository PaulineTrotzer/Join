/**
 * This function returns the HTML-Code for the element of the current user in the dropdown menu for assigning users to a task (add task form)
 * 
 * @param {object} currentUser - JSON array with the information of the current user
 * @returns - HTML-Code for the element of the current user in the dropdown menu for assigning users to a task (add task form)
 */
async function generateCurrentUserDropDownHTML(currentUser) {
    return /*html*/ ` 
    <div class="contact" onclick="handleCheckboxClick(this)">
        <div class="contact-circle-and-name-box">
            <div style="background-color:${currentUser.colorContact}" class="task-detail-assigned-user-acronym">
                <span>${currentUser.acronymContact}</span> 
            </div>
            <span>${currentUser.name} (YOU)</span> 
        </div>
        <input class="dropdwon-checkbox" id="checkbox-contact-${currentUser.ID}" type="checkbox" onclick="handleCheckboxClick(this)">
    </div>
    `
} 


/**
 * This function returns the HTML-Code for a single element/ user in the dropdown menu for assigning users to a task (add task form)
 * 
 * @param {object} contact  - JSON array with the information of the contact for which the HTML-content is generated
 * @returns - HTML-Code for a single element/ user in the dropdown menu for assigning users to a task (add task form)
 */
async function generateContactDropDownHTML(contact) {
    return /*html*/ ` 
    <div class="contact" onclick="handleCheckboxClick(this)">
        <div class="contact-circle-and-name-box">
            <div style="background-color:${contact.colorContact}" class="task-detail-assigned-user-acronym">
                <span>${contact.acronymContact}</span> 
            </div>
            <span>${contact.name}</span> 
        </div>
        <input class="dropdwon-checkbox" id="checkbox-contact-${contact.ID}" type="checkbox" onclick="handleCheckboxClick(this)">
    </div>`
} 


/**
 * Handles clicking on a contact div to activate checkbox click function.
 *
 * @param {HTMLElement} contactDiv - The contact <div> element that was clicked.
 */
function handleContactDivClick(contactDiv) {
    const checkbox = contactDiv.querySelector(".dropdwon-checkbox");
    if (checkbox) {
      checkbox.checked = !checkbox.checked; // Toggle checkbox state
      handleCheckboxClick(checkbox); // Call handleCheckboxClick function
    }
  }
  
  

/**
 * This function returns the HTML-Code for the icon of an assigned user in the edit/ add task form
 * 
 * @param {object} foundContact - JSON array with the information of the contact for which the HTML-content is generated
 * @returns - HTML-Code for the icon of an assigned user in the edit/ add task form
 */
async function generateIconCheckedContactHTML(foundContact) {
    return /*html*/ ` 
    <div class="checked-contact-box">
        <div class="task-detail-assigned-user-acronym" style="background-color:${foundContact.colorContact}">
            <span>${foundContact.acronymContact}</span> 
        </div>
    </div>
    `
} 


/**
 * This function returns the HTML-Code for the element of the current user in the dropdown menu for assigning users to a task (edit task view)
 * 
 * @param {number} positionContact - position of the contact of the current user in the array contactsSorted
 * @returns - HTML-Code for the element of the current user in the dropdown menu for assigning users to a task (edit task view)
 */
async function generateCurrentUserDropDownEditTaskHTML(positionContact) {
    
    return /*html*/ `
    <div class="contact" onclick="handleCheckboxClick(this)">
        <div class="contact-circle-and-name-box">
            <div style="background-color:${contactsSorted[positionContact]['colorContact']}" class="task-detail-assigned-user-acronym">
                <span>${contactsSorted[positionContact]['acronymContact']}</span> 
            </div>
            <span>${contactsSorted[positionContact]['name']} (YOU)</span> 
        </div>
        <input class="dropdwon-checkbox" id="checkbox-contact-${contactsSorted[positionContact]['ID']}" type="checkbox" onclick="handleCheckboxClick(this)"/>
    </div>
`
}


/**
 * This function returns the HTML-Code for a single element/ user in the dropdown menu for assigning users to a task (edit task view)
 * 
 * @param {number} positionContact  - position of the contact for which the element in the dropdown is created
 * @returns - HTML-Code for a single element/ user in the dropdown menu for assigning users to a task (edit task view)
 */
async function generateContactDropDownEditTaskHTML(positionContact) {
    return /*html*/ `
    <div class="contact">
        <div class="contact-circle-and-name-box">
            <div style="background-color:${contactsSorted[positionContact]['colorContact']}" class="task-detail-assigned-user-acronym">
                <span>${contactsSorted[positionContact]['acronymContact']}</span> 
            </div>
            <span>${contactsSorted[positionContact]['name']}</span> 
        </div>
        <input class="dropdwon-checkbox" id="checkbox-contact-${contactsSorted[positionContact]['ID']}" type="checkbox" onclick="handleCheckboxClick(this)"/>
    </div>
`
}


/**
 * This function generates the HTML-Code for a single subtask in the list of subtasks
 * 
 * @param {number} positionSubtask - position of the subtask
 * @param {string} currentSubtaskTitle - title of the subtask
 * @returns 
 */
async function generateSingleSubtaskHTML(positionSubtask, currentSubtaskTitle) {
    return /*html*/ `
    <div id="subtaskListElement${positionSubtask}" class="subtask-list" onmouseover="showElement('subtask-icons${positionSubtask}')" onmouseout="hideElement('subtask-icons${positionSubtask}')" onclick="editSubtask(${positionSubtask})"> 
        <span>&#x2022; ${currentSubtaskTitle}</span>
        <div class="subtask-icons d-none" id="subtask-icons${positionSubtask}"> 
            <button class="delete-btn" type="button" onclick="deleteSubtask(${positionSubtask}), stopPropagation(event)"></button>
            <button class="confirm-btn" type="button" onclick="editSubtask(${positionSubtask})"></button>
        </div>
    </div>
    `
}


/**
 * This function generates the HTML-Code for a subtask in the edit mode
 * 
 * @param {number} i - id/ counter of the edited subtask
 * @param {string} subtaskTitle - title of the subtask that is edited
 * @returns - HTML-Code for a subtask in the edit mode
 */
async function generateEditSubtaskHTML(i, subtaskTitle) {
    return /*HTML*/ `
        <input class="input-edit-subtask" type="text" id="editedSubtask${i}" class="input-add-task" value="${subtaskTitle}" onkeyup="checkInputEditSubtask(event, ${i})">
        <div class="subtask-icons"> 
            <button class="check-square-btn" type="button" onclick="updateSubtask(${i})"></button>
            <button class="delete-btn white-bg" type="button" onclick="deleteSubtask(${i})"></button>
        </div>
    `
}
