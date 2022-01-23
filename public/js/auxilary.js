"use strict";

const AUX_PACKAGE = (function () {
    /*---------------------------------------------------------------------
     *                      Constants
     */
    const REQUEST_GET = "GET";
    const REQUEST_POST = "POST";
    const REQUEST_STATUS_OK = 200;
    const REQUEST_STATUS_ERROR = 400;

    /*---------------------------------------------------------------------
     *                      Private Variables
     */
    let ajax;
    let checkCsrfSafe;
    let getCookie;
    let addDefaultBehaviorToAjax;
    /*---------------------------------------------------------------------
     *                      Private Methods and Declarations
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

    checkCsrfSafe = function (method) {
        // these HTTP methods do not require CSRF protection
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    }

    getCookie = function (name) {
        let cookie;
        let cookies;
        let cookieValue = null;
        let i;

        if (document.cookie && document.cookie !== "") {
              cookies = document.cookie.split(";");
              for (i = 0; i < cookies.length; i += 1) {
                    cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === name + "=") {
                          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                          break
                    }
              }
        }
        return cookieValue
    }

    addDefaultBehaviorToAjax = function () {
        // Add CSRF token to appropriate ajax requests
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!checkCsrfSafe(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
                }
            }
        })
    }
    /*---------------------------------------------------------------------
     *                      Private Methods
     */

    /*---------------------------------------------------------------------
     *                      Event Listeners
     */
    return {
        addDefaultBehaviorToAjax
    }
}());
