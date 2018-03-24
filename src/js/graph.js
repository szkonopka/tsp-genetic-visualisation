import { Mesh, CircleGeometry, MeshBasicMaterial } from 'three';

export default class Graph {
	constructor(size) {
		this.size = size;
		this.cities = [];
		this.metrics = new Array(size);
		this.material = new MeshBasicMaterial( {color: 0xffffff } );
		this.circleGeometry = new CircleGeometry(0.03, 32);
		for(let i = 0; i < this.size; i++) {
			this.cities.push(this.initCity());
		}
		this.countMetrics();
	}

	initCity() {
		let circle = new Mesh(this.circleGeometry, this.material);
		circle.position.x = (Math.random() * 14) - 7;
		circle.position.y = (Math.random() * 7) - 3.5;
		return circle;
	}

	addCitiesToScene(scene) {
		for(let i = 0; i < this.size; i++) {
			scene.add(this.cities[i]);
		}
	}

	countMetrics() {
		for(let i = 0; i < this.size; i++) {
			this.metrics[i] = new Array(this.size);
		}

		for(let i = 0; i < this.size; i++) {
			for(let j = i; j < this.size; j++) {
				if(i === j) {
					this.metrics[i][j] = 0;
				} else {
					this.metrics[i][j] = this.metrics[j][i] = Math.sqrt(Math.pow((this.cities[i].position.x - this.cities[j].position.x), 2) + Math.pow((this.cities[i].position.y - this.cities[j].position.y), 2));
				}
			}
		}
	}
}
