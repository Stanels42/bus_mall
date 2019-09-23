'use strict';

//Global Variables

//An array with all items for sale. USB is last because it's a special case
var allItems = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'tauntaun', 'unicorn', 'water-can', 'wine-glass', 'usb'];

//The array of all items for sale
StoreItem.all = [];

//Stores all current image indices left:0 center:1 right:2
var imageIndices = [null, null, null];

//Get nessessary HTML elements
//Get the aera that encapsulates the images
var imageSpace = document.getElementById('votingImages');
imageSpace.addEventListener('click', handleVote);

//Get each of the images
var imageLeft = document.getElementById('imageLeft');
var imageCenter = document.getElementById('imageCenter');
var imageRight = document.getElementById('imageRight');

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

//Create Each Object
function populateItems () {

  //for every item add careat a new item object with name and image location
  for (var i = 0; i < allItems.length; i++) {

    //This is for the case of the USB since it's omage is a gif
    if (i === allItems.length - 1) {

      new StoreItem(allItems[i], `images/${allItems[i]}.gif`);

    } else {

      new StoreItem(allItems[i], `images/${allItems[i]}.jpg`);

    }

  }

  newImageIndices();

}

function newImageIndices () {
  console.log('load images start ' + imageIndices);
  var max = StoreItem.all.length;

  var imgShown = 3;

  for (var i = 0; i < imgShown; i++) {

    var unique = true;

    imageIndices.push(null);
    // console.log(imageIndices);

    do {

      unique = true;

      imageIndices[imageIndices.length - 1] = random(max);

      for (var j = 0; j < imageIndices.length - 1; j++) {

        if ( imageIndices[imageIndices.length - 1] === imageIndices[j] ) {

          unique = false;

        }

      }

    } while (!unique);
    // console.log(imageIndices);
  }

  imageIndices.shift();
  imageIndices.shift();
  imageIndices.shift();

  console.log('load images end ' + imageIndices);

  loadImages();

}

function loadImages () {

  imageLeft.src = StoreItem.all[ imageIndices[0] ].image;
  imageCenter.src = StoreItem.all[ imageIndices[1] ].image;
  imageRight.src = StoreItem.all[ imageIndices[2] ].image;

  console.log('Loaded images:');
  console.log(imageLeft);
  console.log(imageCenter);
  console.log(imageRight);

}

//Gets the Vote Event and processes it
function handleVote (event) {

  console.log('Event images:');
  console.log(imageLeft);
  console.log(imageCenter);
  console.log(imageRight);
  // console.log(event.target);
  // event.preventDefault();
  // console.log('event call' + imageIndices);

  if (event.target === imageLeft || event.target === imageCenter || event.target === imageRight) {

    console.log('selected element: ', event.target);
    console.log('display event element ' + imageIndices);
    newImageIndices();

  }
  // console.log('log 2');

}

populateItems();
