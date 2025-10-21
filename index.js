/*
 * FINAL MARZIPANO SCRIPT: Simplified for Single Transparent Equirectangular Pano (Faux-AR)
 * This script bypasses the original tool's complex scene mapping logic.
 */
'use strict';

(function () {
    var Marzipano = window.Marzipano;

    // --- 1. CONFIGURATION (CHECK THESE VALUES) ---
    var PANO_CONTAINER_ID = 'pano';
    var SCENE_ID = '0-greeennpano'; // CRITICAL: Must match your scene folder name
    var PANO_FILE_NAME = 'transparent_garden_pano.png'; // CRITICAL: Must be the PNG file name
    var PANO_WIDTH_PX = 8192;      // CRITICAL: The exact pixel width of your PNG (or close to it)

    var INITIAL_YAW = 0;          // Starting horizontal angle (0 = forward)
    var INITIAL_PITCH = 0;        // Starting vertical angle
    var INITIAL_FOV = 1.0;        // Field of view (zoom level)
    var FACE_SIZE = 2048;         // A common, safe base size for the RectilinearView limiter

    // --- 2. VIEWER INITIALIZATION AND ALPHA CHANNEL FIX ---

    var panoElement = document.querySelector('#' + PANO_CONTAINER_ID);

    // Initialize viewer with WebGL transparency enabled
    var viewer = new Marzipano.Viewer(panoElement, {
        stage: {
            stageParameters: {
                alpha: true // FORCES WebGL to respect the PNG's transparency
            }
        }
    });

    // --- 3. SCENE DATA SETUP ---

    // Define the source as a single, non-tiled image
    // This looks for 'tiles/0-greeennpano/transparent_garden_pano.png'
    var urlPrefix = "tiles";
    var source = Marzipano.SingleImageSource.fromString(
        urlPrefix + "/" + SCENE_ID + "/" + PANO_FILE_NAME
    );

    // CRITICAL FIX: Define geometry as Equirectangular (Sphere), using the PNG width
    var geometry = new Marzipano.EquirectGeometry([{ size: PANO_WIDTH_PX }]);

    // Define the viewing limits using a simpler, fixed size to avoid complex data array issues
    var limiter = Marzipano.RectilinearView.limit.traditional(FACE_SIZE, 100 * Math.PI / 180, 120 * Math.PI / 180);

    var view = new Marzipano.RectilinearView({ yaw: INITIAL_YAW, pitch: INITIAL_PITCH, fov: INITIAL_FOV }, limiter);

    // --- 4. CREATE AND DISPLAY SCENE ---

    var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
    });

    scene.switchTo();

    // --- 5. Cleaned-up Mobile Mode and Deprecation Fix (Minimal Version) ---

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
        // FIX: Replaces the deprecated addListener method
        mql.addEventListener('change', setMode);
    } else {
        document.body.classList.add('desktop');
    }

})();