import Graph from './graph.js';
import { Geometry, LineBasicMaterial, Line, Vector3 } from 'three';

export default class TSPGenetic {
	constructor(graph, _population, _scene) {
		this.bestPath = [];
		this.bestDist = Infinity;
		this.populationSize = _population;
		this.population = [];
		this.graph = graph;
		this.scene = _scene;
		this.initPopulation();
	}

	initPopulation() {
		this.bestPath = this.greedy();
		this.population = new Array(this.populationSize);
		for(let i = 0; i < this.populationSize; i++) {
			this.population[i] = this.bestPath;
		}
		this.initLines();
	}

	findBestPath() {
		calcFitness();
		for(let i = 0; i < 1000; i++) {

		}
	}

	calcFitness() {
		let tempDist;
		for(let i = 0; i < this.populationSize; i++) {
			tempDist = calcDistance(this.population[i]);
			if(tempDist < this.bestDist) {
				this.bestDist = tempDist;
				this.bestPath = this.population[i];
			}
		}
	}

	calcDistance(population) {
		let graphSize = this.graph.size;
		let indexA, indexB, distance;
		for(let i = 0; i < graphSize - 1; i++) {
			indexA = population[i];
			indexB = population[i + 1];
			distance += this.graph.metrics[indexA][indexB];
		}
		distance += this.graph.metrics[indexB][population[0]];
		return distance;
	}

	initLines() {
		let graphSize = this.graph.size;
		let material = new LineBasicMaterial( {color: 0xffffff });
		for(let i = 0; i < graphSize; i++) {
			let geometry = new Geometry();
			if(i < graphSize - 1) {
				geometry.vertices.push(new Vector3(this.graph.cities[i].position.x, this.graph.cities[i].position.y, 0));
				geometry.vertices.push(new Vector3(this.graph.cities[i + 1].position.x, this.graph.cities[i + 1].position.y, 0));
			} else {
				geometry.vertices.push(new Vector3(this.graph.cities[i].position.x, this.graph.cities[i].position.y, 0));
				geometry.vertices.push(new Vector3(this.graph.cities[0].position.x, this.graph.cities[0].position.y, 0));
			}
			let line = new Line(geometry, material);
			this.scene.add(line);
		}
	}

	refreshLines() {

	}

	greedy() {
		let counter = 0, i = 0, nextElem = -1, k = 0;
		let graphSize = this.graph.size;
		let visited = new Array(graphSize), path = new Array(graphSize);

		for(let j = 0; j < graphSize; j++) {
			visited[j] = 0;
		}

		while(counter < graphSize) {
			let bestDist = Infinity;
			for(let j = 0; j < graphSize; j++) {
				if(this.graph.metrics[i][j] < bestDist && visited[j] === 0) {
					bestDist = this.graph.metrics[j][j];
					nextElem = j;
				}
			}
			visited[nextElem] = 1;
			path[k] = nextElem;
			k++;
			i = nextElem;
			counter++;
		}
		return path;
	}


}
