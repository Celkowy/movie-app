const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=887087e9e6cf3d40f8aead484e46c8b9&page=1'

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

const SEARCH_URL = 'https://api.themoviedb.org/3/search?api_key=887087e9e6cf3d40f8aead484e46c8b9&query="'

const table = []
const header = document.querySelector('header')
const toTheTop = document.querySelector('.to-the-top')

getMovies(API_URL)

async function getMovies(url) {
  const res = await fetch(url)
  const data = await res.json()
  const result = data.results
  appendToDom(result)
}

function appendToDom(result) {
  const wrapper = document.querySelector('.wrapper')
  result.forEach(element => {
    const div = document.createElement('div')
    div.setAttribute('class', 'movie')
    div.innerHTML = `
    <img src="${IMG_PATH + element.poster_path}" alt="oops something went wrong" />
        <div class="movie-info">
          <h2 class="title">${element.title}</h2>
          <h3 class="rating ${changeRatingColor(element.vote_average)}">${element.vote_average}</h3>
        </div>
        <div class="overview active">
        <div>
        <h3 class="overview-text">Overview</h3>
        </div>
        ${element.overview}
        </div>
      </div>
    `
    // div.innerHTML = element.title
    wrapper.appendChild(div)
  })
}

function changeRatingColor(rate) {
  if (rate < 5) return 'red'
  else if (rate > 5 && rate < 7) return 'orange'
  else return 'green'
}

toTheTop.addEventListener('click', () => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
})

function topFunction() {}

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
