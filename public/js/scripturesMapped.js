let map;

const MAP_PACKAGE = (function () {
    "use-strict";
    let currentMarkers = [];
    let markersOnMap = [];
    /*---------------------------------------------------------------------
     *                      Private Methods and Declarations
     */
    let addMarkersToMap;
    let createAllMarkers;
    let clearMap;
    let goHome;
    let removeDuplicateMarkers;

    addMarkersToMap = function () {
        if (currentMarkers[0] !== undefined) {
            let bounds = new google.maps.LatLngBounds();

            clearMap();
            currentMarkers.forEach(marker => {
                let mapMarker = new google.maps.Marker({
                    label: {
                        text: marker.title,
                        fontFamily: "Comic Sans MS",
                        fontSize: "20px",
                        className: "marker-position"
                    },
                    map,
                    optimized: false,
                    position: {lat: marker.lat, lng: marker.lng}
                });

                markersOnMap.push(mapMarker);
                bounds.extend({lat: marker.lat, lng: marker.lng});
            });
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);

            if (currentMarkers.length === 1) {
                map.setZoom(15);
            }

        } else {
            goHome();
        }
    };

    clearMap = function () {
        markersOnMap.forEach(marker => {
            marker.setMap(null);
        });
    };

    createAllMarkers = function () {
        currentMarkers = [];

        document.querySelectorAll("a[onclick^=\"showLocation(\"]").forEach(function (element) {
            let matches = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/.exec(element.getAttribute("onclick"));

            currentMarkers.push({
                lat:parseFloat(matches[3]),
                lng:parseFloat(matches[4]),
                title:matches[2],
                zoom:matches[9]
            });
            console.log(matches[9])
        });
        removeDuplicateMarkers();
        addMarkersToMap();
    };

    goHome = function () {
        clearMap();
        map.setCenter({lat: 31.7683, lng: 35.2137});
        map.setZoom(8);
    };

    removeDuplicateMarkers = function () {
        let sortedMarkers = [currentMarkers[0]];

        currentMarkers.forEach(marker2 => {
            let addToArray = true;
            sortedMarkers.forEach(marker => {
                if (Math.abs(marker.lat - marker2.lat) <= 0.0001  && Math.abs(marker.lng - marker2.lng) <= 0.0001) {

                    if ( ! marker.title.includes(marker2.title)) {
                            marker.title = `${marker.title} / ${marker2.title}`;
                        }

                    addToArray = false;
                }
            });
            if (addToArray) {
                sortedMarkers.push(marker2);
            }
        });
        currentMarkers = sortedMarkers;
    };

    return {
        createAllMarkers,
        goHome
    };
}());


const Scriptures = (function () {
    "use-strict";
    /*---------------------------------------------------------------------
     *                      Constants
     */
    const BOTTOM_PADDING = "<br /><br />";
    const DIV_SCRIPTURES_NAVIGATOR = "navigator";
    const REQUEST_GET = "GET";
    const REQUEST_STATUS_OK = 200;
    const REQUEST_STATUS_ERROR = 400;
    const URL_BASE = "https://scriptures.byu.edu/";
    const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
    const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;
    const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;
    /*---------------------------------------------------------------------
     *                      Private Variables
     */
    let books;
    let volumes;

    /*---------------------------------------------------------------------
     *                      Private Methods and Declarations
     */
    let ajax;
    let bookChapterValid;
    let changeHash;
    let cashBooks;
    let encodedScripturesURLParameters;
    let getScripturesCallback;
    let getScripturesFailure;
    let htmlButton;
    let init;
    let navigateHome;
    let navigateBook;
    let navigateChapter;
    let navigateVolume;
    let nextChapter;
    let onHashChanged;
    let prvChapter;
    /*---------------------------------------------------------------------
     *                      Private Methods
     */

    ajax = function (url, successCallback, failureCallback, skipJSONParse = false) {
        let request = new XMLHttpRequest();

        request.open(REQUEST_GET, url, true);
        request.onload = function () {

            if (this.status >= REQUEST_STATUS_OK && this.status < REQUEST_STATUS_ERROR) {
                // Success!

                let data = (skipJSONParse ?
                    this.response :
                    JSON.parse(this.response)
                );

                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            } else {
                if (typeof failureCallback === "function") {
                    failureCallback(request);
                }
            }
        };

        request.onerror = failureCallback;
        request.send();
    };

    changeHash = function (newHash) {
        location.hash = newHash;
    };

    cashBooks = function (callback) {
        volumes.forEach(volume => {
            let volumeBooks = [];
            let bookId = volume.minBookId;

            while (bookId <= volume.maxBookId) {
                volumeBooks.push(books[bookId]);
                bookId += 1;
            }
            volume.books = volumeBooks;
        });
        if (typeof callback === "function") {
            callback();
        }
    };

    bookChapterValid = function (bookId, chapter) {
        let book = books[bookId];

        if (book === undefined || chapter < 0 || chapter > book.numChapters) {
            return false;
        }

        if (chapter === 0 && book.numChapters > 0) {
            return false;
        }

        return true;
    };


    encodedScripturesURLParameters = function (bookId, chapter, verses, isJST) {
        if (bookId !== undefined && chapter !== undefined) {
            let options = "";

            if (verses !== undefined) {
                options += verses;
            }

            if (isJST !== undefined) {
                options += "&jst=JST";
            }

            return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses${options}`;
        }
    };

    getScripturesCallback = function (chapterHTML) {
        document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML = chapterHTML;
        MAP_PACKAGE.createAllMarkers();
    };

    getScripturesFailure = function () {
        document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML = "Unable to retrieve chapter contents";
    };

    htmlButton = function (content, id, btnclass, hash) {
        return `<div class="nav-div"><button id="${id}" class="${btnclass}" onclick="Scriptures.changeHash(${hash})">${content}</button></div>`;
    };

    init = function (callback) {
        let booksLoaded = false;
        let volumesLoaded = false;
        ajax(URL_BOOKS,
            data => {
                books = data;
                booksLoaded = true;

                if (volumesLoaded) {
                    cashBooks(callback);
                }
            });
        ajax(URL_VOLUMES,
            data => {
                volumes = data;
                volumesLoaded = true;

                if (booksLoaded) {
                    cashBooks(callback);
                }
            });
    };

    navigateHome = function () {
        let htmlString = "";

        document.getElementById("nav-book-btn").style.display = "none";
        document.getElementById("nav-chap-btn").style.display = "none";
        document.getElementById("prev-btn").style.display = "none";
        document.getElementById("next-btn").style.display = "none";

        location.hash = 0;

        volumes.forEach(volume => {
            htmlString += htmlButton(volume.fullName, volume.id, "volume-btn", `${volume.id}`);
        });

        htmlString += BOTTOM_PADDING;
        document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML = htmlString;

        MAP_PACKAGE.goHome();
    };

    navigateBook = function (bookId) {
        let selectedBook = books[bookId];
        let htmlString = "";
        let listChapters;

        document.getElementById("nav-book-btn").style.display = "block";
        document.getElementById("nav-book-btn").innerText = volumes[selectedBook.parentBookId - 1].fullName;
        document.getElementById("nav-book-btn").dataset.hash = volumes[selectedBook.parentBookId - 1].id;
        document.getElementById("nav-chap-btn").style.display = "block";
        document.getElementById("nav-chap-btn").innerText = selectedBook.fullName;
        document.getElementById("nav-chap-btn").dataset.hash = `${volumes[selectedBook.parentBookId - 1].id}:${selectedBook.id}`;
        document.getElementById("prev-btn").style.display = "none";
        document.getElementById("next-btn").style.display = "none";

        listChapters = function (numChapters, iterator) {
            if (iterator <= numChapters) {
                htmlString += htmlButton(`~ Chapter ${iterator}`, iterator, "chapter-btn", `'${selectedBook.parentBookId}:${selectedBook.id}:${iterator}'`);
                listChapters(numChapters, iterator + 1);
            }
        };


        if (selectedBook.numChapters <= 1) {
            navigateChapter(selectedBook.id, selectedBook.numChapters);
        } else {
            listChapters(selectedBook.numChapters, 1);
            htmlString += BOTTOM_PADDING;
            document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML = htmlString;
        }
    };

    navigateChapter = function (bookId, chapter) {
        let volume = volumes[books[bookId].parentBookId - 1];
        let book = books[bookId];

        ajax(encodedScripturesURLParameters(bookId,chapter), getScripturesCallback, getScripturesFailure, true);
        document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML += BOTTOM_PADDING;
        document.getElementById("prev-btn").style.display = "block";
        document.getElementById("next-btn").style.display = "block";
        document.getElementById("nav-book-btn").innerText = volume.fullName;
        document.getElementById("nav-book-btn").dataset.hash = `${volume.id}`;
        document.getElementById("nav-chap-btn").innerText = book.fullName;
        document.getElementById("nav-chap-btn").dataset.hash = `${volume.id}:${book.id}`;
    };

    navigateVolume = function (volumeId) {
        let volume = volumes[volumeId - 1];
        let allBooks = volume.books;
        let htmlString = "";

        document.getElementById("nav-book-btn").style.display = "block";
        document.getElementById("nav-book-btn").innerText = volume.fullName;
        document.getElementById("nav-book-btn").dataset.hash = volume.id;
        document.getElementById("nav-chap-btn").style.display = "none";
        document.getElementById("prev-btn").style.display = "none";
        document.getElementById("next-btn").style.display = "none";

        allBooks.forEach(book => {
            htmlString += htmlButton(book.fullName, book.id, "book-btn", `'${book.parentBookId}:${book.id}'`);
        });

        htmlString += BOTTOM_PADDING;
        document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML = htmlString;
    };

    nextChapter = function () {
        let newBook;
        let chapter;
        let currentHash = location.hash.slice(1).split(":");

        if (currentHash.length === 3) {
            if (Number(currentHash[2]) + 1 > books[currentHash[1]].numChapters) {
                if (newBook = books[Number(currentHash[1]) + 1] !== undefined) {
                    newBook = books[Number(currentHash[1]) + 1];
                    chapter = 1;
                    changeHash(`${newBook.parentBookId}:${newBook.id}:${chapter}`);
                } else {
                    navigateHome();
                }
            } else {
                changeHash(`${currentHash[0]}:${currentHash[1]}:${Number(currentHash[2]) + 1}`);
            }
        } else {
            newBook = books[Number(currentHash[1]) + 1];
            changeHash(`${newBook.parentBookId}:${newBook.id}`);
        }
    };

    prvChapter = function () {
        let newBook;
        let chapter;
        let currentHash = location.hash.slice(1).split(":");

        if (currentHash.length === 3 && currentHash[currentHash.length - 1] !== "") {
            if (Number(currentHash[2]) - 1 <= 0) {
                if (books[Number(currentHash[1]) - 1] !== undefined) {
                    if (books[Number(currentHash[1])].parentBookId === books[Number(currentHash[1]) - 1].parentBookId) {
                        newBook = books[Number(currentHash[1]) - 1];

                        if (newBook.numChapters === 0) {
                            chapter = "";
                        } else {
                            chapter = newBook.numChapters;
                        }

                        changeHash(`${newBook.parentBookId}:${newBook.id}:${chapter}`);
                    } else {
                        navigateHome();
                    }
                } else {
                    navigateHome();
                }
            } else {
                changeHash(`${currentHash[0]}:${currentHash[1]}:${Number(currentHash[2]) - 1}`);
            }
        } else {
            if (books[Number(currentHash[1]) - 1] !== undefined) {
                if (books[Number(currentHash[1])].parentBookId === books[Number(currentHash[1]) - 1].parentBookId) {
                    newBook = books[Number(currentHash[1]) - 1];
                    changeHash(`${newBook.parentBookId}:${newBook.id}`);
                } else {
                    navigateHome();
                }
            } else {
                navigateHome();
            }
        }
    };

    onHashChanged = function () {
        let volumeId;
        let bookId;
        let chapter;
        let ids = [];

        if (location.hash !== "" && location.hash.length > 1) {
            ids = location.hash.slice(1).split(":");
        }

        if (location.hash <= 0) {
            navigateHome();
        } else if (ids.length === 1) {
            volumeId = Number(ids[0]);

            if (volumeId < volumes[0].id || volumeId > volumes.slice(-1)[0].id) {
                navigateHome();
            } else {
                navigateVolume(volumeId);
            }
        } else {
            bookId = Number(ids[1]);

            if (books[bookId] === undefined) {
                navigateHome();
            } else {
                if (ids.length === 2) {
                    navigateBook(bookId);
                } else {
                    chapter = Number(ids[2]);

                    if (bookChapterValid(bookId, chapter)) {
                        navigateChapter(bookId, chapter);
                    } else {
                        navigateHome();
                    }
                }
            }
        }
    };

    /*---------------------------------------------------------------------
     *                      Public API
     */
    return {
        changeHash,
        init,
        nextChapter,
        prvChapter,
        onHashChanged
    };
}());


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 31.7683, lng: 35.2137},
        zoom: 8,
    });
};

function showLocation(geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    map.setCenter({lat:latitude, lng:longitude});
    map.setZoom(15);
};

