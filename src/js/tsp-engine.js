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
		this.fitnessScore = new Array(this.populationSize);
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
		this.calcFitness();
		this.normalizeFitness();
		this.newGeneration();
	}

	newGeneration() {
		let newPopulation = new Array(this.populationSize);
		for(let i = 0; i < this.populationSize; i++) {
			//newPopulation[i] = this.OXcrossover(this.population[this.pickBestOne()], this.population[this.pickBestOne()])
			//newPopulation[i] = mutate
			if(Math.random() < 0.8) {
				this.mutate(this.population[i]);
			}
		}

		/*for(let i = 0; i < this.populationSize; i++) {
			if(Math.random() > 0.3) {
				this.population[i] = newPopulation[i];
			}
		}*/
	}

	pickBestOne() {
		let boundary = Math.random(), i = 0;
		while(i < this.populationSize && boundary > 0) {
			boundary = boundary -= this.fitnessScore[i];
			i++;
		}
		i = i - 1;
		return i;
	}

	OXcrossover(fParent, sParent) {
		let start, end;
		start = Math.floor(Math.random() * this.graph.size / 2);
		end = Math.floor(Math.random() * this.graph.size / 2 + this.graph.size / 2);
		let len = end - start;
		let child = new Array(this.graph.size);
		for(let i = start; i < end; i++) {
			child[i] = sParent[i];
		}

		let counter = 0, i = end, j = end;
		while(counter < this.graph.size) {
			i = i % this.graph.size;
			j = j % this.graph.size;
			if(child.includes(fParent[i])) {
				child[j] = fParent[i];
				j++;
			}
			i++;
			counter++;
		}
		return child;
	}

	mutate(population) {
		let indexA = Math.floor(Math.random() * this.graph.size);
		let indexB = Math.floor(Math.random() * this.graph.size);
		this.insert(population, indexA, indexB)
	}

	insert(population, indexA, indexB) {
		let temp = population[indexA];
		population[indexA] = population[indexB];
		population[indexB] = temp;
	}

	calcFitness() {
		let tempDist = 0;
		for(let i = 0; i < this.populationSize - 1; i++) {
			tempDist = this.calcDistance(this.population[i]);
			if(tempDist < this.bestDist) {
				console.log(this.bestDist);
				this.bestDist = tempDist;
				this.bestPath = this.population[i];
			}
			this.fitnessScore[i] = 1 / (tempDist + 1);
		}
	}

	normalizeFitness() {
		let fitSum = 0;
		for(let i = 0; i < this.populationSize; i++) {
			fitSum += this.fitnessScore[i];
		}

		for(let i = 0; i < this.populationSize; i++) {
			this.fitnessScore[i] = this.fitnessScore[i] / fitSum;
		}
	}

	calcDistance(population) {
		let graphSize = this.graph.size;
		let indexA = 0, indexB = 0, distance = 0;
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
		this.lines = [];
		let material = new LineBasicMaterial( {color: 0xffffff });
		for(let i = 0; i < graphSize; i++) {
			let geometry = new Geometry();
			if(i < graphSize - 1) {
				geometry.vertices.push(new Vector3(this.graph.cities[this.bestPath[i]].position.x, this.graph.cities[this.bestPath[i]].position.y, 0));
				geometry.vertices.push(new Vector3(this.graph.cities[this.bestPath[i + 1]].position.x, this.graph.cities[this.bestPath[i + 1]].position.y, 0));
			} else {
				geometry.vertices.push(new Vector3(this.graph.cities[this.bestPath[i]].position.x, this.graph.cities[this.bestPath[i]].position.y, 0));
				geometry.vertices.push(new Vector3(this.graph.cities[this.bestPath[0]].position.x, this.graph.cities[this.bestPath[0]].position.y, 0));
			}
			let line = new Line(geometry, material);
			this.lines.push(line);
			this.scene.add(this.lines[i]);
			geometry.verticesNeedUpdate = true;
		}
	}

	refreshLines() {
		for(let i = 0; i < this.graph.size; i++) {
			this.lines[i].geometry.verticesNeedUpdate = true;
			if(i < this.graph.size - 1) {
				this.lines[i].geometry.vertices[0] = { x: this.graph.cities[this.bestPath[i]].position.x, y: this.graph.cities[this.bestPath[i]].position.y, z: 0 };
				this.lines[i].geometry.vertices[1] = { x: this.graph.cities[this.bestPath[i + 1]].position.x, y: this.graph.cities[this.bestPath[i + 1]].position.y, z: 0 };
			} else {
				this.lines[i].geometry.vertices[0] = { x: this.graph.cities[this.bestPath[i]].position.x, y: this.graph.cities[this.bestPath[i]].position.y, z: 0 };
				this.lines[i].geometry.vertices[1] = { x: this.graph.cities[this.bestPath[0]].position.x, y: this.graph.cities[this.bestPath[0]].position.y, z: 0 };
			}
			this.lines[i].geometry.verticesNeedUpdate = true;
		}
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
