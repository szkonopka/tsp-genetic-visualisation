import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, CircleGeometry, MeshBasicMaterial } from 'three';
import Graph from './graph.js';
import TSPGenetic from './tsp-engine.js';

window.onload = function() {
	var scene = new Scene();
	var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	var canvas = document.getElementById("cities");

	var renderer = new WebGLRenderer(
		{
			canvas: canvas,
			alpha: true,
			antialias: true
		});
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.z = 5;
	renderer.setClearColor(0x000000, 0);

	const citiesAmount = 100;
	const citiesPlane = new Graph(citiesAmount, scene);
	citiesPlane.addCitiesToScene(scene);

	const tspEngine = new TSPGenetic(citiesPlane, 100, scene, 0.15, 0.85, 0.3);

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}
	animate();

	function onWindowResize() {
	  camera.aspect = window.innerWidth / window.innerHeight;
	  camera.updateProjectionMatrix();
	  renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener('resize', onWindowResize, false);

	const statField = document.querySelectorAll('#stats')[0];

	let statTemplate = `Current best dist: <strong>${tspEngine.bestDist}</strong>`;
	statField.innerHTML = statTemplate;

	document.querySelectorAll('button')[0].addEventListener('click', function() {
		let sceneProperties = {
			renderer: renderer,
			scene: scene,
			camera: camera
		};
		let i = 0;
		setInterval(() => {
				i++;
				tspEngine.findBestPath(sceneProperties);
				statField.innerHTML = `Current best dist: <strong>${tspEngine.bestDist}</strong> <br/> Number of generation: ${i}`;
				renderer.render(scene, camera);
		}, 10);
	});
}
