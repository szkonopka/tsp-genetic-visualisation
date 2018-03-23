import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, CircleGeometry, MeshBasicMaterial } from 'three';
import Graph from './graph.js';
import TSPGenetic from './tsp-engine.js';

window.onload = function() {
	var scene = new Scene();
	var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	var canvas = document.getElementById("cities");

	var renderer = new WebGLRenderer({canvas: canvas, alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.z = 5;
	renderer.setClearColor(0x000000, 0);

	const citiesAmount = 60;
	const citiesPlane = new Graph(citiesAmount, scene);
	citiesPlane.addCitiesToScene(scene);

	const tspEngine = new TSPGenetic(citiesPlane, 100, scene);

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

};
