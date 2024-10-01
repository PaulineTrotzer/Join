let statusTask = ["toDo", "inProgress", "awaitFeedback", "done"];
let tasks = [];
let positionOfTask;



async function initBoard() {
  await includeHTML();
  await loadUserData();
  await getLoggedInEmail();
  await proofAuthentification(loggedInEmail);
  await checkPersonalheader(loggedInEmail);
  await loadContacts();
  await loadTasks();
  await checkIfGuestOrCurrentUser();
  await sortArrayContacts();
  await renderBoard(tasks);
  changeSelectedTab("tab-board");
}


/**
 * This function loads all the tasks currently existing (in the local array) into a JSON-Array
 */
async function loadDummyTasks() {
  let resp = await fetch("tasks.json");
  tasks = await resp.json();
}


/**
 * This function can be used to initially store the locally saved tasks in the backend
 */
async function storeDummyTasks() {
  await loadDummyTasks();
  await saveTasks();
}


/**
 * This functions saves the tasks in the backend
 */
async function saveTasks() {
  await setItem("tasks", JSON.stringify(tasks));
}


/**
 * This function loads all the tasks currently existing in the backend into a JSON-Array
 */
async function loadTasks() {
  let resp = await getItem("tasks");
  tasksAsString = resp["data"]["value"];
  tasks = JSON.parse(tasksAsString);
}


/**
 * This function iterates through all the status and selects the tasks for this status based on the tasks currently selected
 * It deletes the HTML-content of each column/ status and calls the functions to update the HTML-content
 *
 * @param {array} currentTasks - array of tasks currently selected
 */
async function renderBoard(currentTasks) {
  for (let i = 0; i < statusTask.length; i++) {
    document.getElementById(`tasks-${statusTask[i]}`).innerHTML = ``;
    await updateStatus(statusTask[i], currentTasks);
  }
}


/**
 * This function empties the array for each status then iterates through all available tasks to update the arrays
 * This function filters the available tasks for each status and calls the functions to create the HTML-content for each task on the kanban board
 * If there is no task available for a certain status a container shows that currenty there are no tasks in this status
 *
 * @param {string} status - indicates the column/ status that is updated
 * @param {array} currentTasks - array of tasks currently selected
 */
async function updateStatus(status, currentTasks) {
  let selectedTasks = currentTasks.filter((t) => t["statusTask"] == status);

  if (selectedTasks.length == 0) {
    document.getElementById(`empty-tasks-${status}`).classList.remove("d-none");
  } else {
    document.getElementById(`empty-tasks-${status}`).classList.add("d-none");
    for (let j = 0; j < selectedTasks.length; j++) {
      let currentIdTask = selectedTasks[j]["idTask"];
      positionOfTask = currentTasks.findIndex((id) => id["idTask"] == currentIdTask);

      document.getElementById(`tasks-${status}`).innerHTML += await generateCardSmallHTML(currentTasks ,positionOfTask ,currentIdTask);
      await createDynamicElementsCardSmall(currentTasks, positionOfTask, currentIdTask);
    }
  }
}


/**
 * This function sets the dynamic values for a task/ card on the kanban board
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the card on the kanban board is created
 * @param {string} currentIdTask - id of the task for which the card on the kanban board is created
 */
async function createDynamicElementsCardSmall(currentTasks, positionOfTask, currentIdTask) {
  getSelectedCategory(`category-task-${currentIdTask}`, currentTasks, positionOfTask);
  await checkSubtasks(currentTasks, positionOfTask);
  await checkAssignedContactsCardSmall(currentTasks, positionOfTask, currentIdTask);
  getSelectedPriority(`img-prio-task-${currentIdTask}`, currentTasks, positionOfTask);
}


/**
 * This function gets the category of a given task and sets the corresponding background-color
 *
 * @param {string} idOfElement - id of the element for which the background-color should be set
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the category should be determinated
 */
function getSelectedCategory(idOfElement, currentTasks, positionOfTask) {
  let categoryOfTask = currentTasks[positionOfTask]["category"];

  if (categoryOfTask == "User Story") {
    document.getElementById(idOfElement).style.backgroundColor = "#0038FF";
  } else if (categoryOfTask == "Technical Task") {
    document.getElementById(idOfElement).style.backgroundColor = "#1FD7C1";
  }
}


/**
 * This functions checks if a task has subtasks
 * If a task has subtasks it calls a function to calculate the progress - if a tasks has no subtasks the progress bar is not displayed at all
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array tasks) for which the completion rate is calculated
 */
async function checkSubtasks(currentTasks, positionOfTask) {
  let numberOfSubtasks = currentTasks[positionOfTask]["subtasks"].length;

  if (numberOfSubtasks == 0) {
    document.getElementById(`ctn-card-subtasks-small-${currentTasks[positionOfTask]["idTask"]}`).classList.add("d-none");
  } else {
    calculateProgressSubtasks(currentTasks, positionOfTask, numberOfSubtasks);
  }
}


/**
 * This functions calculates the completion rate of the subtasks of a given task so that the progress bar and the title can be displayed correctly
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array tasks) for which the completion rate is calculated
 * @param {number} numberOfSubtasks - number of subtasks of the task currently selected
 */
function calculateProgressSubtasks(currentTasks, positionOfTask, numberOfSubtasks) {
  let numberOfSubtasksClosed = 0;

  for (let k = 0; k < numberOfSubtasks; k++) {
    if (
      currentTasks[positionOfTask]["subtasks"][k]["statusSubtask"] == "closed"
    ) {
      numberOfSubtasksClosed++;
    }
  }

  let completionOfSubtasks = (numberOfSubtasksClosed / numberOfSubtasks) * 100;
  document.getElementById(`progress-task-${currentTasks[positionOfTask]["idTask"]}`).style.width = completionOfSubtasks + "%";
  document.getElementById(`span-subtasks-${currentTasks[positionOfTask]["idTask"]}`).innerHTML = `${numberOfSubtasksClosed}/${numberOfSubtasks}`;
  document.getElementById(`ctn-card-subtasks-small-${currentTasks[positionOfTask]["idTask"]}`).title = `${numberOfSubtasksClosed} of ${numberOfSubtasks} subtasks completed`;
}


/**
 * This function checks the number of assigned contacts to a task and creates the content for the kanban card depending on this number
 * Up to 4 contacts/ icons are displayed on the card - in case of more assigned contacts a dummy-icon indicates the number of the remaining contacts
 * In case that no contacts are assigned to a task nothing is displayed
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the card on the kanban board is created
 * @param {string} currentIdTask - id of the task for which the card on the kanban board is created
 */
async function checkAssignedContactsCardSmall(currentTasks, positionOfTask, currentIdTask) {
  let maxNumberOfDisplayedContacts = 4;
  let numberOfAssignedContacts = currentTasks[positionOfTask]["assignedContacts"].length;
  let numberOfRemainigContacts = numberOfAssignedContacts - maxNumberOfDisplayedContacts;

  if (
    numberOfAssignedContacts <= maxNumberOfDisplayedContacts && numberOfAssignedContacts > 0
  ) {
    for (let u = 0; u < numberOfAssignedContacts; u++) {
      await getAssignedContactsCardSmall(currentTasks, positionOfTask, currentIdTask, u);
    }
  } else if (
    numberOfAssignedContacts > maxNumberOfDisplayedContacts && numberOfAssignedContacts > 0
  ) {
    for (let u = 0; u < maxNumberOfDisplayedContacts - 1; u++) {
      await getAssignedContactsCardSmall(currentTasks, positionOfTask, currentIdTask, u);
    }
    await setOverflowContactIcon(currentIdTask, numberOfRemainigContacts);
  }
}


/**
 * This function generates the icon for a single contact assigned to task on the kanban board
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the card on the kanban board is created
 * @param {string} currentIdTask - id of the task for which the card on the kanban board is created
 * @param {number} u - element/ assigned user in the for loop for which the icon is created
 */
async function getAssignedContactsCardSmall(currentTasks, positionOfTask, currentIdTask, u) {
  let idContact = currentTasks[positionOfTask]["assignedContacts"][u]["idContact"];
  let positionContact = contacts.findIndex((id) => id["ID"] == idContact);

  document.getElementById(`ctn-card-assigned-users-small-${currentIdTask}`).innerHTML += await generateContactIconCardSmallHTML(currentIdTask, idContact);
  document.getElementById(`card-assigned-user-small-${currentIdTask}-${idContact}`).innerHTML = await contacts[positionContact]["acronymContact"];
  document.getElementById(`card-assigned-user-small-${currentIdTask}-${idContact}`).style.backgroundColor = await contacts[positionContact]["colorContact"];
}


/**
 * This function creates the element indicating the remaining assigned contacts for a task (in case of an overflow)
 *
 * @param {string} currentIdTask - id of the task for which the card on the kanban board is created
 * @param {number} numberOfRemainigContacts - number of contacts for which no icon is displayed on the small card on the kanban board
 */
async function setOverflowContactIcon(currentIdTask, numberOfRemainigContacts) {
  document.getElementById(`ctn-card-assigned-users-small-${currentIdTask}`).innerHTML += await generateContactIconCardSmallHTML(currentIdTask, "overflow");
  document.getElementById(`card-assigned-user-small-${currentIdTask}-overflow`).innerHTML = `+${numberOfRemainigContacts}`;
  document.getElementById(`card-assigned-user-small-${currentIdTask}-overflow`).style.backgroundColor = "grey";
}


/**
 * This function gets the priority currently selected of the given task and sets the corresponding image
 *
 * @param {string} idImgElement - id of the img element indicating the priority of the task
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the priority should be determinated
 */
function getSelectedPriority(idImgElement, currentTasks, positionOfTask) {
  let priorityOfTask = currentTasks[positionOfTask]["priority"];

  if (priorityOfTask == "Urgent") {
    document.getElementById(idImgElement).src ="./assets/img/prio_urgent_color.svg";
  } else if (priorityOfTask == "Medium") {
    document.getElementById(idImgElement).src ="./assets/img/prio_medium_color.svg";
  } else if (priorityOfTask == "Low") {
    document.getElementById(idImgElement).src ="./assets/img/prio_low_color.svg";
  }
}


/**
 * This function gets the subtasks of the selected task
 * If a tasks has no subtasks the section for the subtasks is not displayed at all
 *
 * @param {string} idOfElement - id of the element where the subtasks should be inserted
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task (in the array currentTasks) for which the substasks are created
 */
async function getSelectedSubtasks(idOfElement, currentTasks, positionOfTask) {
  document.getElementById(idOfElement).innerHTML = ``;
  let currentId = currentTasks[positionOfTask]["idTask"];
  let numberOfSubtasks = currentTasks[positionOfTask]["subtasks"].length;

  if (numberOfSubtasks == 0) {
    document.getElementById(`ctn-task-detail-subtasks`).classList.add("d-none");
  } else {
    for (let k = 0; k < numberOfSubtasks; k++) {
      let idOfSubtask = currentTasks[positionOfTask]["subtasks"][k]["idSubtask"];
      let titleOfSubtask = currentTasks[positionOfTask]["subtasks"][k]["titleSubtask"];

      if (currentTasks[positionOfTask]["subtasks"][k]["statusSubtask"] == "closed") {
        document.getElementById(idOfElement).innerHTML += await generateSubtasksDetailClosedHTML(currentId, idOfSubtask, titleOfSubtask);
      } else if (currentTasks[positionOfTask]["subtasks"][k]["statusSubtask"] == "open") {
        document.getElementById(idOfElement).innerHTML +=await generateSubtasksOpenDetailHTML(currentId, idOfSubtask, titleOfSubtask);
      }
    }
  }
}


/**
 * This function opens an overlay with the nested (updated) detailed view of a task - it also prevents the scrolling of content in the background
 *
 * @param {string} idTask - id of the task in the array "tasks" for which the details are opened
 */
async function openTaskDetail(idTask) {
  positionOfTask = tasks.findIndex((id) => id["idTask"] == idTask);

  document.getElementById("overlay-board").innerHTML = await generateViewTaskDetailHTML(positionOfTask, idTask);
  getSelectedCategory("task-detail-category", tasks, positionOfTask);
  getSelectedPriority("img-prio-task-detail", tasks, positionOfTask);
  checkAssignedContactsViedTaskDetail(positionOfTask);
  getSelectedSubtasks("task-detail-subtasks", tasks, positionOfTask);

  document.getElementById("overlay-board").classList.remove("d-none");
  document.getElementsByTagName("body")[0].classList.add("disable-scroll");

  document.getElementById("ctn-task-detail").classList.add("translate-x");
  setTimeout(() => {
    document.getElementById("ctn-task-detail").classList.remove("translate-x");
  }, 10);
}


/**
 * This function checks if contacts are assigned to the task for which the detailed view is opened
 * If no contacts are assigned the div-container for the assigned contacts isn't displayed else the function to create the assigned contacts is called
 *
 * @param {number} positionOfTask - position of the task (in the array tasks) for which the detailed view is displayed
 */
async function checkAssignedContactsViedTaskDetail(positionOfTask) {
  let numberOfAssignedContacts = tasks[positionOfTask]["assignedContacts"].length;

  if (numberOfAssignedContacts == 0) {
    document.getElementById(`ctn-task-detail-assigned-users`).classList.add("d-none");
  } else {
    await getAssignedContactsViewTaskDetail(positionOfTask, numberOfAssignedContacts);
  }
}


/**
 * This function calls the function to generate the HTML-Code for each assigned contact in the detailed view of a task
 *
 * @param {number} positionOfTask - position of the task (in the array tasks) for which the detailed view is displayed
 * @param {number} numberOfAssignedContacts - number of the assigned contacts for the displayed task
 */
async function getAssignedContactsViewTaskDetail(positionOfTask, numberOfAssignedContacts) {
  document.getElementById("ctn-task-detail-assigned-users-wrapper").innerHTML = "";

  for (let u = 0; u < numberOfAssignedContacts; u++) {
    let idContact = tasks[positionOfTask]["assignedContacts"][u]["idContact"];
    let positionContact = contacts.findIndex((id) => id["ID"] == idContact);

    document.getElementById("ctn-task-detail-assigned-users-wrapper").innerHTML += await generateContactViewTaskDetailHTML(positionContact, idContact);
    document.getElementById(`task-detail-assigned-user-acronym-${idContact}`).style.backgroundColor = contacts[positionContact]["colorContact"];
  }
}


/**
 * This function changes the status of a subtask when clicking on it in the detailed view of a task in the board, it also toogles the checkbox-img and saves the changes in the task array
 *  
 * @param {string} idOfTask - id of the task in the array "tasks" for which the details are currently opened
 * @param {number} idOfSubtask - id of the subtask of the opened task that is changed
 * @param {string} idOfSubtaskImgElement - id of the image of checkbox of the subtask that is changes
 */
async function changeStatusSubtask(idOfTask, idOfSubtask, idOfSubtaskImgElement) {
  let positionTask = tasks.findIndex((id) => id["idTask"] == idOfTask);
  let positionSubtask = tasks[positionTask]['subtasks'].findIndex((id) => id["idSubtask"] == idOfSubtask);
  let statusCurrentSubtask = tasks[positionTask]['subtasks'][positionSubtask]['statusSubtask'];

  if (statusCurrentSubtask == 'closed') {
    tasks[positionTask]['subtasks'][positionSubtask]['statusSubtask'] = 'open';
    document.getElementById(`${idOfSubtaskImgElement}`).src = `./assets/img/checkbox_blank_default.svg`;
  } else {
    tasks[positionTask]['subtasks'][positionSubtask]['statusSubtask'] = 'closed';
    document.getElementById(`${idOfSubtaskImgElement}`).src = `./assets/img/checkbox_checked_default.svg`;
  }
  await saveTasks();
}


/**
 * This function deletes a task, updates the array in the backend and renders the updated tasks
 *
 * @param {string} idTask - id of the task deleted
 */
async function deleteTask(idTask) {
  let positionTask = tasks.findIndex((id) => id["idTask"] == idTask);
  tasks.splice(positionTask, 1);
  await saveTasks();
  await closeTaskDetails();
}


/**
 * This function empties and closes the overlay and ensures that scrolling is possible after closing the overlay
 * It also renders the tasks to ensure the correct presentation in case of changes of the subtasks and empties the temporary needed arrays
 */
async function closeTaskDetails() {
  document.getElementById("overlay-board").classList.add("d-none");
  document.getElementsByTagName("body")[0].classList.remove("disable-scroll");
  document.getElementById("overlay-board").innerHTML = '';
  clearAssignedUsersArray();
  addedSubtasks = [];
  renderBoard(tasks);
}