/*
 * FINAL MARZIPANO SCRIPT: Simplified and Robust for Single Transparent Equirectangular Pano (Faux-AR)
 * This version includes error handling to ensure Marzipano is ready before calling functions.
 */
'use strict';

(function () {
    var Marzipano = window.Marzipano;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    // --- 1. CONFIGURATION ---
    var PANO_CONTAINER_ID = 'pano';
    var PANO_FILE_NAME = 'transparent_garden_pano.png';

    var PANO_WIDTH_PX = 8192;
    var FACE_SIZE = 2048;
    var ROTATE_SPEED = 0.03;

    // --- 2. VIEWER INITIALIZATION AND ALPHA CHANNEL FIX ---

    // This checks if the Marzipano object is ready, which the previous script failed to do internally.
    if (!Marzipano || !Marzipano.Viewer) {
        console.error("Marzipano core library failed to load correctly.");
        // If the library is missing, we stop the script.
        return;
    }

    var panoElement = document.querySelector('#' + PANO_CONTAINER_ID);

    var viewer = new Marzipano.Viewer(panoElement, {
        stage: {
            stageParameters: {
                alpha: true // CRITICAL: FORCES WebGL transparency
            }
        }
    });

    // --- 3. SCENE CREATION (Simplified and stable) ---

    // The previous crash was happening inside this map function due to complex geometry data.
    var scenes = data.scenes.map(function (sceneData) {
        var urlPrefix = "tiles";

        // 1. Source: Use SingleImageSource for the single PNG file
        var source = Marzipano.SingleImageSource.fromString(
            urlPrefix + "/" + sceneData.id + "/" + PANO_FILE_NAME
        );

        // 2. Geometry: CRITICAL FIX. Equirectangular geometry with simple hardcoded size.
        var geometry = new Marzipano.EquirectGeometry([{ size: PANO_WIDTH_PX }]);

        // 3. View: Define the viewing limits
        var limiter = Marzipano.RectilinearView.limit.traditional(FACE_SIZE, 100 * Math.PI / 180, 120 * Math.PI / 180);
        var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

        var scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        // --- Hotspot and other code logic would go here ---

        return {
            data: sceneData,
            scene: scene,
            view: view
        };
    });

    // ... (Your remaining helper functions like switchScene, toggleAutorotate, etc., MUST be defined outside of this function but before the final call) ...
    // NOTE: If those helpers are missing, the script will break later.

    // --- 4. START THE VIEWER ---

    switchScene(scenes[0]); // Assumes the first scene in data.js is the one to load

    // ... (The helper functions must be included below this line if you placed them at the end of the file)

})();