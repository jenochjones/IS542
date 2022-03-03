const URL_BASE = "https://scriptures.byu.edu/";
const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;
const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;

let ajax;
let encodedScripturesURLParameters;

ajax = function (url, successCallback, failureCallback, skipJSONParse = false) {
    fetch(url)
    .then(function (response) {
        if (response.ok) {
            if (skipJSONParse) {
                return response.text();
            } else {
                return response.json();
            }
        }
    })
    .then(function (data) {
        successCallback(data);
    })
    .catch(function (error) {
        failureCallback(error);
    });
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

export {
    ajax,
    encodedScripturesURLParameters,
    URL_BOOKS,
    URL_VOLUMES
}