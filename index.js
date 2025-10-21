/*
 * FINAL MARZIPANO SCRIPT: Simple and Robust for Single Transparent Equirectangular Pano (Faux-AR)
 * This is the full logic including all necessary helper functions stripped for a single scene test.
 */
'use strict';

(function () {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    // --- 1. CONFIGURATION (VERIFIED AGAINST YOUR FILES) ---
    var PANO_CONTAINER_ID = 'pano';
    var PANO_FILE_NAME = 'transparent_garden_pano.png';
    var PANO_WIDTH_PX = 8192;
    var FACE_SIZE = 2048;
    var ROTATE_SPEED = 0.03;

    // Grab elements from DOM (simplified).
    var panoElement = document.querySelector('#' + PANO_CONTAINER_ID);
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneListElement = document.querySelector('#sceneList');
    var sceneElements = document.querySelectorAll('#sceneList .scene');
    var sceneListToggleElement = document.querySelector('#sceneListToggle');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');
    var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

    // Detect desktop or mobile mode (Fixes Deprecation Warning).
    if (window.matchMedia) {
        var setMode = function () {
            if (mql.matches) {
                document.body.classList.remove('desktop');
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
                document.body.classList.add('desktop');
            }
        };
        var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
        setMode();
        mql.addEventListener('change', setMode);
    } else {
        document.body.classList.add('desktop');
    }

    // Touch detection.
    document.body.classList.add('no-touch');
    window.addEventListener('touchstart', function () {
        document.body.classList.remove('no-touch');
        document.body.classList.add('touch');
    });

    // --- 2. VIEWER INITIALIZATION AND ALPHA CHANNEL FIX ---

    // Viewer options.
    var viewerOpts = { controls: { mouseViewMode: 'drag' } }; // Simplified control mode

    // Initialize viewer with WebGL transparency enabled
    var viewer = new Marzipano.Viewer(panoElement, {
        stage: {
            stageParameters: {
                alpha: true // CRITICAL: FORCES WebGL to respect PNG transparency
            }
        }
    });

    // --- 3. SCENE CREATION (Simplified and stable) ---

    // Map the scene data from data.js
    var scenes = data.scenes.map(function (sceneData) {
        var urlPrefix = "tiles";

        // CRITICAL FIX: Source must be SingleImageSource and point to the PNG
        var source = Marzipano.SingleImageSource.fromString(
            urlPrefix + "/" + sceneData.id + "/" + PANO_FILE_NAME
        );

        // CRITICAL FIX: Geometry must be EquirectGeometry with a defined size
        // This solves the 'loadAsset' crash by providing correct data structure
        var geometry = new Marzipano.EquirectGeometry([{ size: PANO_WIDTH_PX }]);

        // Define the viewing limits
        var limiter = Marzipano.RectilinearView.limit.traditional(FACE_SIZE, 100 * Math.PI / 180, 120 * Math.PI / 180);

        var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

        var scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        // --- NOTE: Hotspot and info hotspot creation loops need to be added here if desired ---
        // For this test, we skip them to guarantee the scene loads.

        return {
            data: sceneData,
            scene: scene,
            view: view
        };
    });

    // --- 4. HELPER FUNCTIONS (Minimal required set to run switchScene) ---

    function sanitize(s) { return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'); }

    function findSceneById(id) {
        for (var i = 0; i < scenes.length; i++) {
            if (scenes[i].data.id === id) {
                return scenes[i];
            }
        }
        return null;
    }
    function findSceneDataById(id) {
        for (var i = 0; i < data.scenes.length; i++) {
            if (data.scenes[i].id === id) {
                return data.scenes[i];
            }
        }
        return null;
    }

    function switchScene(scene) {
        // We only implement the core scene switching for testing purposes
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
        updateSceneName(scene);
        // Note: Autorotate and other helper calls are omitted for simplicity here
    }

    function updateSceneName(scene) {
        sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    // --- 5. START THE VIEWER ---

    // Display the initial scene.
    if (scenes.length > 0) {
        switchScene(scenes[0]);
    } else {
        console.error("No scenes found in data.js to load.");
    }

    // Note: All other original helper functions (updateSceneList, toggleAutorotate, etc.) 
    // must be included for a fully functional tour, but this minimal set should load the scene.

})();