let map;
const Scriptures = (function () {
  "use-strict";
  /*---------------------------------------------------------------------
   *                      Constants
   */
  const BOTTOM_PADDING = "<br /><br />";
  const CLASS_BOOKS = "books";
  const CLASS_VOLUME = "volume";
  const DIV_SCRIPTURES_NAVIGATOR = "scriptures";
  const REQUEST_GET = "GET";
  const REQUEST_STATUS_OK = 200;
  const REQUEST_STATUS_ERROR = 400;
  const TAG_HEADERS = "h5";
  const URL_BASE = "https://scriptures.byu.edu/";
  const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
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
  let cashBooks;
  let htmlAnchor;
  let htmlDiv;
  let htmlElement;
  let htmlLink;
  let htmlHashLink;
  let init;
  let navigateHome;
  let onHashChanged;
  /*---------------------------------------------------------------------
   *                      Private Methods
   */
  ajax = function (url, successCallback, failureCallback) {
    let request = new XMLHttpRequest();

    request.open(REQUEST_GET, url, true);
    request.onload = function () {

      if (this.status >= REQUEST_STATUS_OK && this.status < REQUEST_STATUS_ERROR) {
        // Success!
        let data = JSON.parse(this.response);

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
  }

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
  }

  htmlAnchor = function (volume) {
    return `<a name="v${volume.id}" />`
  }

  htmlDiv = function (parameters) {
    let classString = "";
    let contentString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
      classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
      contentString = parameters.content;
    }

    if (parameters.id !== undefined) {
      idString = ` id="${parameters.id}"`;
    }

    return `<div${idString}${classString}>${contentString}</div>`
  };

  htmlElement = function (tagName, content) {
    return `<${tagName}>${content}</${tagName}>`;
  };

  htmlLink = function (parameters) {
    let classString = "";
    let contentString = "";
    let hrefString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
      classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
      contentString = parameters.content;
    }

    if (parameters.href !== undefined) {
      hrefString = ` ${parameters.href}`;
    }

    if (parameters.id !== undefined) {
      idString = ` id="${parameters.id}"`;
    }

    return `<div${idString}${classString}${hrefString}>${contentString}</div>`;
  };

  htmlHashLink = function (hashArguments, content) {
    return `<a href="javascript:void{0}" onclick="changeHash(${hashArguments})">${content}</a>`;
  }

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

  navigateHome = function (volumeId) {
    if (typeof(volumeId) === undefined) {
      document.getElementById(DIV_SCRIPTURES).innerHTML = "";
    }

  };

  onHashChanged = function () {
    let volumeId;
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
        navigateHome(volumeId);
      }
    }
  };
  /*---------------------------------------------------------------------
   *                      Public API
   */
  return {
    init: init,
    onHashChanged: onHashChanged,

  };
}());

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 31.7683, lng: 35.2137 },
    zoom: 8,
  });
}

