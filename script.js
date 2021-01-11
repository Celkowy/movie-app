const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9&page='

const HIGHEST_RATED_MOVIES_URL =
  'https://api.themoviedb.org/3/discover/movie?certification_country=US&certification=R&sort_by=vote_average.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9'

const MOVIES_IN_THEATRES =
  'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2018-10-22&api_key=887087e9e6cf3d40f8aead484e46c8b9'

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const DETAILS_INFO = 'https://api.themoviedb.org/3/movie/'

const DETAILS_INFO_REST = '?api_key=887087e9e6cf3d40f8aead484e46c8b9'

const header = document.querySelector('header')
const videoIcon = document.querySelector('.fa-video')
const form = document.getElementById('form')
const wrapper = document.querySelector('.wrapper')
const faSearch = document.querySelector('.fa-search')
const faDelete = document.querySelector('.cross')
const faStart = document.querySelector('.fa-star')
const theater = document.querySelector('.fa-theater-masks')
const toTheTop = document.querySelector('.to-the-top')
const paginationDiv = document.querySelector('.pagination')
const paginationPrev = document.querySelector('.pagination-div-prev')
const paginationNext = document.querySelector('.pagination-div-next')
const pageNumber = document.querySelector('.page-number')
const doNotClick = document.querySelector('.do-not-click')
const del = document.querySelector('.delete')
let search = document.getElementById('search')
let i = 1
let switcher = 0
let currentActivePage = 1
let paginationMaxValue = 10
let paginationMinValue = 1

pageNumber.textContent = currentActivePage

paginationNext.addEventListener('click', () => {
  currentActivePage++
  if (currentActivePage == paginationMaxValue) currentActivePage = paginationMaxValue
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
      <div class="flex-me">
        <h3 class="overview-text">Overview</h3>
        <div class="details">More</div>
      </div>
      ${overview}
    </div>
    `

    const details = div.querySelector('.details')

    details.addEventListener('click', () => {
      const popUp = document.querySelector('.pop-up')
      doNotClick.classList.add('active')
      document.body.classList.add('block')
      del.addEventListener('click', () => {
        popUp.classList.remove('show')
        popUpInfo.innerHTML = ''
        doNotClick.classList.remove('active')
        document.body.classList.remove('block')
        popUpInfo.remove()
      })

      const popUpInfo = document.createElement('div')
      popUpInfo.setAttribute('class', 'pop-up-info')

      popUp.classList.add('show')
      popUp.appendChild(popUpInfo)
      getMoreInfo(details, popUpInfo)
    })

    details.dataset.id = movie.id

    details.addEventListener('click', () => {
      console.log(details.dataset.id)
      appendMoreInfo(div, movie)
    })

    wrapper.appendChild(div)

    setTimeout(() => {
      div.classList.add('animation')
    }, index * 100)
  })
}

function appendMoreInfo(div, movie) {
  // getMoreInfo(details, popUpInfo)
}

async function getMoreInfo(details, popUpInfo) {
  const res = await fetch(DETAILS_INFO + details.dataset.id + DETAILS_INFO_REST)
  const data = await res.json()
  const extraInfo = data

  const {
    adult,
    budget,
    genres,
    homepage,
    id,
    original_lanaguage,
    original_title,
    popularity,
    poster_path,
    production_companies,
    production_countries,
    relese_date,
    reveneue,
    runtime,
    spoken_language,
    tagline,
    title,
    vote_count,
  } = extraInfo

  popUpInfo.innerHTML = `
  ${original_title}
  ${title}
  <a href="https://www.themoviedb.org/movie/${id} target="_blank"">https://www.themoviedb.org/movie/${id} <a>
  ${extraInfo.production_companies.map(production_companies => production_companies.name).join('')}

  Production countries: ${production_countries.map(production_countries => production_countries.name).join('')}
  `
  // appendToDOM(movies)
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

async function getSpecificMovies(url) {
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
    getSpecificMovies(SEARCH_URL + searchText)
    searchText.value = ''
  } else {
    wrapper.innerHTML = ''
    i = 1
    upload40Movies()
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
  scrollToTheTop()
  search.focus()
  i = 1
})

faSearch.addEventListener('click', e => {
  const searchText = search.value

  if (searchText && searchText !== '') {
    paginationPrev.classList.add('hide')
    paginationNext.classList.add('hide')
    pageNumber.classList.add('hide')
    switcher = 1
    getSpecificMovies(SEARCH_URL + searchText)
    searchText.value = ''
  } else {
    refreshScreen()
  }
})

videoIcon.addEventListener('click', () => {
  search.value = ''
  faDelete.classList.remove('show')
  refreshScreen()
})

function refreshScreen() {
  paginationPrev.classList.remove('hide')
  paginationNext.classList.remove('hide')
  wrapper.innerHTML = ''
  i = 1
  location.reload()
  upload40Movies()
}

faStart.addEventListener('click', () => {
  if (window.innerWidth < 1024) paginationDiv.classList.add('resize')
  paginationPrev.classList.add('hide')
  paginationNext.classList.add('hide')
  pageNumber.classList.add('hide')
  wrapper.innerHTML = ''
  switcher = 1
  getSpecificMovies(HIGHEST_RATED_MOVIES_URL)
})

theater.addEventListener('click', () => {
  wrapper.innerHTML = ''
  if (window.innerWidth < 1024) paginationDiv.classList.add('resize')
  paginationPrev.classList.add('hide')
  paginationNext.classList.add('hide')
  pageNumber.classList.add('hide')
  switcher = 1
  getSpecificMovies(MOVIES_IN_THEATRES)
})
