import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import GetPhotos from './getImg';

const getPhotos = new GetPhotos();

const refs = {
  sentinel: document.querySelector("#sentinel"),
  gallery: document.querySelector(".gallery"),
  input: document.querySelector("#search-form"),
  btn: document.querySelector(".load-more"),
}

function onSearch(event) {
  event.preventDefault();
  getPhotos.query = event.currentTarget.elements.searchQuery.value;

  getPhotos.resetPage();
  clearGallery();

  getPhotos.getImg().then(photos => {
    if (photos.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else { Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    renderGallery(photos.hits);
    getPhotos.incrementPage();
    // refs.btn.classList.remove('is-hidden');
    getLightbox();}
   
  }).catch(error => {
    console.log(error)
  })
    // btn.addEventListener("click", () => {
    //         getPhotos.getImg().then(photos => {
    //           const totalPages = Math.ceil(photos.totalHits / 40)+1;
              
    //             renderGallery(photos.hits);
    //           getPhotos.incrementPage();
    //           getLightbox();
    //           if (getPhotos.page > totalPages) {
    //               // refs.btn.classList.toggle('is-hidden');
    //             Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    //               }
    //          })
    //     })
}

  refs.input.addEventListener("submit", onSearch); 
   
  const onEntry = entries => {
  entries.forEach(entry => {
      if (entry.isIntersecting && getPhotos.query !== '') {
      // console.log('Пора грузить еще статьи' + Date.now());
            getPhotos.getImg().then(photos => {
              const totalPages = Math.ceil(photos.totalHits / 40)+1;
              console.log('page:', getPhotos.page);
              console.log('total Pages: ', totalPages);

                renderGallery(photos.hits);
              getPhotos.incrementPage();
              getLightbox();
              if (getPhotos.page > totalPages) {
                  // refs.btn.classList.toggle('is-hidden');
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                  }
             }).catch(error => {
               console.log(error.response.status);
               if (error.response.status === 400) {
                 Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
               }
  })
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);


function clearGallery() {
  refs.gallery.innerHTML = '';
}


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
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    }
   
function getLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });        
lightbox.on('show.simplelightbox', function (event) {
	event.preventDefault();
    
    if (event.target.nodeName !== "A") {
        return;
  }
  lightbox.refresh();
})
}
