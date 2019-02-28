var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var mesh1;

initialize();
animate();

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
	scene.add(ambientLight);

	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0);
	renderer.setSize(640, 480);
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	////////////////////////////////////////////////
	////////////// Setup arToolkitSource //////////
	//////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam'
	});

	function onResize()
	{
		arToolkitSource.onResize();
		arToolkitSource.copySizeTo(renderer.domElement);
		if(arToolkitContext.arController !== null)
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
		}
	}

	arToolkitSource.init(function onReady() {
		onResize()
	});

	// handle resize event
	window.addEventListener('resize', function() {
		onResize()
	});

	/////////////////////////////////////////////////
	////////////// Setup arToolkitContext //////////
	///////////////////////////////////////////////

	// create arToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: '../data/data/camera_para.dat',
		detection: 'mono'
	})

	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	////////////////////////////////////////////
	////////////// Setup markerRoots //////////
	//////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "../data/data/hiro.patt"
	})

	let geometry1 = new THREE.SphereGeometry(1, 32, 32);
}
