const colorsContacts = [
    "#FF7A00",
    "#FF5EB3",
    "#6E52FF",
    "#9327FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
  ];

  /**
   * This function sets the background color (colorContact) of a contact to a randomly selected color from the predefined list of colors (colorsContacts).
   * 
   */
  function setBackgroundcolor() {
    const randomIndex = Math.floor(Math.random() * colorsContacts.length);
    const randomColor = colorsContacts[randomIndex];
    return randomColor;
}
