// A simple helper script to save me a few hours of work ;)
let coords = [],
	rows = 8,
	cols = 8,
	spacing = 50;

for (let row = 0; row < rows; row++) {
	let temp = [];
	for (let col = 0; col < cols; col++) {
		temp.push([col * spacing, row * spacing]);
	}
	coords.push(temp);
}

console.log(coords.flat());
