import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, CircleGeometry, MeshBasicMaterial, EEEEEdfsfsdf } from 'three';

class Graph {
	constructor(size) {
		this.size = size;
		this.cities = [];
		this.material = new MeshBasicMaterial( {color: "0x000000"} );
		this.circleGeometry = new CircleGeometry(1, 32);
		for(let i = 0; i < this.size; i++) {
			this.cities.push(this.initCity());
		}
	}

	initCity() {
		let circle = new Mesh(this.circleGeometry, this.material);
		circle.position.x = (Math.random() * window.innerWidth) + 0;
		circle.position.y = (Math.random() * window.innerHeight) + 0;
		circle.position.z = 10;
		return circle;
	}

	addCitiesToScene(scene) {
		for(let i = 0; i < this.size; i++) {
			scene.add(this.cities[i]);
		}
	}
}

window.onload = function() {
	const scene = new Scene();
	const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const canvas = document.getElementById("cities");
	const renderer = new WebGLRenderer({canvas: canvas, antialis: true, alpha: true});
	camera.position.z = 5;

	renderer.setClearColor(0xffffff, 0);
	renderer.setSize(window.innerWidth, window.innerHeight);

	const citiesAmount = 60;
	const citiesPlane = new Graph(citiesAmount);
	citiesPlane.addCitiesToScene(scene);

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
