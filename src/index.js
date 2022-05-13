import './sass/main.scss';
const axios = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const input = document.querySelector("#search-form");
const btn = document.querySelector(".load-more");
const API_KEY = "27295449-3daac49b31b72326d27830ec0";

let page = 1;
let per_page = 40;

// const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });


input.addEventListener("submit", (event) => {
    event.preventDefault();
    const { elements: { searchQuery } } = event.currentTarget;
    const result = searchQuery.value;
    
    getImg(result).then(photos => {
        const totalPages = photos.totalHits / per_page;
        if (page > totalPages) {
    alert("We're sorry, but you've reached the end of search results.");
        }
       
        
        renderGallery(photos.hits);
        page += 1;
        btn.classList.remove('is-hidden');
        btn.addEventListener("click", () => {
            
            getImg(result).then(photos => {
                const totalPages = photos.totalHits / per_page;
                if (page > totalPages) {
                    alert("We're sorry, but you've reached the end of search results.");
                }
       
                console.log(totalPages);
                renderGallery(photos.hits);
                page += 1
            })
        });
        
    
    }).catch(error => {
        // Notiflix.Notify.failure("Oops, there is no country with that name");
    console.log(error)
    })
})


async function getImg(name) {
    const params = new URLSearchParams({
        page: page,
        per_page: per_page,
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch:true,    
    });
    const response = await axios.get(`https://pixabay.com/api/?${params}&q=${encodeURIComponent(name)}`);
    const img = await response.data;
    console.log(encodeURIComponent(name));
return img}

  



function renderGallery(photos) {
    const markup = photos.map((photo) => {
        return `<a href="${photo.largeImageURL}" class="photo-card">
  <img  class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes <span class="photo_span">${photo.likes} </span> </b>
    </p>
    <p class="info-item">
      <b>Views <span class="photo_span">${photo.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class="photo_span">${photo.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class="photo_span">${photo.downloads}</span></b>
    </p>
  </div>
</a>`;
    })
    .join("");
    gallery.insertAdjacentHTML("beforeend", markup);
    }
gallery.addEventListener("click", fullImg);    


// function fullImg(event) {
//     // const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
//     event.preventDefault();
//     console.log(event.target.nodeName);
//     if (event.target.nodeName !== "IMG") {
//         return;
//     }
    
//     return lightbox;
// }
    
let lightbox = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
	// do something…
});