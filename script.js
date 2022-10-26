// Getthing the HTML tags so we can manipulate it
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

// boolean to check if we are ready to load the images
let ready = false;
// set the image loaded at default 0
let imagesLoaded = 0;
// keep track of the total images
let totalImages = 0;
// create a photosArry and do it as a let as the data is going to change everything we do a request
let photosArray = [];

// Unsplash APiURL (we are getting the URL and passing it our API key https://unsplash.com/documentation#get-a-random-photo) 
// to help with people who have bad internet we set this to 5 so people can load it easire and we then set it to 30 once the 
// page has loaded
let imageCount = 5;
// https://unsplash.com/oauth/applications/375398
const apiKey = '6UokhOy-bIDQ5nMMSK_SFPv--wKpJ1IvO8Z9iDsL494';
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;

// Check if all images where loaded and this function will be called in each individual image
function imageLoaded() {
    // increase this by 1 with each individual picture which is loaded
    imagesLoaded++;
    // if this is true then that means our page is ready and everything is finished loading 
    if(imagesLoaded == totalImages) {
        // only wnat to hide the loader once the images have loaded for the first
        loader.hidden = true;
        // we then set the ready boolean to true
        ready = true; 
        // we then set the imagecount to 30 as we have loaded the page for the first time
        imageCount = 30

    }
}


// Helper Function to Set Attributes on Dom Elements
function setAttributes(element, attributes) {
    // going to do a for in loop to loop through each of the attributes we want to set
    for (const key in attributes) {
        // set the attribute of the specific element with the key and the attribute
        element.setAttribute(key, attributes[key]);
    }
}

// Create Elements For Links & Photos, Add to DOM (see here to understand how this works https://drive.google.com/file/d/1GYXBTG2GuAF0Wpv3AtK5bchcmP0_Hktk/view)
function displayPhotos() {
    // we need to set this always back to 0 so we can get the updated total images
    imagesLoaded = 0;
    // setting the total images and the length of the photos array
    totalImages = photosArray.length;
    // run function for each object in photosArray, each object is going to be assigned the photo variable
    photosArray.forEach((photo) => {
        // Create a blank anchor element (<a>) to link to Unsplash 
        const item = document.createElement('a');
        // set the atrributes for each item
        setAttributes(item, {
            // href is the key and photos.links.html is the attribute
            href: photo.links.html,
            target: '_blank',
        });
        // Create <img> for photo
        const img = document.createElement('img');
        // set the atrributes for each image
        setAttributes(img, {
            // src is the key and photo.urls.regular is the attribute
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.description,
        });
        // Event Listener, check when each image is finished loading if it has we call the imageLoaded function
        img.addEventListener('load', imageLoaded)
        // Put <img> inside <a>, then put both inside imageContainer Element
        // adding the image to the item
        item.appendChild(img);
        // add the item ito the image container
        imageContainer.appendChild(item);
    });
}


// Get Photos from UnsplashAPI (see here to understand how this works https://drive.google.com/file/d/1GYXBTG2GuAF0Wpv3AtK5bchcmP0_Hktk/view)
async function getPhotos() {
    // add the code into this try catch box so if there are any error we can catch them
    try {
        // getting the response from the apiURL
        const response = await fetch(apiURL);
        // converting that response from JSON to JavaScript and putting it into the photos array
        photosArray = await response.json();
        // call the function displayphotos
        displayPhotos();
    } catch(error) {
        // catch error here
    }
}

// Check to see if scrolling near bottom of page, Load More Photos
// goting to the highest possible level and adding an event listenr which targets the scroll event and then we want to call a function
// you can see how we can implement this here https://drive.google.com/file/d/1jPQnhdYxNcCz-jb4L5IOoPHMFp6qWoXt/view
window.addEventListener('scroll', () => {
    // if the hight of our browser window + how high we are at the top of the page >= hight of everything in the body (including whatever is not on the page) - 1000px
    // and we have to make sure the ready boolean is true
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        // we then set this back to false
        ready = false;
        // we will not call out getPhotos Method to load more photos
        getPhotos();
    }
});

// On Load
getPhotos();