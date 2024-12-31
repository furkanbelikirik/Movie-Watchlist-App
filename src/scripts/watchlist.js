window.onload = () => {
	const movieList = document.querySelector("main");
	movieList.innerHTML = "";

	const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

	if (watchlist.length === 0) {
		movieList.innerHTML = `<div class="main-default">				                
					                <p>İzleme listeniz boş gözüküyor...</p>
                                    <a href="index.html"><i class="fa-solid fa-circle-plus" style="font-size: 14px;"></i> Hadi biraz film ekleyelim!</a>
				                </div>`;
	} else {
		movieList.style.alignItems = "start";
		movieList.style.display = "block";
		movieList.style.paddingTop = "20px";
		

		const movieItems = watchlist
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
                            <i class="fa-solid fa-circle-minus"></i>
                            <button class="removelistButton" data-imdbid="${movie.imdbID}">Listeden Kaldır</button>
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

		document.querySelectorAll(".removelistButton").forEach((button) => {
			button.addEventListener("click", () =>
				removeFromWatchlist(button.dataset.imdbid)
			);
		});
	}
};

function removeFromWatchlist(imdbID) {
	const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
	const movieIndex = watchlist.findIndex((movie) => movie.imdbID === imdbID);
	watchlist.splice(movieIndex, 1);
	localStorage.setItem("watchlist", JSON.stringify(watchlist));
	showAlert("Film listeden kaldırıldı");

	setTimeout(() => {
		window.location.reload();
	}, 3000);
}

function showAlert(message) {
	const alertMessage = document.querySelector(".alert");
	alertMessage.classList.remove("hidden");
	alertMessage.textContent = message;

	setTimeout(() => {
		alertMessage.classList.add("hidden");
	}, 2000);
}
