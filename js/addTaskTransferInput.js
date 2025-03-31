/**
 * This function checks if the user is forwarded from the board - if this is the case the status for the submission of the form is taken from the local storage
 */
async function checkReferringFromBoard() {
    if (document.referrer.slice(-10) == "board.html") {
        let statusFromBoard = localStorage.getItem('statusTransfer');
        if (statusFromBoard) {
            document.getElementById('Add-Task-Form').setAttribute("onsubmit", `submitTask('${statusFromBoard}'); return false;`);
            await renderContacts();
        }

        let temporaryInputAddTaskAsText = localStorage.getItem('temporaryInputAddTask');
        if (temporaryInputAddTaskAsText) {
            temporaryInputAddTask = JSON.parse(temporaryInputAddTaskAsText);
            setInputValuesFromBoard(temporaryInputAddTask);
        }
    }
}


/**
 * This function transfers the inputs inserted in the add task form on the board page to the form in the add task page
 * 
 * @param {object} input - array with the input/ values from the local storage
 */
async function setInputValuesFromBoard(input) {
    if (input.titleTask) {
        document.getElementById('task-input-title').value = input.titleTask;
    }
    if (input.descriptionTask) {
        document.getElementById('task-input-description').value = input.descriptionTask;
    }
    if (input.assignedContacts) {
        await setAssignedUsersTransfer (input);
        renderCheckedContacts();
    }
    if (input.dueDate) {
        document.getElementById('task-input-dueDate').value = input.dueDate.toLocaleString().substring(0,10);
    }
    if (input.priority) {
        taskPrio = input.priority;
        setPriorityTransfer();
    }
    if (input.category) {
        document.getElementById('selectCategory').value = input.category;
    }
    if (input.subtasks) {
        await createSubtasksTransfer(input);
        loadNewSubtasks(); 
    }
}


/**
 * This function checks the checkbox and adds the contact to the array with the users currently selected
 * 
 * @param {object} input - array with the input/ values from the local storage
 */
async function setAssignedUsersTransfer(input) {
    console.log('ja');
for (let i = 0; i < input.assignedContacts.length; i++) {
    let idContact = input.assignedContacts[i]["idContact"];
    let positionContact = contactsSorted.findIndex((id) => id["ID"] == idContact);

    document.getElementById(`checkbox-contact-${idContact}`).checked = true;
    document.getElementById(`checkbox-contact-${idContact}`).parentElement.classList.add("active");

    assignedUsers.push({
    name: contactsSorted[positionContact]["name"],
    ID: contactsSorted[positionContact]["ID"],
    });
}
}

  
/**
 * This function sets the priority according to the current value of the global variable "taskPrio"
 */
function setPriorityTransfer() {
    if (taskPrio == "Urgent") {
        changeButtonColorsUrgent();
    } else if (taskPrio == "Medium") {
        changeButtonColorsMedium();
    } else if (taskPrio == "Low") {
        changeButtonColorsLow();
    }
}


/**
 * This function pushes the subtasks from the local storage into the array "addedSubtasks"
 * 
 * @param {object} input - array with the input/ values from the local storage
 */
async function createSubtasksTransfer(input) {
    for (let j = 0; j < input.subtasks.length; j++) {
        addedSubtasks.push(input.subtasks[j]);
    }
}