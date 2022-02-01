const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'

export const create = function createDiv(movie) {
  const { title, poster_path, vote_average, overview } = movie

  return `
  <img src="${poster_path ? IMG_PATH + poster_path : './img/jazz-backup.jpg'}"/>
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
}

export const get = function getInfo(extraInfo) {
  const {
    adult,
    budget,
    genres,
    homepage,
    id,
    overview,
    original_title,
    popularity,
    backdrop_path,
    production_countries,
    release_date,
    revenue,
    runtime,
    tagline,
    title,
    vote_average,
    vote_count,
    poster_path,
  } = extraInfo

  return `
  <div class="more">
  
    <div class="flex-me">
      <h3 class="overview-text show-border">More information</h3>
      <div class="back">Back</div>
    </div>

    <div class="more-content">
      <div class="more-content-ui">
        <i class="fas fa-film"></i>
      <div class="content">
        <div>
          <h2>${title}</h2>
          <h3 class="thin">${original_title}</h3>
        </div>
      </div>
    </div>

    <p class="margin-top italic">${tagline}</p>

    
    <img class="margin-top resize" src="${whatPosterToDisplay(backdrop_path, poster_path)}" />

    <div class="table change-display">
      <div class="table-element first">
        <div class="value ${changeRatingColor(vote_average)}">${vote_average}</div>
        <div class="label">rate</div>
      </div>

      <div class="table-element second">
        <div class="value votes">${vote_count}</div>
        <div class="label">votes</div>
      </div>

      <div class="table-element third">
        <div class="value popularity">${popularity}</div>
        <div class="label">popularity</div>
      </div>
      
      <div class="table-element">
        <div class="value release-date">${release_date}</div>
        <div class="label">release date</div>
      </div>
    </div>

    <h3 class="overview-margin">Overview</h3>
    <div class="more-content-ui">
      <div class="content no-margin">${overview}</div>
    </div>

    <h3 class="overview-margin">Genres</h3>
    <div class="more-content-ui">
      <ul>
        ${genres.map(genre => `<li>${genre.name}</li>`).join('')}
      </ul>
    </div>

    <h3 class="overview-margin">Production countries</h3>
    <div class="more-content-ui">
      <ul class="margin-left-change">
      ${production_countries
        .map(
          country =>
            `<li class="align-vertically"><img class="flag" src="https://flagcdn.com/h20/${country.iso_3166_1.toLowerCase()}.png">${
              country.name
            }</li>`
        )
        .join('')}
      </ul>
    </div>

    <h3 class="overview-margin">Production companies</h3>
    <div class="more-content-ui">
      <ul>
        ${extraInfo.production_companies.map(production_companies => `<li>${production_companies.name}</li>`).join('')}
      </ul>
    </div>

    <div class="second table">
    <div class="table-element second-table-element">
      <div class="value red">${everyThirdDigitInsertDot(budget.toString())}</div>
      <div class="label">budget</div>
    </div>
    <div class="table-element second-table-element">
      <div class="value green">${everyThirdDigitInsertDot(revenue.toString())}</div>
      <div class="label">revenue</div>
    </div>
    </div>

    <div class="second table">
      <div class="table-element second-table-element">
        <div class="value">${changeAdultValue(adult)}</div>
        <div class="label">adult-only</div>
      </div>
      <div class="table-element second-table-element">
        <div class="value">${runtime} min</div>
        <div class="label">runtime</div>
      </div>
    </div>

    <div class="second table">
      <div class="table-element second-table-element">
        <div class="value center">
          <a class="link" href="https://www.themoviedb.org/movie/${id}" target="_blank">themoviedb</a>
        </div>
      <div class="label">tmdb</div>
    </div>

    <div class="table-element second-table-element">
      <div class="value center"><a class="link" href="${homepage}">${title}</a></div>
      <div class="label">Homepage</div>
    </div>
  </div>
`
}

const changeRatingColor = rate => {
  if (rate < 5) return 'red'
  else if (rate > 5 && rate < 7) return 'orange'
  else return 'green'
}

const changeAdultValue = adult => {
  if (adult == false) return 'no'
  else return adult
}

const everyThirdDigitInsertDot = element => {
  if (element == 0) return 'unknown'
  else return element.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const whatPosterToDisplay = (backdrop_path, poster_path) => {
  if (backdrop_path) return IMG_PATH + backdrop_path
  else if (backdrop_path == null && poster_path == null) return './img/jazz-backup.jpg'
  else return IMG_PATH + poster_path
}
