'use strict';

/**
 * Global Variables
*/

//An array with all items for sale. USB is last because it's a special case
var allItems = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'tauntaun', 'unicorn', 'water-can', 'wine-glass', 'usb'];

//Get nessessary HTML elements
//Get the aera that encapsulates the images
var imageSpace = document.getElementById('votingImages');
imageSpace.addEventListener('click', handleVote);

//Store all image elements on the page
var allImages = [];

//The array of all items for sale
StoreItem.all = [];

//Stores all current image indices left:0 center:1 right:2
var imageIndices = [];

//Says how many idems will be displayed to the user
//Limit 1/2 the amount of items for show
var imageShown = 27;

//The number of voting rounds before the results were shown
const maxVotes = 5;
//tracks the user votes relitive to the max votes
var votes = 0;

/**
Start Object

Create object for each Image
*/
function StoreItem (name, image) {

  //Create the base variable that will be needed
  this.name = name;
  this.image = image;
  this.views = 0;
  this.clicks = 0;

  //Add self the array of all store items
  StoreItem.all.push(this);
}

/**
End Object
*/

//Random Number Genorator
//Return a random number max NOT included
function random (max) {

  return Math.floor(Math.random() * max);

}

//Sets up some basic values as well as
function setup () {

  //Make sure the number of images shown is less then half the products
  if (imageShown > (allItems.length / 2)) {

    imageShown = Math.round((allItems.length / 2) - 1);

  }

  for( var i = 0; i < imageShown; i++ ) {

    //Prepare the indices array
    imageIndices.push(null);

    //Create an img element for each product that will be shown
    var newImage = addElement('img', imageSpace);

    newImage.id = i;
    newImage.alt = i;
    allImages.push(newImage);

  }

  populateItems();

}

//Create Each Object
function populateItems () {

  //for every item add careat a new item object with name and image location
  for (var i = 0; i < allItems.length; i++) {

    //This is for the case of the USB since it's image is a gif and not jpg
    if (i === allItems.length - 1) {

      new StoreItem(allItems[i], `images/${allItems[i]}.gif`);

    } else {

      new StoreItem(allItems[i], `images/${allItems[i]}.jpg`);

    }

  }

  //Display the first set of 3 images
  loadImages();

}

//Select three indices
function loadImages () {

  //Image Shown is a global variable (default 3, no support for differenty numbers added) that is how many elements shown per round
  for (var i = 0; i < imageShown; i++) {

    //used in the do while loop to make sure the image was not used last now
    var unique = true;

    //Add an empty element to the end of the array
    imageIndices.push(null);

    do {

      unique = true;

      //Get a random index of a store idem index and store in last element
      imageIndices[imageIndices.length - 1] = random(StoreItem.all.length);

      //compare against the other indices used last round or for this one
      for (var j = 0; j < imageIndices.length - 1; j++) {

        //If used recently
        if ( imageIndices[imageIndices.length - 1] === imageIndices[j] ) {

          unique = false;

        }

      }

    } while (!unique);

  }

  //Remove the first three elements since they are from last choice round
  imageIndices.splice(0, imageShown);

  //Display all current images
  for (var i = 0; i < imageShown; i++) {

    allImages[i].src = StoreItem.all[ imageIndices[i] ].image;
    StoreItem.all[ imageIndices[i] ].views++;

  }

}

//Display results of servy
function displayResultsText () {

  imageSpace.innerHTML = '';

  var displaySpace = addElement('ul', imageSpace);

  //Add each item as a 'li' to the page
  for (var i = 0; i < StoreItem.all.length; i++) {

    var currentItem = StoreItem.all[i];

    var content = `${currentItem.name} had ${currentItem.clicks} votes and was seen ${currentItem.views} times.`;

    addElement('li', displaySpace, content);

  }

}

/**
 * Start of Table display
 */

//For when the list is to cluttered and boring (Uncomment Below)
function displayResultsTable () {

  imageSpace.innerHTML = '';

  var table = addElement('table', imageSpace);

  tableHeader (table);

  for (var i = 0; i < StoreItem.all.length; i++) {

    var currentObj = StoreItem.all[i];

    var currentRow = addElement('tr', table);

    fillBody(currentRow, currentObj);

  }

}

//Well it's what the name says...
function tableHeader (table) {

  var titleRow = addElement('tr', table);

  addElement('th', titleRow, 'Name');
  addElement('th', titleRow, 'Views');
  addElement('th', titleRow, 'Clicks');
  addElement('th', titleRow, 'Percent');
  addElement('th', titleRow, 'Preformance');

}

//The fun part of the table with unessary information
function fillBody (currentRow, currentObj) {

  var percentClick = ((currentObj.clicks / currentObj.views) * 100);
  var preformance = (percentClick * imageShown);

  addElement('td', currentRow, currentObj.name);
  addElement('td', currentRow, currentObj.views);
  addElement('td', currentRow, currentObj.clicks);

  if (currentObj.views === 0) {

    addElement('td', currentRow, 'No Data', 'veryBad');

  } else {

    addElement('td', currentRow, `${percentClick.toFixed(2)}%`);

  }

  //Yeah this function has a lot of math and stuff
  if (percentClick.toFixed(2) === (100 / imageShown).toFixed(2)) {

    addElement('td', currentRow, `${preformance.toFixed(2)}%`);

  } else if (preformance.toFixed(2) > 100) {

    addElement('td', currentRow, `+ ${preformance.toFixed(2)}%`, 'good');

  } else if (percentClick === 0.00) {

    addElement('td', currentRow, 'No Intrest In Product', 'veryBad');

  } else {

    addElement('td', currentRow, `- ${preformance.toFixed(2)}%`, 'bad');

  }
}

/**
 * End of Table display
 */

//Used to add elements to HTML
function addElement (element, parent, content = '', classTag) {

  var newElement = document.createElement(element);

  newElement.textContent = content;

  newElement.classList.add(classTag);

  parent.appendChild(newElement);

  return newElement;

}

//Gets the Vote Event and processes it
function handleVote (event) {

  event.preventDefault();

  //The source of the mystery still remains but the code is working as intended
  if (event.target !== imageSpace) {

    votes++;

    //Give the selected image a point
    var position = Number(event.target.id);
    console.log(imageIndices);
    console.log();
    var objIndice = imageIndices[ position ];

    StoreItem.all[ objIndice ].clicks++;

    //If out of votes, Clear event listener and display the results
    //Else load a new set of images
    if (votes >= maxVotes) {

      imageSpace.removeEventListener('click', handleVote);

      displayResultsText();
      // displayResultsTable();

    } else {

      loadImages();

    }

  }


}
/**
End Function Declarations
 */

//Now everything is loaded create the images items and load the first set to the page
setup();
