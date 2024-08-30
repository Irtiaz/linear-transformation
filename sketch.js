const gridSpacing = 20;

const arrowLength = gridSpacing / 5;
const arrowWidth = arrowLength / 2;

let iCap = new p5.Vector(1, 0);
let jCap = new p5.Vector(0, 1);
let selectedPoint = null;

const xAxisTransformationCanvas = (sketch) => {
	sketch.setup = () => {
		sketch.createCanvas(400, 400).parent("i-cap");
	}

	sketch.draw = () => {
		sketch.background(255);
		drawGraphPaper(sketch, gridSpacing);

		document.getElementById("i-cap-value").textContent = `${iCap.x}i + ${iCap.y}j`;

		sketch.push();

		sketch.translate(sketch.width / 2, sketch.height / 2);
		sketch.rotate(-iCap.heading());

		const endPoint = iCap.mag() * gridSpacing;
	
		sketch.strokeWeight(2);
		sketch.stroke(0);
		sketch.line(0, 0, endPoint, 0);

		sketch.fill(0);
		sketch.stroke(0);
		sketch.triangle(endPoint, 0, endPoint - arrowLength, arrowWidth, endPoint - arrowLength, -arrowWidth);

		sketch.pop();
	}

	sketch.mousePressed = () => {
		if (sketch.mouseX < 0 || sketch.mouseX > sketch.width || sketch.mouseY < 0 || sketch.mouseY > sketch.height) return;
		const latticeX = Math.round((sketch.mouseX - sketch.width / 2) / gridSpacing);
		const latticeY = -Math.round((sketch.mouseY - sketch.height / 2) / gridSpacing);

		iCap = new p5.Vector(latticeX, latticeY);
	}
}

const yAxisTransformationCanvas = (sketch) => {
	sketch.setup = () => {
		sketch.createCanvas(400, 400).parent("j-cap");
	}

	sketch.draw = () => {
		sketch.background(255);
		drawGraphPaper(sketch, gridSpacing);

		document.getElementById("j-cap-value").textContent = `${jCap.x}i + ${jCap.y}j`;

		sketch.push();

		sketch.translate(sketch.width / 2, sketch.height / 2);
		sketch.rotate(-jCap.heading());

		const endPoint = jCap.mag() * gridSpacing;
	
		sketch.strokeWeight(2);
		sketch.stroke(0);
		sketch.line(0, 0, endPoint, 0);

		sketch.fill(0);
		sketch.stroke(0);
		sketch.triangle(endPoint, 0, endPoint - arrowLength, arrowWidth, endPoint - arrowLength, -arrowWidth);

		sketch.pop();
	}

	sketch.mousePressed = () => {
		if (sketch.mouseX < 0 || sketch.mouseX > sketch.width || sketch.mouseY < 0 || sketch.mouseY > sketch.height) return;
		const latticeX = Math.round((sketch.mouseX - sketch.width / 2) / gridSpacing);
		const latticeY = -Math.round((sketch.mouseY - sketch.height / 2) / gridSpacing);

		jCap = new p5.Vector(latticeX, latticeY);
	}
}

const pointPickerCanvas = (sketch) => {
	sketch.setup = () => {
		sketch.createCanvas(400, 400).parent("original-coordinate");
	}

	sketch.draw = () => {
		sketch.background(255);
		
		drawGraphPaper(sketch, gridSpacing);

		if (!selectedPoint) return;
		document.getElementById("original-coordinate-value").textContent = `(${selectedPoint.x}, ${selectedPoint.y})`;

		sketch.push();
		sketch.translate(sketch.width / 2, sketch.height / 2);

		sketch.strokeWeight(2);
		sketch.stroke(0);
		for (let count = 0; count < Math.abs(selectedPoint.x); ++count) {
			const sign = selectedPoint.x > 0? 1 : -1;
			const end = sign * (count + 1) * gridSpacing;

			sketch.line(sign * count * gridSpacing, 0, end, 0);

			sketch.fill(0);
			sketch.triangle(end, 0, end - sign * arrowLength, arrowWidth, end - sign * arrowLength, -arrowWidth);
		}

		for (let count = 0; count < Math.abs(selectedPoint.y); ++count) {
			const sign = selectedPoint.y > 0? 1 : -1;
			const end = sign * (count + 1) * gridSpacing;

			sketch.line(selectedPoint.x * gridSpacing, -sign * count * gridSpacing, selectedPoint.x * gridSpacing, -end);

			sketch.fill(0);
			sketch.triangle(selectedPoint.x * gridSpacing, -end, selectedPoint.x * gridSpacing + arrowWidth, -(end - sign * arrowLength), selectedPoint.x * gridSpacing - arrowWidth, -(end - sign * arrowLength));
		}

		sketch.stroke(255, 0, 0, 150);
		sketch.strokeWeight(8);
		sketch.point(selectedPoint.x * gridSpacing, -selectedPoint.y * gridSpacing);

		sketch.pop();
	}

	sketch.mousePressed = () => {
		if (sketch.mouseX < 0 || sketch.mouseX > sketch.width || sketch.mouseY < 0 || sketch.mouseY > sketch.height) return;
		const latticeX = Math.round((sketch.mouseX - sketch.width / 2) / gridSpacing);
		const latticeY = -Math.round((sketch.mouseY - sketch.height / 2) / gridSpacing);

		selectedPoint = new p5.Vector(latticeX, latticeY);
	}
}

const transformedCanvas = (sketch) => {
	sketch.setup = () => {
		sketch.createCanvas(400, 400).parent('transformed-coordinate');
	}

	sketch.draw = () => {
		sketch.background(255);

		drawGraphPaper(sketch, gridSpacing);

		if (!selectedPoint) return;
		
		sketch.stroke(0);
		sketch.strokeWeight(2);

		const iCapLength = iCap.mag();
		const jCapLength = jCap.mag();

		sketch.push();

		sketch.translate(sketch.width / 2, sketch.height / 2);

		sketch.push();
		sketch.rotate(-iCap.heading());
		
		for (let count = 0; count < Math.abs(selectedPoint.x); ++count) {
			const sign = selectedPoint.x > 0? 1 : -1;
			const end = sign * (count + 1) * gridSpacing * iCapLength;

			sketch.line(sign * count * gridSpacing * iCapLength, 0, end, 0);

			sketch.fill(0);
			sketch.triangle(end, 0, end - sign * arrowLength, arrowWidth, end - sign * arrowLength, -arrowWidth);
		}
		sketch.pop();
		
		sketch.push();

		const xDirectionEndVector = p5.Vector.mult(iCap, selectedPoint.x).mult(gridSpacing);
		sketch.translate(xDirectionEndVector.x, -xDirectionEndVector.y);
		sketch.rotate(-jCap.heading());

		for (let count = 0; count < Math.abs(selectedPoint.y); ++count) {
			const sign = selectedPoint.y > 0? 1 : -1;
			const end = sign * (count + 1) * gridSpacing * jCapLength;

			sketch.line(sign * count * gridSpacing * jCapLength, 0, end, 0);

			sketch.fill(0);
			sketch.triangle(end, 0, end - sign * arrowLength, arrowWidth, end - sign * arrowLength, -arrowWidth);
		}

		sketch.pop();
	
		const finalCoordinate = p5.Vector.add(p5.Vector.mult(iCap, selectedPoint.x), p5.Vector.mult(jCap, selectedPoint.y));
		document.getElementById("transformed-coordinate-value").textContent = `(${finalCoordinate.x}, ${finalCoordinate.y})`

		const finalPoint = p5.Vector.mult(finalCoordinate, gridSpacing);

		sketch.stroke(255, 0, 0, 150);
		sketch.strokeWeight(8);
		sketch.point(finalPoint.x, -finalPoint.y);

		sketch.pop();
	}
}

new p5(xAxisTransformationCanvas);
new p5(yAxisTransformationCanvas);
new p5(pointPickerCanvas);
new p5(transformedCanvas);


function drawGraphPaper(sketch, spacing) {
	sketch.stroke(0);
	sketch.strokeWeight(1);

	for (let x = 0; x < sketch.width; x += spacing) {
		sketch.line(x, 0, x, sketch.height);
	}

	for (let y = 0; y < sketch.height; y += spacing) {
		sketch.line(0, y, sketch.width, y);
	}
}
