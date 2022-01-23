"use strict";

const MAP_PACKAGE = (function () {
    /*---------------------------------------------------------------------
     *                      Constants
     */
    const apiKey = {
        apiKey: "AAPKde12852f06b743e0b55bc8866e23c56c7yUj8fc-" +
            "W4pk0GBxtwrCoEPW4cQI12E_PU4SOvxPMLc5pLXWgWE77dODZa3fyvLC"
    };
    /*---------------------------------------------------------------------
     *                      Private Variables
     */
    /*---------------------------------------------------------------------
     *                      Private Methods and Declarations
     */
    let createDrawingLayers;
    let createGeojosnMarker;
    let createMapMarker;
    let createWMSLayer;
    let getMarkerGeojson;
    let mapMarkerLayer;
    let geojsonMarkerLayer;
    let drawMenu;
    let initBaseMaps;
    let initMap;
    let mapObj;
    let mapDrawingMenu;
    let setUpMap;
    /*---------------------------------------------------------------------
     *                      Private Methods
     */
    createDrawingLayers = function (map) {
        if (typeof(map) !== "undefined") {
            mapMarkerLayer = L.featureGroup().addTo(map);
            geojsonMarkerLayer = L.geoJSON().addTo(map);
        }
    };

    createGeojosnMarker = function (geojsonFeature) {
        if (typeof(geojsonFeature) !== "undefined") {
            mapMarkerLayer.clearLayers();
            geojsonMarkerLayer.clearLayers();
            geojsonMarkerLayer.addData(geojsonFeature);
        }
    };

    createMapMarker = function (drawEvent) {
        console.log(mapMarkerLayer);
        console.log(geojsonMarkerLayer);
        if (drawEvent.layer !== undefined) {
            mapMarkerLayer.clearLayers();
            geojsonMarkerLayer.clearLayers();
            mapMarkerLayer.addLayer(drawEvent.layer);
        } else {
            return;
        }
    };

    createWMSLayer = function (layernameUI) {
        // , wmsURL, variable, range, style // Temporary values for testing
        let wmsURL = "https://thredds-jumbo.unidata.ucar.edu/thredds/wms/grib/NCEP/GFS/Global_0p25deg/Best";
        let variable = "Categorical_Rain_surface";
        let range = "0:5";
        let style = "boxfill/rainbow";
        ///////////////////////////////
        const proxyURL = "ADD PROXY URL HERE";
        let proxyWMSURL;
        let wmsLayer;
        let wmsTimeDimensionLayer;
        try {
            proxyWMSURL = `${proxyURL}?main_url=${encodeURIComponent(wmsURL)}`;
            wmsLayer = L.tileLayer.wms(proxyWMSURL, {
                BGCOLOR: '0x000000',
                colorscalerange: range,
                crossOrigin: true,
                dimension: 'time',
                format: 'image/png',
                layers: variable,
                transparent: true,
                styles: style,
                useCache: true
            });
            wmsTimeDimensionLayer = L.timeDimension.layer.wms(wmsLayer, {
                cacheForward: 200,
                name: `${layernameUI}_check`,
                updateTimeDimension: true,
                updateTimeDimensionMode: 'replace',
                requestTimefromCapabilities: false,
            });
            //layers_dict[`${layernameUI}_check`] = wmsTimeDimensionLayer;
            return wmsTimeDimensionLayer.addTo(mapObj);
        } catch (err) {
            console.log(err);
        }
    };

    getMarkerGeojson = function () {
        if (geojsonMarkerLayer.toGeoJSON().features.length > 0 && mapMarkerLayer.toGeoJSON().features.length <= 0) {
            return geojsonMarkerLayer.toGeoJSON();
        } else if (mapMarkerLayer.toGeoJSON().features.length > 0 && geojsonMarkerLayer.toGeoJSON().features.length <= 0) {
            return mapMarkerLayer.toGeoJSON();
        } else {
            //NOTIFY
            console.log("No Features On Map");
            return;
        }
    };

    initBaseMaps = function (map) {
        const basemapLayers = {
            "ESRI Imagery": L.esri.Vector.vectorBasemapLayer(
                "ArcGIS:Imagery:Standard", apiKey).addTo(map),
            "ESRI Imagery (Labels)": L.esri.Vector.vectorBasemapLayer(
                "ArcGIS:Imagery", apiKey),
            "ESRI Streets": L.esri.Vector.vectorBasemapLayer(
                "ArcGIS:Streets", apiKey),
            "ESRI Topographic": L.esri.Vector.vectorBasemapLayer(
                "ArcGIS:Topographic", apiKey)
        };
        L.control.layers(basemapLayers, null, {collapsed: true}).addTo(map);
    };

    initMap = function () {
        mapObj = L.map("map", {
            boxZoom: true,
            center: [0, 0],
            fullscreenControl: true,
            minZoom: 2,
            timeDimension: true,
            timeDimensionControl: true,
            timeDimensionControlOptions: {
                autoPlay: true,
                backwardButton: true,
                forwardButton: true,
                loopButton: true,
                maxSpeed: 6,
                minSpeed: 2,
                position: "bottomleft",
                speedStep: 1,
                timeSliderDragUpdate: true
            },
            zoom: 3,
            zoomSnap: 0.5
        });
        return mapObj;
    };

    mapDrawingMenu = function (map) {
        let drawControl = new L.Control.Draw({
            draw: {
                circle: false,
                polyline: false
            },
            edit: {
                edit: true,
                featureGroup: mapMarkerLayer
            }
        });
        drawControl.addTo(map);
    };

    setUpMap = function (callback) {
        initMap();
        initBaseMaps(mapObj);
        createDrawingLayers(mapObj);
        drawMenu = mapDrawingMenu(mapObj);
        mapObj.on(L.Draw.Event.CREATED, function (drawEvent) {
            createMapMarker(drawEvent);
        });

        if (typeof callback === "function") {
            callback();
        }
    };

    return {
        createMapMarker,
        createGeojosnMarker,
        createWMSLayer,
        getMarkerGeojson,
        setUpMap
    };
}());
