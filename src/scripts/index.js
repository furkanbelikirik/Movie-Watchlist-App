let movieArray = [];

async function searchMovies() {
	const search = document.getElementById("search").value;
	const searchUrl = `https://www.omdbapi.com/?s=${search}&apikey=4e3f2043`;

	try {
		const response = await fetch(searchUrl);
		const data = await response.json();
		const movieList = document.querySelector("main");
		movieList.innerHTML = "";

		if (data.Response === "True") {
			const movieDetailsPromises = data.Search.map(async (movie) => {
				const movieResponse = await fetch(
					`https://www.omdbapi.com/?t=${movie.Title}&apikey=4e3f2043`
				);
				return await movieResponse.json();
			});

			const movies = await Promise.all(movieDetailsPromises);

			movieArray = movies;

			displayMovies(movieArray, movieList);
		} else {
			movieList.innerHTML = `<div class="main-default">
										<p>Aradığınız film bulunamadı.</p>
										<p>Lütfen arama değerininizi kontrol edin.</p>
									</div>
									`;
		}
	} catch (error) {
		showAlert("Bir hata olştu." + error);
		const movieList = document.querySelector("main");
		movieList.innerHTML = `<p>Film arama sırasında bir hata oluştu. Lütfen tekrar deneyin.</p>`;
	}
}

function displayMovies(movies, movieList) {
	movieList.style.paddingTop = "40px";

	if(window.matchMedia("(max-width: 640px)").matches) {
		movieList.style.height = "auto";
	}

	const movieItems = movies
		.map((movie) => {
			return `
            <div class="movies">
                <div class="poster">
                    <img src="${movie.Poster}" alt="poster" />
                </div>
                <div class="info">
                    <div class="row">
                        <h1 class="title">${movie.Title}</h1>
                        <span class="rate">
                            <i class="fa-solid fa-star"></i>
                            <span>${movie.imdbRating}</span>
                        </span>
                    </div>
                    <div class="row">
                        <span class="min">${movie.Runtime}</span>
                        <span class="categories">${movie.Genre}</span>
                        <span class="addlist">
                            <i class="fa-solid fa-circle-plus"></i>
                            <button class="addlistButton" data-imdbid="${movie.imdbID}">Listeye Ekle</button>
                        </span>
                    </div>
                    <div class="row">
                        <p class="description">${movie.Plot}</p>
                    </div>
                </div>
            </div>
            `;
		})
		.join("");

	movieList.innerHTML = movieItems;

	document.querySelectorAll(".addlistButton").forEach((button) => {
		button.addEventListener("click", () =>
			addToWatchlist(button.dataset.imdbid)
		);
	});
}

document.getElementById("searchButton").addEventListener("click", searchMovies);

function addToWatchlist(imdbID) {
	const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
	let watchlistArray = [];
	let isMovieInWatchlist = false;
	const movie = movieArray.find((movie) => movie.imdbID === imdbID);

	watchlist.forEach((movie) => {
		if (movie.imdbID === imdbID) {
			isMovieInWatchlist = true;
		}
	});

	if (!isMovieInWatchlist) {
		watchlistArray.unshift(movie);
		if (!localStorage.getItem("watchlist")) {
			localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
		} else {
			watchlistArray = JSON.parse(localStorage.getItem("watchlist"));
			watchlistArray.unshift(movie);
			localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
		}
		showAlert("Film listeye eklendi");
	} else {
		showAlert("Bu film zaten listeye eklenmiş");
	}
}

function showAlert(message) {
	const alertMessage = document.querySelector(".alert");
	alertMessage.classList.remove("hidden");
	alertMessage.textContent = message;

	setTimeout(() => {
		alertMessage.classList.add("hidden");
	}, 2000);
}
