const omdbApiKey = "9e943177";

const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: omdbApiKey,
            s: searchTerm,
        },
    });

    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><b>Search for a movie</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
    var movies = await fetchData(e.target.value);

    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }
    dropdown.classList.add("is-active");

    resultsWrapper.innerHTML = "";

    for (let movie of movies) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        let option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = ` <img src=${imgSrc} />${movie.Title}`;

        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};

input.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelect = async (movie) => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: omdbApiKey,
            i: movie.imdbID,
        },
    });

    console.log(response.data);
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    `;
};
