/*
 * FINAL MARZIPANO SCRIPT: Simplified for Single Transparent Equirectangular Pano (Faux-AR)
 * This script bypasses the original tool's complex scene mapping logic.
 */
'use strict';

(function () {
    var Marzipano = window.Marzipano;

    // --- 1. CONFIGURATION ---
    var PANO_CONTAINER_ID = 'pano';
    var SCENE_ID = '0-greeennpano'; // CRITICAL: Must match your scene folder name
    var PANO_FILE_NAME = 'transparent_garden_pano.png';
    var PANO_WIDTH_PX = 8192;      // CRITICAL: The exact pixel width of your PNG

    var INITIAL_YAW = 0;          // Starting horizontal angle (0 = forward)
    var INITIAL_PITCH = 0;        // Starting vertical angle
    var INITIAL_FOV = 1.0;        // Field of view (zoom level)

    // --- 2. VIEWER INITIALIZATION ---

    var panoElement = document.querySelector('#' + PANO_CONTAINER_ID);

    // Initialize viewer with WebGL transparency enabled
    var viewer = new Marzipano.Viewer(panoElement, {
        stage: {
            stageParameters: {
                alpha: true // This enables the crucial WebGL transparency
            }
        }
    });

    // --- 3. SCENE DATA SETUP ---

    // Define the source as a single, non-tiled image
    var source = Marzipano.SingleImageSource.fromString(
        'tiles/' + SCENE_ID + '/' + PANO_FILE_NAME
    );

    // Define geometry as Equirectangular (Sphere), using the PNG width
    var geometry = new Marzipano.EquirectGeometry([{ size: PANO_WIDTH_PX }]);

    // Define the viewing restrictions (no complex data needed here)
    var limiter = Marzipano.RectilinearView.limit.traditional(
        PANO_WIDTH_PX / 2, // The half-width of the image
        100 * Math.PI / 180, 120 * Math.PI / 180
    );

    var view = new Marzipano.RectilinearView({ yaw: INITIAL_YAW, pitch: INITIAL_PITCH, fov: INITIAL_FOV }, limiter);

    // --- 4. CREATE AND DISPLAY SCENE ---

    var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
    });

    scene.switchTo();

    // You can add simple controls here if needed, but the viewer will load.

})();