import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import {searchImages} from './indexImages';

let form = document.querySelector('.search-form');
let gallery = document.querySelector('.gallery');
let loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
let dataHits = 0;

//Elimina todos los elementos de galeria para una nueva busqueda
let clearGallery = () => {
  gallery.innerHTML = '';
};

let simpleLightbox = new SimpleLightbox('.gallery a ', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

//Inserto plantilla de elementos unicos
function uploadImage(dataHits) {
  console.log("hola",dataHits)

  let dataImages = dataHits.hits
    .map(hit => {
 //     console.log("Muestro likes", hit.likes)
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}" rel="noopener noreferrer">

      <img class=gallery__image"" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
      </a>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', dataImages);
   // Inicializar SimpleLightbox para las imágenes en la galería
   const lightbox = new SimpleLightbox('.gallery__item');
   lightbox.refresh();
}

async function searchSubmit(event) {
  event.preventDefault();
  console.log("llamado")
  clearGallery();
  loadMoreBtn.classList.remove('hidden'); //Elimina al iniciar la busqueda

  try {
    let searchQuery = event.currentTarget.searchQuery.value;

    if(searchQuery === ''){
      return;
    }

    // codigo llamar la indeximages
    let resultImport = await searchImages(searchQuery, page);
    dataHits = resultImport;
    console.log("Prueba de import async", dataHits.totalHits);
    let totalHits = dataHits.totalHits
    console.log(totalHits)

    uploadImage(dataHits)

    if(totalHits === 0){
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      clearGallery();
      loadMoreBtn.classList.remove('hidden');
    }

    if(totalHits > 0){
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (totalHits > 40) {
      loadMoreBtn.classList.remove('hidden');
    } else  {
      loadMoreBtn.classList.add('hidden');
    }

  } catch {
    //Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    console.error();
  }
}



// Configuración de boton ver más

async function loadMoreImages() {
  page ++

  try {
    let resultImport = await searchImages(searchQuery, page);
    let newHits = resultImport.hits;
    dataHits.hits = [...dataHits.hits, ...newHits]; //concatena las nuevas imagenes.
    uploadImage(dataHits);

    if (dataHits.totalHits > 40 * page) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }

    const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 3,
  behavior: 'smooth',
  });
};



form.addEventListener('submit', searchSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);




