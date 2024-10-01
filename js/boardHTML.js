/**
 * This function generates the HTML-Code for the small cards on the kanban board
 *
 * @param {array} currentTasks - array of tasks currently selected
 * @param {number} positionOfTask - position of the task for which the card on the kanban board should be created in the array currentTasks
 * @param {string} currentIdTask - id of the task for which the card on the kanban board should be created
 * @returns - HTML-Code for one single small card/ task
 */
async function generateCardSmallHTML(
  currentTasks,
  positionOfTask,
  currentIdTask
) {
  return /*html*/ `
    <div 
    class="card-task-small" 
    id="card-task-small-${currentIdTask}" 
    draggable="true" 
    ondragstart="moveElement('${currentIdTask}')" 
    ondragend="resetCardAndBoard('${currentIdTask}')" 
    onclick="openTaskDetail('${currentIdTask}')">    
      <div class="ctn-card-category-show-more-small">
        <div class="card-category-small" id="category-task-${currentIdTask}">${currentTasks[positionOfTask]["category"]}</div>
        <div 
          class="ctn-card-show-more-small"
          id="ctn-card-show-more-small-${currentIdTask}"
          onclick="changeStatusMobile(event, '${currentTasks[positionOfTask]['statusTask']}', '${currentIdTask}')">
          <img class="icon-card-show-more-small" src="./assets/img/more_vertical_white.svg">
        </div>
        <div class="ctn-submenu-card-small d-none" id="ctn-submenu-card-small-${currentIdTask}" onclick="stopPropagation(event)"></div>
      </div>
        <div class="ctn-card-text-small">
            <div class="card-title-small" id="title-task-${currentIdTask}">${currentTasks[positionOfTask]["titleTask"]}</div>
            <div class="card-description-small" id="description-task-${currentIdTask}">${currentTasks[positionOfTask]["descriptionTask"]}</div>
        </div>

        <div class="ctn-card-subtasks-small" id="ctn-card-subtasks-small-${currentIdTask}">
            <div class="ctn-card-progress-bar-small">
                <div class="card-progress-bar-small" id="progress-task-${currentIdTask}"></div>
            </div>
            <span class="card-span-subtasks-small" id="span-subtasks-${currentIdTask}"></span>
        </div>
        
        <div class="ctn-card-user-prio-small">
            <div class="ctn-card-assigned-users-small" id="ctn-card-assigned-users-small-${currentIdTask}"></div>
        <img class="img-card-priority-small" id="img-prio-task-${currentIdTask}" src="./assets/img/prio_medium_color.svg"/>
        </div>
    </div>
    `;
}


/**
 * This function returns the HTML-Code for a single user (or dummy in case of overflow) assigned to a task on the small card on the kanban board
 *
 * @param {string} currentIdTask - id of the task for which the card on the kanban board should be created
 * @param {string} idContact - id of the contact that is assigned to the task created on the kanban board
 * @returns - HTML-Code for a single user assigned to a task on the small card on the kanban board
 */
async function generateContactIconCardSmallHTML(currentIdTask, idContact) {
  return /*html*/ `
  <div class="card-assigned-user-small" id="card-assigned-user-small-${currentIdTask}-${idContact}"></div>
  `;
}


/**
 * This function returns the HTML-Code for a single element that can be selected in the submenu to shift a task to another status
 *
 * @param {string} newStatus - status that can be chosen in camel case
 * @param {string} newStatusName - status that can be chosen in clean writing (as displayed in the submenu)
 * @returns - HTML-Code for a single element that can be selected in the submenu to shift a task to another status
 */
async function generateElementSubmenuChangeStatusCardSmallHTML(
  newStatus,
  newStatusName
) {
  return /*html*/ `
      <div 
          class="ctn-submenu-selection-card-small" 
          onclick="moveElementTo(${newStatus})">
          <img class="icon-submenu-selection-card-small" src="./assets/img/arrow-left-line.svg"> 
          ${newStatusName}
      </div>
  `;
}


/**
 * This function generates the HTML-Code for the detailed view of a single task (selected from the kanban board)
 *
 * @param {number} positionOfTask  -  position of the task (in the array tasks) for which the detailed view should be opened
 * @param {string} currentIdTask - id of the task for which the detailed view should be opened
 * @returns  - HTML-Code for the detailed view of the selected task
 */
async function generateViewTaskDetailHTML(positionOfTask, currentIdTask) {
  return /*html*/ `
    <div class="ctn-task-detail" id="ctn-task-detail" onclick="stopPropagation(event)">
        <div class="ctn-task-detail-header">
          <div class="task-detail-category" id="task-detail-category">${
            tasks[positionOfTask]["category"]
          }</div>
          <div class="ctn-task-detail-close">
            <img class="task-detail-close" src="./assets/img/close_black.svg" onclick="closeTaskDetails()">
          </div>
        </div>
        <h1>${tasks[positionOfTask]["titleTask"]}</h1>
        <div>${tasks[positionOfTask]["descriptionTask"]}</div>
        <div class="ctn-task-detail-date">
          <span class="color-bg">Due date:</span>
          <div>${new Date(tasks[positionOfTask]["dueDate"]).toLocaleDateString(
            "en-US"
          )}</div>
        </div>
        <div class="ctn-task-detail-priority">
          <span class="color-bg">Priority:</span>
          <div class="ctn-task-detail-priority-right">
            <div>${tasks[positionOfTask]["priority"]}</div>
            <img id="img-prio-task-detail" src="./assets/img/prio_medium_color.svg">
          </div>
        </div>
        <div class="ctn-task-detail-assigned-users" id="ctn-task-detail-assigned-users">
          <div class="color-bg">Assigned To:</div>
          <div class="ctn-task-detail-assigned-users-wrapper" id="ctn-task-detail-assigned-users-wrapper"></div>
        </div>

        <div class="ctn-task-detail-subtasks" id="ctn-task-detail-subtasks">
            <div class="color-bg">Subtasks</div>
            <div id="task-detail-subtasks"></div>
        </div>

        <div class="ctn-task-detail-edit-delete">
          <div class="ctn-task-detail-edit-delete-single" onmouseover="changeImgTo('img-task-detail-delete', 'delete_lb')" onmouseout="changeImgTo('img-task-detail-delete', 'delete_default')" onclick="deleteTask('${currentIdTask}')">
            <img id="img-task-detail-delete" src="./assets/img/delete_default.svg">
            <span>Delete</span>
          </div>
          <div class="task-detail-separator-edit"></div>
          <div class="ctn-task-detail-edit-delete-single" onmouseover="changeImgTo('img-task-detail-edit', 'edit_lb')" onmouseout="changeImgTo('img-task-detail-edit', 'edit_default')" onclick="openEditTask('${currentIdTask}')">
            <img id="img-task-detail-edit" src="./assets/img/edit_default.svg">
            <span>Edit</span>
          </div>
        </div>

      </div>`;
}


/**
 * This function returns the HTML-Code for a single user assigned to a task in the detailed view
 *
 * @param {number} positionContact - position of the contact (in the array contacts) which is added to the assigned users in the detailed view of a task
 * @param {string} idContact - id of the contact that is assigned to the task
 * @returns - HTML-Code for a single user assigned to a task in the detailed view
 */
async function generateContactViewTaskDetailHTML(positionContact, idContact) {
  return /*html*/ `
  <div class="ctn-task-detail-single-assigned-user">
      <div class="task-detail-assigned-user-acronym" id="task-detail-assigned-user-acronym-${idContact}">${contacts[positionContact]["acronymContact"]}</div>
      <div class="task-detail-assigned-user-name">${contacts[positionContact]["name"]}</div>
  </div>
  `;
}


/**
 * This function generates the HTML-Code for a single closed subtask within the detailed view of a task
 *
 * CHECK LATER IF MERGE WITH "generateSubtasksOpenDetailHTML" IS POSSIBLE/ MAKES SENSE
 *
 * @param {number} idOfTask - id of the task for which the detailed view is opened
 * @param {number} idOfSubtask - id of the subtask for which the HTML-Code should be created
 * @param {string} titleOfSubtask - title of the subtask for which the HTML-Code should be created
 * @returns - HTML-Code for a single closed subtask within the detailed view of a task
 */
async function generateSubtasksDetailClosedHTML(
  idOfTask,
  idOfSubtask,
  titleOfSubtask
) {
  return /*HTML*/ `
        <div class="ctn-task-detail-single-subtask" 
          id="subtask-${idOfTask}-${idOfSubtask}" 
          onclick="changeStatusSubtask('${idOfTask}', ${idOfSubtask}, 'img-subtask-${idOfTask}-${idOfSubtask}')">
        <img class="task-detail-checkbox" id="img-subtask-${idOfTask}-${idOfSubtask}" src="./assets/img/checkbox_checked_default.svg">
        <div>${titleOfSubtask}</div>
    </div>
    `;
}


/**
 * This function generates the HTML-Code for a single open subtask within the detailed view of a task
 *
 * CHECK LATER IF MERGE WITH "generateSubtasksClosedDetailHTML" IS POSSIBLE/ MAKES SENSE
 *
 * @param {number} idOfTask - id of the task for which the detailed view is opened
 * @param {number} idOfSubtask - id of the subtask for which the HTML-Code should be created
 * @param {string} titleOfSubtask - title of the subtask for which the HTML-Code should be created
 * @returns - HTML-Code for a single open subtask within the detailed view of a task
 */
async function generateSubtasksOpenDetailHTML(
  idOfTask,
  idOfSubtask,
  titleOfSubtask
) {
  return /*HTML*/ `
        <div class="ctn-task-detail-single-subtask" 
          id="subtask-${idOfTask}-${idOfSubtask}" 
          onclick="changeStatusSubtask('${idOfTask}', ${idOfSubtask}, 'img-subtask-${idOfTask}-${idOfSubtask}')">
        <img class="task-detail-checkbox" id="img-subtask-${idOfTask}-${idOfSubtask}" src="./assets/img/checkbox_blank_default.svg">
        <div>${titleOfSubtask}</div>
    </div>
    `;
}


/**
 * This function generates the HTML-Code for the edit view for the selected task
 *
 * @param {string} currentIdTask - id of the task for which the edit view is opened
 * @returns - HTML-Code for the edit view for the selected task
 */
async function generateViewEditTasklHTML(currentIdTask) {
  return /*html*/ `
  <div
        class="ctn-task-detail"
        id="ctn-edit-task-board"
        onclick="stopPropagation(event)"
      >
        <div class="ctn-task-detail-header ctn-edit-task-board-header">
          <div class="ctn-task-detail-close" onclick="closeTaskDetails()">
            <img
              class="task-detail-close"
              src="./assets/img/close_black.svg"
            />
          </div>
        </div>

        <form class="form-edit-task-board" id="form-edit-task-board" onsubmit="editTask('${currentIdTask}'); return false;">
          <span class="edit-task-subtitle">Title</span>
          <input
            type="text"
            id="edit-task-title"
            placeholder="Enter a title"
            required
            onkeyup="checkSubmission(event)"
          />

          <span class="edit-task-subtitle">Description</span>
          <textarea
            id="edit-task-description"
            rows="4"
            placeholder="Enter a description"
          ></textarea>

          <span class="edit-task-subtitle">Due Date</span>
          <input 
            type="date" 
            id="edit-task-dueDate" 
            required 
            onkeyup="checkSubmission(event)"
          />

          <span class="edit-task-subtitle">Priority</span>
          <div class="ctn-edit-task-prio-btn">
            <div
              id="urgentButton"
              class="prio-btn-neutral btn-edit-prio"
              onclick="changeButtonColorsUrgent()"
            >
              Urgent
              <img
                id="urgent-icon"
                src="./assets/img/prio_alta2.svg"
                class="urgent-icon"
              />
            </div>

            <div
              id="mediumButton"
              class="medium-btn-yellow btn-edit-prio"
              onclick="changeButtonColorsMedium()"
            >
              Medium
              <img
                id="medium-icon"
                src="./assets/img/capa_2.svg"
                class="urgent-icon"
                style="fill: #ffa800"
              />
            </div>

            <div
              id="lowButton"
              class="prio-btn-neutral btn-edit-prio"
              onclick="changeButtonColorsLow()"
            >
              Low
              <img
                id="low-icon"
                src="./assets/img/prio_low_color.svg"
                class="urgent-icon"
              />
            </div>
          </div>

          <span class="edit-task-subtitle">Assigned to</span>
          <div class="ctn-edit-task-assigned-users" id="ctn-edit-task-assigned-users">
            <div class="ctn-edit-task-select-users">
              <div
                class="edit-task-placeholder-drop-down"
                id="edit-task-placeholder-drop-down"
                onclick="openDropDownEditTask()"
              >
                Select contacts to assign
                <div class="ctn-edit-task-img-drop-down">
                  <img
                    id="edit-task-img-drop-down"
                    src="./assets/img/arrow_drop_down_down.svg"
                  />
                </div>
              </div>
              <div
                class="ctn-edit-task-search-user d-none"
                id="ctn-edit-task-search-user"
                onclick="stopPropagation(event)"
              >
                <input
                  class="edit-task-search-user"
                  id="edit-task-search-user"
                  type="text"
                />
                <div
                  class="ctn-edit-task-img-drop-down"
                  onclick="closeDropDownEditTask()"
                >
                  <img
                    id="edit-task-img-drop-down"
                    src="./assets/img/arrow_drop_down_up.svg"
                  />
                </div>
              </div>
            </div>
            <div
              class="ctn-edit-task-drop-down-user d-none"
              id="ctn-edit-task-drop-down-user"
            > 
            </div>
            <div id="checkedContactsCtn" class="checked-contacts-ctn ctn-checked-contacts-edit"></div>
          </div>

          <span class="edit-task-subtitle">Subtasks</span>

          <div class="ctn-edit-form-input-subtask" id="ctn-edit-form-input-subtask">
            <input
              id="subtaskInput"
              class="input-add-task"
              minlength="2"
              placeholder="Enter a title"
              onkeyup="checkInputSubtask(event)"
              onclick="changeInputSubtaskButtons()"
              onfocus="changeBorderColorSearchTask('ctn-edit-form-input-subtask', '#29ABE2')"
              onblur="changeBorderColorSearchTask('ctn-edit-form-input-subtask', '#a8a8a8')"
            />
            <div id="input-subtask-btn-ctn" class="ctn-edit-form-input-subtask-reset-add">
              <button type="button" id="plus-btn" class="subtask-plus-btn" onclick="changeInputSubtaskButtons()"></button>
            </div>
          </div>

          <div id="added-subtask-ctn" class="ctn-edit-task-added-subtask"></div>

          <button id="submit-btn" type="submit" class="create-task-btn btn-edit-confirm">
            Ok
            <img src="./assets/img/vector.svg" class="create-task-btn-checkmark" />
          </button>
        </form>
      </div>
  `;
}
