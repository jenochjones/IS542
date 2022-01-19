const Scriptures = (function () {
  "use-strict";
  /*---------------------------------------------------------------------
   *                      Constants
   */
  /*---------------------------------------------------------------------
   *                      Private Variables
   */
  /*---------------------------------------------------------------------
   *                      Private Methods and Declarations
   */
  let ajax;
  let init;
  /*---------------------------------------------------------------------
   *                      Private Methods
   */
  ajax = function (url, successCallback, failureCallback) {
    let request = new XMLHttpRequest();

    request.open('GET', '/my/url', true);
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

  init = function (callback) {
    ajax("https://scriptures.byu.edu/mapscrip/model/books.php",
            data => {
              console.log("Loaded books from server");
              console.log(data);
            })
    ajax("https://scriptures.byu.edu/mapscrip/model/volumes.php",
            data => {
              console.log("Loaded volumes from server");
              console.log(data);
            })
  };
  /*---------------------------------------------------------------------
   *                      Public API
   */
  return {
    init: init,
  };
}());
