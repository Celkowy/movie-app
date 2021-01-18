import { get } from './data.js'
import { create } from './data.js'

const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9&page='

const HIGHEST_RATED_MOVIES_URL =
  'https://api.themoviedb.org/3/discover/movie?certification_country=US&certification=R&sort_by=vote_average.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9&page='

const MOVIES_IN_THEATRES =
  'https://api.themoviedb.org/3/movie/now_playing?api_key=887087e9e6cf3d40f8aead484e46c8b9&language=en-US&page='

const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const DETAILS_INFO = 'https://api.themoviedb.org/3/movie/'

const DETAILS_INFO_REST = '?api_key=887087e9e6cf3d40f8aead484e46c8b9'

const nav = document.querySelector('nav')
const videoIcon = document.querySelector('.fa-video')
const form = document.getElementById('form')
const wrapper = document.querySelector('.wrapper')
const faSearch = document.querySelector('.fa-search')
const faDelete = document.querySelector('.cross')
const faStar = document.querySelector('.fa-star')
const theater = document.querySelector('.fa-theater-masks')
const toTheTop = document.querySelector('.to-the-top')
const paginationPrev = document.querySelector('.pagination-div-prev')
const paginationNext = document.querySelector('.pagination-div-next')
const pageNumber = document.querySelector('.page-number')
const doNotClick = document.querySelector('.do-not-click')
let search = document.getElementById('search')
const popUp = document.querySelector('.pop-up')

let i = 1
let preventFromSearching = 0
let paginationSwitcher = 0
let currentActivePage = 1
let paginationMaxValue = 1000
let paginationMinValue = 1
let searchText = ''

pageNumber.textContent = currentActivePage

const paginationReset = [videoIcon, faStar, theater].forEach((icon, index) =>
  icon.addEventListener('click', () => {
    faDelete.classList.remove('show')
    search.value = ''
    i = 1
    if (index === 0) paginationSwitcher = 0
    else if (index === 1) paginationSwitcher = 1
    else if (index === 2) paginationSwitcher = 2
    currentActivePage = 1
    pageNumber.innerHTML = currentActivePage
    updateCurrentActivePage()
  })
)

paginationNext.addEventListener('click', () => {
  currentActivePage++
  if (currentActivePage == paginationMaxValue) currentActivePage = paginationMaxValue
  pageNumber.innerHTML = currentActivePage
  wrapper.innerHTML = ''
  updateCurrentActivePage()
  switchPaginationTarget()
})

paginationPrev.addEventListener('click', () => {
  currentActivePage--
  if (currentActivePage == 0) currentActivePage = paginationMinValue
  pageNumber.innerHTML = currentActivePage
  wrapper.innerHTML = ''
  i -= 4
  if (i <= 0) i = 1
  updateCurrentActivePage()
  switchPaginationTarget()
})

upload40Movies(API_URL)

async function upload40Movies(url) {
  const m1 = await getMovies(url + i++)
  const m2 = await getMovies(url + i++)
  appendToDOM([...m1, ...m2])
}

//Append more videos on scroll
// window.addEventListener('scroll', async e => {
//   const threshold = Math.max(document.documentElement.scrollHeight - document.documentElement.clientHeight - 100, 0)
//   if (switcher == 0 && i <= 5 * currentActivePage) {
//     if (window.scrollY > threshold) {
//       const movies = await getMovies(API_URL + i++)
//       appendToDOM(movies)
//     }
//   }
// })

async function getMovies(url) {
  wrapper.innerHTML = ''
  const res = await fetch(url)
  const data = await res.json()
  const movies = data.results
  return movies
}

function appendToDOM(movies) {
  movies.forEach((movie, index) => {
    const div = document.createElement('div')
    div.setAttribute('class', 'movie')

    div.innerHTML = create(movie)

    const details = div.querySelector('.details')

    details.addEventListener('click', () => {
      doNotClick.classList.add('active')
      document.body.classList.add('block')

      const popUpInfo = document.createElement('div')
      popUpInfo.setAttribute('class', 'pop-up-info')

      popUp.classList.add('show')
      popUp.appendChild(popUpInfo)
      getMoreInfo(details, popUpInfo)
    })

    details.dataset.id = movie.id

    wrapper.appendChild(div)

    setTimeout(() => {
      div.classList.add('animation')
    }, index * 100)
  })
}

async function getMoreInfo(details, popUpInfo) {
  const res = await fetch(DETAILS_INFO + details.dataset.id + DETAILS_INFO_REST)
  const data = await res.json()
  const extraInfo = data

  popUpInfo.innerHTML = get(extraInfo)
  const back = popUpInfo.querySelector('.back')
  back.addEventListener('click', () => {
    popUp.classList.remove('show')
    popUpInfo.innerHTML = ''
    doNotClick.classList.remove('active')
    document.body.classList.remove('block')
    popUpInfo.remove()
  })
}

toTheTop.addEventListener('click', () => {
  scrollToTheTop()
})

function hideNav(e) {
  if (this.oldScroll < this.scrollY) nav.classList.add('hide')
  else nav.classList.remove('hide')
  this.oldScroll = this.scrollY

  if (this.scrollY == 0) {
    toTheTop.classList.remove('show')
  } else {
    toTheTop.classList.add('show')
  }
}

window.addEventListener('scroll', hideNav)

form.addEventListener('submit', e => {
  e.preventDefault()
  paginationSwitcher = 3
  searchText = search.value
  searchText += '&page='

  if (searchText && searchText !== '') {
    upload40Movies(SEARCH_URL + searchText)
  } else {
    wrapper.innerHTML = ''
    i = 1
    upload40Movies()
  }
})

form.addEventListener('input', () => {
  i = 1
  searchText = search.value
  if (searchText != '') preventFromSearching = 1
  else preventFromSearching = 0
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
  preventFromSearching = 0
})

faSearch.addEventListener('click', e => {
  paginationSwitcher = 3
  searchText = search.value
  searchText += '&page='
  if (preventFromSearching === 1) {
    upload40Movies(SEARCH_URL + searchText)
    preventFromSearching = 0
  }
})

videoIcon.addEventListener('click', () => {
  faDelete.classList.remove('show')
  i = 1
  upload40Movies(API_URL)
})

faStar.addEventListener('click', () => {
  upload40Movies(HIGHEST_RATED_MOVIES_URL)
})

theater.addEventListener('click', () => {
  upload40Movies(MOVIES_IN_THEATRES)
})

const switchPaginationTarget = () => {
  if (paginationSwitcher === 0) upload40Movies(API_URL)
  else if (paginationSwitcher === 1) upload40Movies(HIGHEST_RATED_MOVIES_URL)
  else if (paginationSwitcher === 2) upload40Movies(MOVIES_IN_THEATRES)
  else if (paginationSwitcher === 3) upload40Movies(SEARCH_URL + searchText)
}

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

function scrollToTheTop() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}
