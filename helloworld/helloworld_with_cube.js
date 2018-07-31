var scence, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;

initialize();
animate();

function initialize()
{
	scence = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scence.add( ambientLight );

	camera = new THREE.Camera();
	scence.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	///////////////////////////////////////////////
	////////////// Setup arToolkitSource //////////
	///////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResizeElement()
		arToolkitSource.copyElementSizeTo(renderer.domElement)
		if( arToolkitSource.arController !== null )
		{
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
		}
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});

	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});

	////////////////////////////////////////////////
	////////////// Setup arToolkitContext //////////
	////////////////////////////////////////////////

	// create arToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl : '../data/data/camera_para.dat',
		detectionMode: 'mono'
	});

	// copy porjection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted(){
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	////////////////////////////////////////////
	////////////// Setup markerRoots //////////
	//////////////////////////////////////////

	// builde markerControls
	markerRoot1 = new THREE.Group();
	scence.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(
		arToolkitContext, markerRoot1, {
			type: 'pattern', patternUrl: "../data/data/hiro.patt",
	})

	let geometry1 = new THREE.CubeGeometry(1,1,1);
	let material1 = new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});

	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y=0.5;

	markerRoot1.add( mesh1 );
}

function update()
{
	// update artoolkit on every frame
	if( arToolkitSource.ready !== false )
	{
		arToolkitContext.update( arToolkitSource.domElement );
	}
}


function render()
{
	renderer.render( scence, camera );
}

function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}