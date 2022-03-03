import {init, onHashChanged} from "./navigationPackage.js"
import {setUpMap, mapObj} from "./mapPackage.js";

function ready(readyListener) {
    if (document.readyState != 'loading') {
        readyListener();
    } else {
        document.addEventListener('DOMContentLoaded', readyListener);
    }
}

ready(function () {
    init(() => {
        onHashChanged(true);
    });
    setUpMap();
    window.addEventListener("hashchange", onHashChanged);
})

function showLocation (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    const zoom = Math.floor(viewAltitude / 400);
    mapObj.flyTo([latitude, longitude], 11);
};

export default showLocation;