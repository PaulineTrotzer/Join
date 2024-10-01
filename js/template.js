let imgSrc = null;

let imgTabSelected = [
  {
    "tab-summary": './assets/img/summary_white.svg',
    "tab-add-task": './assets/img/add_task_white.svg',
    "tab-board": './assets/img/board_white.svg',
    "tab-contacts": './assets/img/contacts_white.svg',
    "privacy-link": 'null',
    "policy-link": 'null'
  }]


/**
 * This function generates a user icon in the header area by reading the current-user acronym
 */
function generateUserIcon() {
  const userIcon = document.getElementById('iconUserheader');
  userIcon.textContent = currentUser.acronym;
}


/**
 * This function ensures that the currently selected tab is marked in the sidebar/ footer
 * 
 * @param {string} newTab - tab that is selected/ marked 
 */
async function changeSelectedTab(newTab) {
  await resetSelectedTab();
  document.getElementById(newTab).classList.add('tab-selected');
  let imgSrc = imgTabSelected[0][newTab];

  if (imgSrc != null && imgSrc !== 'null') {
    document.getElementById(`img-${newTab}`).src = imgSrc;
  }
}


/**
 * This function unmarks the selected tab (by iterating through all the availabe nav a - elements)
 */
async function resetSelectedTab() {
  let navElements = document.querySelectorAll('allNavElements');

  for (i = 0; i < navElements.length; i++) {
    let idOfElement = navElements[i]['id'];
    document.getElementById(idOfElement).classList.remove('tab-selected');
  }
}


/**
 * This function opens the submenu when clicking on the initials of the user in the header
 * It also opens an overlay to ensure that the submenu is closed by clicking somewhere outside of the submenu
 */
function openSubmenu() {
  document.getElementById('submenu-header').classList.remove('d-none');
  document.getElementById('overlay-submenu').classList.remove('d-none');
}


/**
* This function closes the submenu and the overlay when clicking somewhere outside of the submenu 
*/
function closeSubmenu() {
  document.getElementById('submenu-header').classList.add('d-none');
  document.getElementById('overlay-submenu').classList.add('d-none');
}


/**
 * this function logs out the current user by calling the clearLoggedInEmail function and redirecting to the login page.
 */
async function logout() {
  await clearLoggedInEmail();
  window.location.href = './index.html';
}


/**
 * This function resets the value for the currently used mail address by calling the resetRemote function.
 */
async function clearLoggedInEmail() {
  await resetRemote('loggedInEmail');
}