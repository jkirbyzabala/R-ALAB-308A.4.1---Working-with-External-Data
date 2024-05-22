import axios from "axios";
import * as Carousel from "./Carousel.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");

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

// Axios interceptors for progress indication and logging
axios.interceptors.request.use(config => {
  console.log('Request started');
  document.body.style.cursor = 'progress';
  progressBar.style.width = '0%';
  return config;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log('Response received');
  document.body.style.cursor = 'default';
  return response;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

// Initial load function to retrieve and populate breed options
async function initialLoad() {
  try {
    const response = await axios.get('/breeds');
    const breeds = response.data;

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
  }
}

// Event handler for breed selection
async function handleBreedSelect() {
  const selectedBreedId = breedSelect.value;

  try {
    const response = await axios.get(`/images/search`, {
      params: {
        breed_ids: selectedBreedId,
        limit: 10
      }
    });

    const images = response.data;

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
    console.error('There was a problem with the axios operation:', error);
  }
}

// Attach the event handler to the breedSelect element
breedSelect.addEventListener('change', handleBreedSelect);

// Execute the initial load function immediately
document.addEventListener('DOMContentLoaded', initialLoad);