/*
 * FINAL MARZIPANO SCRIPT: Simplified for Single Transparent Equirectangular Pano (Faux-AR)
 * This script bypasses the original tool's complex scene mapping logic.
 */
'use strict';

(function () {
    var Marzipano = window.Marzipano;
    var screenfull = window.screenfull; // Kept for fullscreen functionality
    var data = window.APP_DATA; // Assumes your data.js exists

    // --- 1. CONFIGURATION ---
    var PANO_CONTAINER_ID = 'pano';
    var SCENE_ID = '0-greeennpano';
    var PANO_FILE_NAME = 'transparent_garden_pano.png';

    // Use a conservative yet high-res base size to define the image boundary
    var PANO_WIDTH_PX = 8192;
    var FACE_SIZE = 2048;
    var ROTATE_SPEED = 0.03;

    // --- 2. VIEWER INITIALIZATION AND ALPHA CHANNEL FIX ---

    var panoElement = document.querySelector('#' + PANO_CONTAINER_ID);

    // Initialize viewer with WebGL transparency enabled
    var viewer = new Marzipano.Viewer(panoElement, {
        stage: {
            stageParameters: {
                alpha: true // CRITICAL: FORCES WebGL to respect PNG transparency
            }
        }
    });

    // --- 3. SCENE CREATION (Simplified for Single Scene) ---

    var scenes = data.scenes.map(function (data) {
        var urlPrefix = "tiles";

        // 1. Source: Use SingleImageSource for the single PNG file
        var source = Marzipano.SingleImageSource.fromString(
            urlPrefix + "/" + data.id + "/" + PANO_FILE_NAME
        );

        // 2. Geometry: CRITICAL FIX. Equirectangular geometry, using the defined size.
        // This solves the 'loadAsset' crash by providing correct data.
        var geometry = new Marzipano.EquirectGeometry([{ size: PANO_WIDTH_PX }]);

        // 3. View Limiter: Uses a conservative face size (2048) for viewing limits
        var limiter = Marzipano.RectilinearView.limit.traditional(FACE_SIZE, 100 * Math.PI / 180, 120 * Math.PI / 180);

        var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

        var scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        // --- Hotspot Creation Logic remains here (as defined in original code) ---
        data.linkHotspots.forEach(function (hotspot) { /* ... */ });
        data.infoHotspots.forEach(function (hotspot) { /* ... */ });
        // ---

        return {
            data: data,
            scene: scene,
            view: view
        };
    });

    // --- 4. CONTROL FUNCTIONS AND START ---

    // Simplified Mobile/Desktop mode detection (Fixes MQL Deprecation)
    if (window.matchMedia) {
        var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
        var setMode = function () {
            if (mql.matches) {
                document.body.classList.remove('desktop');
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
                document.body.classList.add('desktop');
            }
        };
        setMode();
        mql.addEventListener('change', setMode); // FIX: Uses modern event listener
    } else {
        document.body.classList.add('desktop');
    }

    // Set up autorotate
    var autorotate = Marzipano.autorotate({ yawSpeed: ROTATE_SPEED, targetPitch: 0, targetFov: Math.PI / 2 });

    // (Other control functions like switchScene, toggleAutorotate, etc., remain here)

    // Display the initial scene.
    switchScene(scenes[0]); // Assumes the first scene in data.js is the one to load

    /* ... (All helper functions like switchScene, updateSceneName, createLinkHotspotElement, etc., must be included here) ... */

})();