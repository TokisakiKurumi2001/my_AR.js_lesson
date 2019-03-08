var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var mesh1;

var loader, texture;

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
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
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
		arToolkitSource.onResize()
		arToolkitSource.copySizeTo(renderer.domElement)
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
		detectionMode: 'mono'
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

	let geometry1 = new THREE.BoxGeometry(1, 1, 1);

	loader = new THREE.TextureLoader();
	let texture_str = randomTexture();
	texture = loader.load(texture_str, render);
	let material1 = new THREE.MeshLambertMaterial({ map: texture, opacity: 0.5 });

	mesh1 = new THREE.Mesh(geometry1, material1);
	mesh1.position.y = 1;

	markerRoot1.add(mesh1);

	let pointLight = new THREE.PointLight(0xffffff, 1, 100);
	pointLight.position.set(0.5, 3, 2);
	// create a mesh to help visualize the position of the light
	pointLight.add(
		new THREE.Mesh(
			new THREE.BoxBufferGeometry(0.05, 0.5, 0.25),
			new THREE.MeshBasicMaterial({ color : 0xffffff, opacity: 0.5})
		)
	);
	markerRoot1.add(pointLight);
}

function update()
{
	if(markerRoot1.visible)
	{
		mesh1.rotation.y += 0.01;
	}
	// update artoolkit on every frame
	if(arToolkitSource.ready !== false)
	{
		arToolkitContext.update(arToolkitSource.domElement);
	}
}

function render()
{
	renderer.render(scene, camera);
}

function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}

function randomTexture()
{
	var text = "../data/images/number_";
	var number = Math.floor((Math.random()*6) + 1);
	text += number;
	text += ".png";
	console.log(text);
	return text;
}