let currentStatus;

/**
 * This function opens the edit task form and prefilles all values and input fields with the information stored in the backend
 * 
 * @param {string} idTask  - id of the task for which the edit mode is opened
 */
async function openEditTask(idTask) {
    let positionTask = tasks.findIndex((id) => id["idTask"] == idTask);
  
    document.getElementById("overlay-board").classList.remove("d-none");
    document.getElementsByTagName("body")[0].classList.add("disable-scroll");
  
    document.getElementById('overlay-board').innerHTML = await generateViewEditTasklHTML(idTask);
    setMinDueDate('edit-task-dueDate');
    await prefillInputFields(positionTask);
    setPriorityEditTask(positionTask);
    await createDropDownUserEditTask(idTask);
    clearAssignedUsersArray();
    await updateAssignedUsers(positionTask, idTask);
    renderCheckedContacts();
    await renderSubtasksEditTask(positionTask);
    addEventListenerToEditForm();
  }
  
  
  /**
   * This function prefilles the input field title, description and due date with the information currently stored for the task that is edited
   * 
   * @param {number} positionTask - position of the task that is edited in the array "tasks"
   */
  async function prefillInputFields (positionTask) {
    document.getElementById('edit-task-title').value = tasks[positionTask]['titleTask'];
    document.getElementById('edit-task-description').value = tasks[positionTask]['descriptionTask'];
    document.getElementById('edit-task-dueDate').value= tasks[positionTask]['dueDate'].toLocaleString().substring(0,10);
  }
  
  
  /**
   * This function selects the right button based on the priority currently selected for the task that is edited
   * 
   * @param {number} positionTask - position of the task that is edited in the array "tasks"
   */
  function setPriorityEditTask (positionTask) {
    let priorityOfTask = tasks[positionTask]["priority"];
  
    if (priorityOfTask == "Urgent") {
      changeButtonColorsUrgent();
    } else if (priorityOfTask == "Medium") {
      changeButtonColorsMedium();
    } else if (priorityOfTask == "Low") {
      changeButtonColorsLow();
    }
  }
  

  /**
   * This function generates the drop down for the assigned users in the edit task view - the checkboxes are still blank after running this function
   */
    async function createDropDownUserEditTask() {
      if (currentUser.name !== 'Guest') {
        document.getElementById('ctn-edit-task-drop-down-user').innerHTML = await generateCurrentUserDropDownEditTaskHTML(0);
      }
      for (let j = 1; j < contactsSorted.length; j++) {
        document.getElementById('ctn-edit-task-drop-down-user').innerHTML += await generateContactDropDownEditTaskHTML(j);
      }
    }


    /**
   * This function checkes the checkboxes and filles the array assigned users for/ with the users assigned to the task currently edited
   * 
   * @param {number} positionTask - position of the task that is edited in the array "tasks" 
   */
    async function updateAssignedUsers (positionTask) {
      for (let i = 0; i< tasks[positionTask]['assignedContacts'].length; i++) {
        let idContact = tasks[positionTask]['assignedContacts'][i]['idContact'];
        let positionContact = contactsSorted.findIndex((id) => id['ID'] == idContact)
    
        document.getElementById(`checkbox-contact-${idContact}`).checked = true;
        document.getElementById(`checkbox-contact-${idContact}`).parentElement.classList.add('active');
  
        assignedUsers.push({ name: contactsSorted[positionContact]['name'], ID: contactsSorted[positionContact]['ID'] });
      }
    }
  
  
  /**
   * This function renders the subtasks into the edit task view and pushes the subtasks to the temporary array "addedSubtasks"
   * 
   * @param {number} positionTask - position of the task that is edited in the array "tasks"
   */
  async function renderSubtasksEditTask(positionTask) {
    document.getElementById('added-subtask-ctn').innerHTML = '';
    addedSubtasks = [];
  
    for (let i=0; i < tasks[positionTask]['subtasks'].length; i++) {
      let currentSubtask = tasks[positionTask]['subtasks'][i];
      let currentSubtaskTitle = currentSubtask['titleSubtask']
      document.getElementById('added-subtask-ctn').innerHTML += await generateSingleSubtaskHTML(i, currentSubtaskTitle);
  
      let newSubtask = {
        'idSubtask':  currentSubtask['idSubtask'],
        'titleSubtask': currentSubtask['titleSubtask'],
        'statusSubtask': currentSubtask['statusSubtask'],
    }
    addedSubtasks.push(newSubtask);
    }
  }

  
  /**
   * This function adds an event listener to the edit task form element to prevent the default behaviour of the enter key
   */
  function addEventListenerToEditForm() {
    document.getElementById('form-edit-task-board').addEventListener('keydown', function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  }
  
  
  /**
   * This function updates the values/ inputs made the in edit task form in the backend and closes the overlay
   * 
   * @param {string} idTask - id of the task that is edited
   */
  async function editTask(idTask) {
    let positionTask = tasks.findIndex((id) => id["idTask"] == idTask);
  
    let title = document.getElementById('edit-task-title').value;
    let description = document.getElementById('edit-task-description').value;
    let date = new Date(document.getElementById('edit-task-dueDate').value);
  
    tasks[positionTask]['titleTask'] = title;
    tasks[positionTask]['descriptionTask'] = description;
    tasks[positionTask]['dueDate'] = date.toJSON();
    tasks[positionTask]['priority'] = taskPrio;
    tasks[positionTask]['assignedContacts'] = assignedUsers.map(user => ({ idContact: user.ID }));
    tasks[positionTask]['subtasks'] = addedSubtasks;
  
    await saveTasks();
    slideInAnimation('pop-up-task-edit-board', 'translate-y', true);
    clearAssignedUsersArray();
    addedSubtasks = [];
    openTaskDetail(idTask);
  }
  
  
  /**
   * This function opens the drop down with the contacts in the editTask-View 
   * It also adds an event listener to the background so that the drop down is closed when clicking outside the drop down container
   */
  function openDropDownEditTask() {
    document.getElementById('ctn-edit-task-drop-down-user').classList.remove('d-none');
    document.getElementById('edit-task-placeholder-drop-down').classList.add('d-none');
    document.getElementById('ctn-edit-task-search-user').classList.remove('d-none');
    document.getElementById('ctn-edit-task-board').addEventListener("click", clickOutsideHandlerEdit);
  }


  /**
   * This function closes the drop down with the contacts when the user clicks outside the container in the edit view
   */
  function clickOutsideHandlerEdit(event) {
    let dropDownContent = document.getElementById('ctn-edit-task-assigned-users');
    if (!dropDownContent.contains(event.target)) {
      closeDropDownEditTask();
    } 
  }


  /**
   * This function closes the drop down with the contacts in the editTask-View and removes the event listener
   */
  function closeDropDownEditTask() {
    document.getElementById('ctn-edit-task-drop-down-user').classList.add('d-none');
    document.getElementById('edit-task-placeholder-drop-down').classList.remove('d-none');
    document.getElementById('ctn-edit-task-search-user').classList.add('d-none');
    document.getElementById('ctn-edit-task-board').removeEventListener("click", clickOutsideHandlerEdit);
  }
  
  
  /**
   * This function opens the overlay for adding a task when the user is on the board
   * In case of small window width the user is forwarded to the add_task.html 
   * The task is added to the status depending on which icon or button the user clicks to open the add task dialog
   * 
   * @param {string} taskStatus - status to which the task will be added after submission
   */
  function openAddTaskBoard(taskStatus) {
    currentStatus = taskStatus;
    document.getElementById('body-board').setAttribute("onresize", `checkWindowWidthAddTaskBoard()`);
    if (window.innerWidth < 785) {
      window.location.href = 'add_task.html';
      localStorage.setItem('statusTransfer', taskStatus);
    } else {
      document.getElementById('overlay-board-addTask').classList.remove('d-none');
      document.getElementsByTagName("body")[0].classList.add("disable-scroll");
      addEventListenerToAddForm();
      setMinDueDate('task-input-dueDate');
      document.getElementById('Add-Task-Form').setAttribute("onsubmit", `submitTask('${taskStatus}'); return false;`);
      document.getElementById('wrapper-add-task-board').addEventListener('click', clickOutsideHandler);
      document.getElementById('Add-Task-Form').addEventListener('click', clickOutsideHandler);
      contactsRendered = false; 
      loadAllContacts().then(() => {
        renderContacts();
      });
    }
  }
  


  /**
   * This function ensures that the add task overlay on the board is only displayed when the screen has a certain width
   * On falling below the defined width the user is forwarded to the add-task-page - the before inserted values are transferred
   */
  function checkWindowWidthAddTaskBoard() {
    if (window.innerWidth < 785) {
      localStorage.setItem('statusTransfer', currentStatus);
      window.location.href = 'add_task.html';
      transferInputAddTask();
    }
  }


  /**
   * This function saves the current inputs and selections into the local storage
   */
  function transferInputAddTask() {
      let title = document.getElementById('task-input-title').value;
      let description = document.getElementById('task-input-description').value;
      let date = new Date(document.getElementById('task-input-dueDate').value);
  
      let temporaryStorageAddTask = {
          'titleTask': title,
          'descriptionTask': description,
          'assignedContacts': assignedUsers.map(user => ({ idContact: user.ID })),
          'dueDate': date.toJSON(),
          'priority': taskPrio,
          'category': category,
          'subtasks': addedSubtasks,
      };

      let temporaryInputAddTaskAsText = JSON.stringify(temporaryStorageAddTask);
      localStorage.setItem('temporaryInputAddTask', temporaryInputAddTaskAsText);
  }


  /**
   * This function closes the overlay (containig the form for adding a task), empties the temporary needed arrays and ensures that scrolling is possible after closing the overlay
   */
  function closeAddTaskBoard() {
    document.getElementById("overlay-board-addTask").classList.add("d-none");
    document.getElementsByTagName("body")[0].classList.remove("disable-scroll");
    clearAssignedUsersArray();
    addedSubtasks = [];
    resetFormElements();
    renderCheckedContacts();
    document.getElementById('wrapper-add-task-board').removeEventListener('click', clickOutsideHandler);
    document.getElementById('Add-Task-Form').removeEventListener('click', clickOutsideHandler);
    document.getElementById('body-board').removeAttribute("onresize");
    contactsRendered = false;

  }