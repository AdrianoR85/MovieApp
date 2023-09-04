const tmdbKey = '93c056e32dbc0a17bc01535a04fe60b2';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const requestParams = `?api_key=${tmdbKey}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/original/'


// const urlb = 'https://api.themoviedb.org/3/discover/movie?api_key=93c056e32dbc0a17bc01535a04fe60b2'

const moviesWrapper = document.querySelector('.movies-wrapper'); 
const btnCategory = document.querySelector('.header__category');
const ulElement = document.querySelector('.genres__list');

let selectAtive = false

const getGenres = async () => {
  const response = await fetch(`${tmdbBaseUrl}/genre/movie/list${requestParams}`);
  const data = await response.json();
  return data.genres;
}

const renderGenres = async () => {
  const genres = await getGenres();
  genres.forEach(genre => {
    const li = document.createElement('li');
    li.textContent = genre.name;
    li.id = genre.id;
    ulElement.appendChild(li);
  });
}

const getMovies = async (res='') => {
  let moviesList = []
  for(let page = 1; page <= 4; page++) {
    const toFetchUrl = `${tmdbBaseUrl}/discover/movie${requestParams}&page=${page}`
    const response = await fetch(toFetchUrl);
    const data = await response.json();
    moviesList = moviesList.concat(data.results);
  }

  return moviesList
}

const getMoveByCategory = async (id) => {
  const response = await fetch(`${tmdbBaseUrl}/discover/movie${requestParams}&with_genres=${id}`);
  const data = await response.json();
  console.log(data.results);
  return data.results;

}

const renderMovies = async (id='') => {
  moviesWrapper.innerHTML = ''
  
  if(selectAtive) {
    const moviesCategoryList = await getMoveByCategory(id)
    moviesCategoryList.forEach(movie => {
      const newCard = createCard(movie.title, movie.vote_average, movie.poster_path, movie.overview)
      moviesWrapper.appendChild(newCard);
    })
    
  } else {
    const moviesList = await getMovies()
    moviesList.forEach(movie => {
      const newCard = createCard(movie.title, movie.vote_average, movie.poster_path, movie.overview)
      moviesWrapper.appendChild(newCard);
    })
  }
  
}

renderGenres()
renderMovies()


function createCard(title, average, image, overview) {
  const card = document.createElement('div');
  card.classList.add('card');

  const front = createFrontFace(title, average, image);
  const back = createBackFace(overview)

  card.appendChild(front);
  card.appendChild(back);

  return card
}

function createFrontFace(title, average, poster_path) {
  const frontFace = document.createElement('div');
  frontFace.classList.add('card__face', 'card__face--front');
  frontFace.innerHTML =  `
              <div class="image-container">
                <img src=${IMG_PATH + poster_path} alt="Poster of movie ${title}">
              </div>
              <div class="content">
                <h2>${title}</h2>
                <span>${average}</span>
              </div>
              `
  return frontFace;
}

function createBackFace(overview) {
  const backFace = document.createElement('div');
  backFace.classList.add('card__face', 'card__face--back');
  backFace.innerHTML = `
            <p class="overview">${overview}</p>
  `

  return backFace;
}

const list = []

function handleCategoryClick() {
  const genres = document.querySelector('.genres');
  genres.classList.toggle('genres--open');

  ulElement.addEventListener('click', (e) => {
    const categoryID = e.target.id
    if (categoryID !== 'all-movies') {
      renderMovies(categoryID)
      selectAtive = true;
    } else {
      renderMovies()
      selectAtive = false;
    }

  })
}

btnCategory.addEventListener('click', handleCategoryClick);