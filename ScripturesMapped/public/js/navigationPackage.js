import {goHome} from "./mapPackage.js";
import {ajax, encodedScripturesURLParameters, URL_BOOKS, URL_VOLUMES} from "./remoteAccess.js";
import {htmlButton, getScripturesCallback, getScripturesFailure} from "./htmlPackage.js";
import {animate, setAnimationType} from "./animationPackage.js";
/*---------------------------------------------------------------------
 *                      Private Variables
 */
let books;
let volumes;

/*---------------------------------------------------------------------
 *                      Private Methods and Declarations
 */

let bookChapterValid;
let changeHash;
let cashBooks;
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
        },
        getScripturesFailure);
    ajax(URL_VOLUMES,
        data => {
            volumes = data;
            volumesLoaded = true;

            if (booksLoaded) {
                cashBooks(callback);
            }
        },
        getScripturesFailure);
};

navigateHome = function () {
    let htmlString = "";

    $("#nav-book-btn").fadeOut(500);
    $("#nav-chap-btn").fadeOut(500);
    $("#prev-btn").fadeOut(500);
    $("#next-btn").fadeOut(500);

    location.hash = "0";

    volumes.forEach(volume => {
        htmlString += htmlButton(volume.fullName, volume.id, `${volume.id}`);
    });

    //htmlString += BOTTOM_PADDING;
    animate(htmlString);
    goHome();
};

navigateBook = function (bookId) {
    let selectedBook = books[bookId];
    let htmlString = "";
    let listChapters;

    document.getElementById("nav-book-btn").innerText = volumes[selectedBook.parentBookId - 1].fullName;
    document.getElementById("nav-book-btn").dataset.hash = volumes[selectedBook.parentBookId - 1].id;
    document.getElementById("nav-chap-btn").innerText = selectedBook.fullName;
    document.getElementById("nav-chap-btn").dataset.hash = `${volumes[selectedBook.parentBookId - 1].id}:${selectedBook.id}`;
    $("#nav-book-btn").fadeIn(500);
    $("#nav-chap-btn").fadeIn(500);
    $("#prev-btn").fadeOut(500);
    $("#next-btn").fadeOut(500);
    listChapters = function (numChapters, iterator) {
        if (iterator <= numChapters) {
            htmlString += htmlButton(`~ Chapter ${iterator}`, iterator, `${selectedBook.parentBookId}:${selectedBook.id}:${iterator}`);
            listChapters(numChapters, iterator + 1);
        }
    };


    if (selectedBook.numChapters <= 1) {
        setAnimationType("crossFade");
        navigateChapter(selectedBook.id, selectedBook.numChapters);
    } else {
        listChapters(selectedBook.numChapters, 1);
        //htmlString += BOTTOM_PADDING;
        animate(htmlString);
    }
};

navigateChapter = function (bookId, chapter) {
    let volume = volumes[books[bookId].parentBookId - 1];
    let book = books[bookId];

    ajax(encodedScripturesURLParameters(bookId,chapter), getScripturesCallback, getScripturesFailure, true);
    //document.getElementById(DIV_SCRIPTURES_NAVIGATOR).innerHTML += BOTTOM_PADDING;
    $("#prev-btn").fadeIn(500);
    $("#next-btn").fadeIn(500);
    document.getElementById("nav-book-btn").innerText = volume.fullName;
    document.getElementById("nav-book-btn").dataset.hash = `${volume.id}`;
    document.getElementById("nav-chap-btn").innerText = book.fullName;
    document.getElementById("nav-chap-btn").dataset.hash = `${volume.id}:${book.id}`;
};

navigateVolume = function (volumeId) {
    let volume = volumes[volumeId - 1];
    let allBooks = volume.books;
    let htmlString = "";

    $("#nav-book-btn").fadeIn(500);
    document.getElementById("nav-book-btn").innerText = volume.fullName;
    document.getElementById("nav-book-btn").dataset.hash = volume.id;
    $("#nav-chap-btn").fadeOut(500);
    $("#prev-btn").fadeOut(500);
    $("#next-btn").fadeOut(500);

    allBooks.forEach(book => {
        htmlString += htmlButton(book.fullName, book.id, `${book.parentBookId}:${book.id}`);
    });
    //htmlString += BOTTOM_PADDING;
    animate(htmlString);
};

nextChapter = function () {
    let newBook;
    let chapter;
    let currentHash = location.hash.slice(1).split(":");

    if (currentHash.length === 3) {
        if (Number(currentHash[2]) + 1 > books[currentHash[1]].numChapters) {
            if (books[Number(currentHash[1]) + 1] !== undefined) {
                newBook = books[Number(currentHash[1]) + 1];
                chapter = 1;
                changeHash(`${newBook.parentBookId}:${newBook.id}:${chapter}`);
            } else {
                setAnimationType("crossFade");
                navigateHome();
            }
        } else {
            changeHash(`${currentHash[0]}:${currentHash[1]}:${Number(currentHash[2]) + 1}`);
        }
    } else {
        newBook = books[Number(currentHash[1]) + 1];
        if (newBook.parentBookId !== undefined) {
            setAnimationType("slideUp");
            changeHash(`${newBook.parentBookId}:${newBook.id}`);
        } else {
            console.log("parent book id is undefined")
        }
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
                    setAnimationType("slideLeft");
                    changeHash(`${newBook.parentBookId}:${newBook.id}:${chapter}`);
                } else {
                    setAnimationType("crossFade");
                    navigateHome();
                }
            } else {
                setAnimationType("crossFade");
                navigateHome();
            }
        } else {
            setAnimationType("slideLeft");
            changeHash(`${currentHash[0]}:${currentHash[1]}:${Number(currentHash[2]) - 1}`);
        }
    } else {
        if (books[Number(currentHash[1]) - 1] !== undefined) {
            if (books[Number(currentHash[1])].parentBookId === books[Number(currentHash[1]) - 1].parentBookId) {
                newBook = books[Number(currentHash[1]) - 1];
                setAnimationType("slideUp");
                changeHash(`${newBook.parentBookId}:${newBook.id}`);
            } else {
                setAnimationType("crossFade");
                navigateHome();
            }
        } else {
            setAnimationType("crossFade");
            navigateHome();
        }
    }
};

onHashChanged = function () {
    //let animationType;
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


export {
    changeHash,
    init,
    nextChapter,
    prvChapter,
    onHashChanged
};
