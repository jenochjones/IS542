const Scriptures = (function () {
  "use-strict";
  /*---------------------------------------------------------------------
   *                      Constants
   */
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
  let init;
  /*---------------------------------------------------------------------
   *                      Private Methods
   */
  ajax = function (url, successCallback, failureCallback) {
    let request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onload = function () {

      if (this.status >= 200 && this.status < 400) {
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

  init = function (callback) {
    let booksLoaded = false;
    let volumesLoaded = false;
    ajax("https://scriptures.byu.edu/mapscrip/model/books.php",
            data => {
              books = data;
              booksLoaded = true;
              if (volumesLoaded) {
                cashBooks(callback);
              }
            })
    ajax("https://scriptures.byu.edu/mapscrip/model/volumes.php",
            data => {
              volumes = data;
              volumesLoaded = true;
              if (booksLoaded) {
                cashBooks(callback);
              }
            })
  };
  /*---------------------------------------------------------------------
   *                      Public API
   */
  return {
    init: init,
  };
}());