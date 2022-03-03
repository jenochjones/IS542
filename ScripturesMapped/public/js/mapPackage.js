let addMarkersToMap;
let currentMarkers = [];
let createAllMarkers;
let clearMap;
let goHome;
let initBaseMaps;
let initMap;
let mapObj;
let removeDuplicateMarkers;
let setUpMap;

let markersOnMap = L.featureGroup();

addMarkersToMap = function () {
    if (currentMarkers[0] !== undefined) {
        let iconURL;
        const volume = parseInt(location.hash.slice(1).split(":")[0]);
        if (volume === 1) {
            iconURL = "../public/images/tencommandments.png"; //https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.kindpng.com%2Fimgv%2FhimmibR_ten-commandments-png-transparent-cartoons-ten-commandments-transparent%2F&psig=AOvVaw3-AuoXTOIJVHGS5M0w0PgF&ust=1646405965873000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCODTjaiaqvYCFQAAAAAdAAAAABAD
        } else if (volume === 2) {
            iconURL = "../public/images/cross.png"; //https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinclipart.com%2Fpindetail%2FhJThhR_silhouette-crosses-clipart%2F&psig=AOvVaw0x1r_wBbkXweTgWaVpPwnR&ust=1646435174405000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMiEgpKHq_YCFQAAAAAdAAAAABAD
        } else if (volume === 3) {
            iconURL = "../public/images/goldplates.png"; //https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinclipart.com%2Fpindetail%2FiiTTTRm_golden-plates-lds-lds-gold-plates-clip-art%2F&psig=AOvVaw1kSlJFyyEsb5JagRgGGe7C&ust=1646405944306000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJCFwJ6aqvYCFQAAAAAdAAAAABAD
        } else if (volume === 4) {
            iconURL = "../public/images/wagonwheel.png"; //https://www.google.com/url?sa=i&url=http%3A%2F%2Fclipart-library.com%2Fclip-art%2F63-635068_wheel-transparent-background-picture-clip-art-wagon-wheel.htm&psig=AOvVaw0PV-7uJ8Vl_g9Ihw4s2z4V&ust=1646405988712000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNC717OaqvYCFQAAAAAdAAAAABAD
        } else if (volume === 5) {
            iconURL = "../public/images/scroll.png"; //https://www.google.com/url?sa=i&url=https%3A%2F%2Fclipart.world%2Fscroll-clipart%2Fvintage-scroll-png-transparent%2F&psig=AOvVaw3GYxjMyt8jGOq21VYC8LmG&ust=1646405871797000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJiS-YCaqvYCFQAAAAAdAAAAABAD
        }

        currentMarkers.forEach(marker => {
            let myIcon = L.icon({
                iconUrl: iconURL,
                iconSize: [50, 50],
                iconAnchor: [25, 25],
                labelAnchor: [25, 25]
            });
            let mapMarker = L.marker([marker.lat, marker.lng], {
                icon: myIcon
            }).bindTooltip(marker.title, {
                permanent: true,
                className: "marker-labels",
                direction: "top"
            });

            markersOnMap.addLayer(mapMarker);
        });

        mapObj.flyToBounds(markersOnMap.getBounds());

    } else {
        goHome();
    }
};

clearMap = function () {
    markersOnMap.clearLayers()
    currentMarkers = [];
};

createAllMarkers = function () {
    clearMap();
    document.getElementById("navigator").querySelectorAll("a[onclick^=\"showLocation(\"]").forEach(function (element) {
        let matches = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/.exec(element.getAttribute("onclick"));

        currentMarkers.push({
            lat:parseFloat(matches[3]),
            lng:parseFloat(matches[4]),
            title:matches[2],
            zoom:matches[9]
        });
    });
    removeDuplicateMarkers();
    addMarkersToMap();
};

goHome = function () {
    clearMap();
    mapObj.flyTo([31.7683, 35.2137], 9);
};

initBaseMaps = function (map) {
    const basemapLayers = {
        "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}).addTo(map),
        "Esri World Streetmap": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'}),
        "Esri World Topomap": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'}),
    };
    L.control.layers(basemapLayers, null, {collapsed: true}).addTo(map);
};

initMap = function () {
    mapObj = L.map("map", {
        boxZoom: true,
        center: [0, 0],
        fullscreenControl: true,
        minZoom: 1,
        maxZoom: 14,
        zoom: 1,
        zoomSnap: 0.5
    });
    markersOnMap.addTo(mapObj);
    return mapObj;
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

setUpMap = function (callback) {
    initMap();
    initBaseMaps(mapObj);

    if (typeof callback === "function") {
        callback();
    }
};

export {
    createAllMarkers,
    goHome,
    mapObj,
    setUpMap
};