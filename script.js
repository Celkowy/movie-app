const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9&page='

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const header = document.querySelector('header')
const videoIcon = document.querySelector('.fa-video')
const form = document.getElementById('form')
let search = document.getElementById('search')
const faSearch = document.querySelector('.fa-search')
const faDelete = document.querySelector('.fa-times')

const toTheTop = document.querySelector('.to-the-top')
let i = 1
let switcher = 0
const pagination = document.querySelector('.pagination-div-second')
const wrapper = document.querySelector('.wrapper')
const paginationPrev = document.querySelector('.pagination-div-prev')
const paginationNext = document.querySelector('.pagination-div-next')
const pageNumber = document.querySelector('.page-number')

let currentActivePage = 1
let paginationMaxValue = 10
let paginationMinValue = 1

pageNumber.textContent = currentActivePage

paginationNext.addEventListener('click', () => {
  currentActivePage++
  if (currentActivePage >= paginationMaxValue) currentActivePage = paginationMaxValue
  pageNumber.innerHTML = currentActivePage
  wrapper.innerHTML = ''
  updateCurrentActivePage()
  upload40Movies()
})

paginationPrev.addEventListener('click', () => {
  currentActivePage--
  if (currentActivePage == 0) currentActivePage = paginationMinValue
  pageNumber.innerHTML = currentActivePage
  wrapper.innerHTML = ''
  i -= 10
  if (i <= 0) i = 1
  updateCurrentActivePage()
  upload40Movies()
})

function updateCurrentActivePage() {
  if (currentActivePage == paginationMinValue) {
    paginationPrev.classList.add('hide')
  } else {
    paginationPrev.classList.remove('hide')
  }

  if (currentActivePage == paginationMaxValue) {
    paginationNext.classList.add('hide')
  } else {
    paginationNext.classList.remove('hide')
  }
}

upload40Movies()

async function upload40Movies() {
  const m1 = await getMovies(API_URL + i++)
  const m2 = await getMovies(API_URL + i++)
  appendToDOM([...m1, ...m2])
}

window.addEventListener('scroll', async e => {
  const threshold = Math.max(document.documentElement.scrollHeight - document.documentElement.clientHeight - 100, 0)
  if (switcher == 0 && i <= 5 * currentActivePage) {
    if (window.scrollY > threshold) {
      const movies = await getMovies(API_URL + i++)
      appendToDOM(movies)
    }
  }
})

async function getMovies(url) {
  const res = await fetch(url)
  const data = await res.json()
  const movies = data.results
  return movies
}

function appendToDOM(movies) {
  movies.forEach((movie, index) => {
    const { title, poster_path, vote_average, overview } = movie

    const div = document.createElement('div')
    div.setAttribute('class', 'movie')
    div.innerHTML = `
    <img src="${poster_path ? IMG_PATH + poster_path : './img/jazz.jpg'}"/>
    <div class="movie-info">
      <h2 class="title">${title}</h2>
      <h3 class="rating ${changeRatingColor(vote_average)}">${vote_average}</h3>
    </div>
    <div class="overview active">
      <div>
        <h3 class="overview-text">Overview</h3>
      </div>
      ${overview}
    </div>
    `
    wrapper.appendChild(div)

    setTimeout(() => {
      div.classList.add('animation')
    }, index * 100)
  })
}

function changeRatingColor(rate) {
  if (rate < 5) return 'red'
  else if (rate > 5 && rate < 7) return 'orange'
  else return 'green'
}

function scrollToTheTop() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

toTheTop.addEventListener('click', () => {
  scrollToTheTop()
})

window.onscroll = e => {
  if (this.oldScroll < this.scrollY) header.classList.add('hide')
  else header.classList.remove('hide')
  this.oldScroll = this.scrollY

  if (this.scrollY == 0) {
    toTheTop.classList.remove('show')
  } else {
    toTheTop.classList.add('show')
  }
}

async function searchedMovies(url) {
  wrapper.innerHTML = ''
  const res = await fetch(url)
  const data = await res.json()
  const movies = data.results
  appendToDOM(movies)
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const searchText = search.value

  if (searchText && searchText !== '') {
    switcher = 1
    paginationPrev.classList.add('hide')
    paginationNext.classList.add('hide')
    pageNumber.classList.add('hide')
    searchedMovies(SEARCH_URL + searchText)
    searchText.value = ''
  } else {
    location.reload()
  }
})

form.addEventListener('input', () => {
  let searchText = search.value

  if (searchText === '') {
    faDelete.classList.remove('show')
  } else {
    faDelete.classList.add('show')
  }
})

faDelete.addEventListener('click', () => {
  search.value = ''
  faDelete.classList.remove('show')
})

faSearch.addEventListener('click', e => {
  const searchText = search.value

  if (searchText && searchText !== '') {
    switcher = 1
    paginationPrev.classList.add('hide')
    paginationNext.classList.add('hide')
    pageNumber.classList.add('hide')
    searchedMovies(SEARCH_URL + searchText)
    searchText.value = ''
  } else {
    location.reload()
  }
})

videoIcon.addEventListener('click', () => {
  if (i < 7) {
    scrollToTheTop()
  } else {
    scrollToTheTop()
    setTimeout(() => {
      location.reload()
    }, 850)
  }
})
