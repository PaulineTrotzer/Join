let addedSubtasks = [];


/**
 * This function checks whether the enter key was pressed - in that case the subtask is added to the array with the current subtasks
 * 
 * @param {object} event 
 */
function checkInputSubtask(event) {
    if (event.key == "Enter") {
        saveSubtaskToArray();
    }
}


/**
 * This function checks whether the enter key was pressed - in that case the subtask is added to the array with the current subtasks
 * 
 * @param {object} event 
 * @param {number} i - id/ counter of the edited subtask
 */
function checkInputEditSubtask(event, i) {
    if (event.key == "Enter") {
        updateSubtask(i);
        saveSubtaskToArray();
    }
}


/**
 * This function changes the input buttons within the input field for the subtasks to the "active" view
 */
function changeInputSubtaskButtons() {
    let plusButton = document.getElementById("input-subtask-btn-ctn")
    plusButton.innerHTML = `
        <button class="x-btn" type="button" onclick="defaultInputSubtask()"></button>
        <div class="small-divider"></div>
        <button class="check-round-btn" type="button" onclick="saveSubtaskToArray()"></button>
    `
    focusElement('subtaskInput');
}


/**
 * This function resets the input button within the input field to the default
 */
function defaultInputSubtask() {
    let buttonsContainer = document.getElementById("input-subtask-btn-ctn");
    buttonsContainer.innerHTML = `    
        <button type="button" id="plus-btn" class="subtask-plus-btn" onclick="changeInputSubtaskButtons()"></button>
    `
    document.getElementById('subtaskInput').value = '';
    focusElement('subtaskInput');
}


/**
 * This function sets the focus to the chosen input field and sets the cursor to the end of the text
 * 
 * @param {string} idOfElement - element/ input field that should be focused 
 */
function focusElement(idOfElement) {
    document.getElementById(idOfElement).focus();
    let textLength = document.getElementById(idOfElement).value.length;
    document.getElementById(idOfElement).setSelectionRange(textLength, textLength);
}


/**
* Saves the subtasks fomt the subtaskInput to the array addedSubtasks
*/
function saveSubtaskToArray() {
    let inputText = document.getElementById('subtaskInput').value.trim(); 
    if (inputText) { 
        let timeStampSubtask = new Date().getTime();

        let newSubtask = {
            'idSubtask': `${timeStampSubtask}`,
            'titleSubtask': inputText,
            'statusSubtask': "open",
        }
        addedSubtasks.push(newSubtask);
        document.getElementById('subtaskInput').value = '';

        loadNewSubtasks(); 
        defaultInputSubtask();
    }
}


/**
 * Iterrates through the array subtasks and renders the subtasks 
 * only adds a subtask if the array isn't empty
 */
async function loadNewSubtasks() {
    let subtaskList = document.getElementById('added-subtask-ctn');
    subtaskList.innerHTML = '';

    for (let i = 0; i < addedSubtasks.length; i++) {

        if (addedSubtasks[i].titleSubtask && typeof addedSubtasks[i].titleSubtask === 'string') {
            const currentSubtaskTitle = addedSubtasks[i].titleSubtask.trim();

            if (currentSubtaskTitle !== '') {
                subtaskList.innerHTML += await generateSingleSubtaskHTML(i, currentSubtaskTitle);
            }
        }
    }
};


/**
 * This function changes a single subtask into an input field so that the subtask can be edited
 * 
 * @param {number} i - id/ counter of the edited subtask
 */
async function editSubtask(i) {
    let subtaskElement = document.getElementById(`subtaskListElement${i}`);
    let subtaskText = subtaskElement.querySelector('span').innerText.trim();

    let subtaskTitle = subtaskText.slice(2).trim();

    subtaskElement.innerHTML = await generateEditSubtaskHTML(i, subtaskTitle);
    subtaskEditMode(i);
}


/**
 * This function changes the classes (e.g. to prevent the hover effect) and removes the mouse events when the edit mode is active
 * It also focuses the subtask edited and sets the cursor to the end of the text
 * 
 * @param {number} i - id/ counter of the edited subtask
 */
function subtaskEditMode(i) {
    let subtaskElement = document.getElementById(`subtaskListElement${i}`);
    subtaskElement.classList.add('subtask-list-edit-mode');
    subtaskElement.classList.remove('subtask-list');
    subtaskElement.onmouseover = null;
    subtaskElement.onmouseout = null;
    subtaskElement.onclick = null;
    focusElement(`editedSubtask${i}`);
}


/**
 * This function changes the title of the subtask according to the input in the edit mode and reloads the subtasks
 * 
 * @param {number} i - id/ counter of the edited subtask
 */
function updateSubtask(i) {
    let editedSubtaskTitle = document.getElementById(`editedSubtask${i}`).value.trim();
    if (editedSubtaskTitle) {
        addedSubtasks[i].titleSubtask = editedSubtaskTitle;
        loadNewSubtasks();
        focusElement('subtaskInput');
    } else {
        alert("Subtask title cannot be empty!");
    }
}


/**
 * This function deletes a subtask by clicking on the trashcan icon from the array
 */
function deleteSubtask(i) {
    addedSubtasks.splice(i, 1)
    loadNewSubtasks();
}