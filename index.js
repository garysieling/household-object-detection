const fs = require('fs');
const text = fs.readFileSync('termite tubes.json', 'utf8');
const data = text.split(/[\r\n]/);
let script = '';

let test = '';
let train = '';

data.filter(
	(row) => row.length > 0
).map(
	(row) => {
		console.log(row);
		return JSON.parse(row)
	}
).map(
	(data) => {
    if (!data.annotation) { return ; }
    console.log(data.content);
    const file = data.content.replace(/.*[/]/, '');
    const out = 'labels/' + file;
	  script = script + 'curl -o ' + out + ' ' + data.content + "\n";
		let labels = "";

		data.annotation.map(
			(annotation) => {
        console.log(JSON.stringify(annotation, null, 2));
				const x1 = Math.min.apply(Math, annotation.points.map( (p) => p[0] ));
				const y1 = Math.min.apply(Math, annotation.points.map( (p) => p[1] ));
				const x2 = Math.max.apply(Math, annotation.points.map( (p) => p[0] ));
				const y2 = Math.max.apply(Math, annotation.points.map( (p) => p[1] ));

				const width = x2 - x1;
				const height = y2 - y1;
				const label = annotation.label[0].replace(/ /g, '_');
				const xc = (x2 + x1) / 2;
				const yc = (y2 + y1) / 2;

				const string = "tube" + " " + xc + " " + yc + " " + width + " " + height;
				labels = labels + string + "\n";
			}
		)
    
    fs.writeFileSync('./labels/' + file.split('.')[0] + '.txt', labels);

    if (Math.random() > 0.33) {
			train += out + "\n";
    } else {
			test += out + "\n";
    }
		// console.log(data)
	}
);

fs.writeFileSync('images.sh', script);
fs.writeFileSync('train.txt', train);
fs.writeFileSync('test.txt', test);
