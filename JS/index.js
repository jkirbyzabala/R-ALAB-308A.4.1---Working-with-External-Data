import * as Carousel from "./Carousel.js";
import axios from "axios";
import * as bootstrap from "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_3zWOx30bD3bDdYfsTFpTkO5e36ef3BR0WfdikoPPaSFk8358T7bPGhY1kjmI9b0z";

// Set default Axios configuration
axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = API_KEY;

// Progress bar update function
function updateProgress(progressEvent) {
  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  progressBar.style.width = `${percentCompleted}%`;
  console.log(progressEvent);
}

// Axios interceptors for: logging, response time, and progress indication and logging
axios.interceptors.request.use(config => {
config.metadata = { startTime: new Date() };
  console.log(`Request started at ${config.metadata.startTime}`);
  document.body.style.cursor = 'progress';
  progressBar.style.width = '0%';
  return config;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
  console.log(`Response recieved in ${duration}`);
  document.body.style.cursor = 'default';
  progressBar.style.width = '100%';
  return response;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

// Function to update progress bar based on ProgressEvent
function updateProgress(progressEvent) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(progressEvent); // Log ProgressEvent object
    // Update progress bar width
    progressBar.style.width = `${percentCompleted}%`;
  }
  
  // Attach updateProgress function to onDownloadProgress config option
  axios.interceptors.request.use(config => {
    config.onDownloadProgress = updateProgress;
    return config;
  });
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await initialLoad();
});

async function initialLoad() {
    try {
        const response = await axios.get('/breeds'); // fetch('https://api.thecatapi.com/v1/breeds', {
        const breeds = response.data;


        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
      console.error('axios operation problem', error);  
        // console.error('There was a problem with the fetch operation:', error);
    }
}

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
async function handleBreedSelect() {
    const selectedBreedId = breedSelect.value;

    try {
        const response = await axios.get(`https://api.thecatapi.com/v1/images/search`, {
          params: {
        breed_ids: selectedBreedId,
        limit: 10
      }
    });
        const images = response.data; //axios automatically parses JSON response 

        // Clear the carousel and infoDump
        Carousel.clear();
        infoDump.innerHTML = '';

        // Populate the carousel with new images
        images.forEach(image => {
            const carouselItem = Carousel.createCarouselItem(image.url, image.breeds[0]?.name || 'Cat Image', image.id);
            Carousel.appendCarousel(carouselItem);
        });

        // Populate the infoDump with breed information
        if (images.length > 0 && images[0].breeds.length > 0) {
            const breed = images[0].breeds[0];
            const breedInfo = `
                <h3>${breed.name}</h3>
                <p>${breed.description}</p>
                <p><strong>Temperament:</strong> ${breed.temperament}</p>
                <p><strong>Origin:</strong> ${breed.origin}</p>
                <p><strong>Life Span:</strong> ${breed.life_span} years</p>
            `;
            infoDump.innerHTML = breedInfo;
        }

        // Restart the carousel
        Carousel.start();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
const useAxiosApproach = true; // Set this to false to use the original approach

if (useAxiosApproach) {
  import('./axios.js');
} else {
  import('./index.js'); // Assuming original_approach.js is the original fetch implementation
}

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId, isFavourite) {
    try {
        if (isFavourite) {
          // If the image is already favourited, unfavourite it
          await axios.delete(`/favourites/${imgId}`);
          console.log(`Image ${imgID} unfavourited`);
        } else {
          // If the image is not favourited, favourite it
          await axios.post(`/favourites`, { image_id: imgID });
          console.log(`Image ${imgID} favourited`);
        }
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
// Function to get all favourites from the cat API
async function getFavourites() {
    try {
      const response = await axios.get(`/favourites`);
      const favouriteImages = response.data;
  
      // Clear the carousel
      Carousel.clear();
  
      // Display favourite images in the carousel
      favouriteImages.forEach(image => {
        const carouselItem = Carousel.createCarouselItem(image.image.url, 'Favourite Image', image.id);
        Carousel.appendCarousel(carouselItem);
      });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  }
  
  // Bind event listener to getFavouritesBtn
  getFavouritesBtn.addEventListener('click', getFavourites);
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
