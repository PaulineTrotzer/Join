// HILFSFUNKTION (falls Kontakte neu geladen und initialisiert werden müssen//
async function loadContactsJSON() {
  try {
    const response = await fetch('./contacts.json');
    contacts = await response.json();
  } catch (error) {
    console.error('Fehler beim Laden der Benutzerdaten:', error);
  }
}


//HILFSFUNKTION (für Speichern der contacts-Daten im Backend)//
async function storeContacts() {
  try {
    const contactsString = JSON.stringify(contacts);

    const response = await setItem('contacts', contactsString);

    console.log('Antwort vom Backend:', response);

    if (response.status === 'success') {
      const contactsResponse = await getItem('contacts');
      const storedContacts = JSON.parse(contactsResponse.data.value);

      console.log('Gespeicherte Benutzerdaten im Backend:', storedContacts);
    } else {
      console.error('Fehler beim Speichern der Benutzerdaten im Backend:', response.message);
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Benutzerdaten im Backend:', error);
  }
}



//HILFSFUNKTION (falls Dummy-Users neu geladen und initialisiert werden müsen)//
async function loadUsersJSON() {
  try {
    const response = await fetch('./users.json');
    users = await response.json();
  } catch (error) {
    console.error('Fehler beim Laden der Benutzerdaten:', error);
  }
}

//HILFSFUNKTION (für Speichern der User-Daten im Backend)//
async function storeUsers() {
  try {
    const usersString = JSON.stringify(users);
    const response = await setItem('users', usersString);

    console.log('Antwort vom Backend:', response);

    if (response.status === 'success') {
      const usersResponse = await getItem('users');
      const storedUsers = JSON.parse(usersResponse.data.value);

      console.log('Gespeicherte Benutzerdaten im Backend:', storedUsers);
    } else {
      console.error('Fehler beim Speichern der Benutzerdaten im Backend:', response.message);
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Benutzerdaten im Backend:', error);
  }
}


//HILFSFUNKTION - für die Überprüfung des currentUsers (Vorbereitung für YOU_anzeige//
async function proofIfcurrentUserwasRendered(currentUser) {
  for (const extractedNumber of extractedContactNumbers) {
    const ctUserinContacts = contacts.find(c => c.idContact.split('-')[1] == currentUser.idContact && c.idContact.split('-')[1] == extractedNumber);
    if (ctUserinContacts) {
      await showUserIdentityText(extractedNumber, currentUser);
    }
  }
}



//Hilfsfunktion (für die AddTask Anzeige -> YOU für currentUser)//
async function showUserIdentityText(extractedContactNumber, currentUser) {
  if (currentUser.idContact == extractedContactNumber) {
    const positionOfContact = contactsSorted.findIndex(
      (contact) => contact.idContact.split('-')[1] == currentUser.idContact
    );
    // Überprüft, ob der Kontakt gefunden wurde
    if (positionOfContact !== -1) {
      // Fügt das HTML-Element zum DOM hinzu
      const targetContainer = document.getElementById(`contact-list-single-contact-identity-text-${contactsSorted[positionOfContact].nameContact}`);
      // Überprüfen, ob das Element bereits existiert
      if (targetContainer) {
        targetContainer.textContent += `   (You)`;
      }
    }
  }
}