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
		//console.log(row);
		return JSON.parse(row)
	}
).map(
	(data) => {
    if (!data.annotation) { return ; }

    //console.log(data.content);
    const file = data.content.replace(/.*[/]/, '');
    const out = 'labels/' + file.replace(/[.]jpeg/, '.jpg');
	  script = script + 'curl -o ' + out + ' ' + data.content + "\n";
		let labels = "";

		data.annotation.map(
			(annotation) => {
        //console.log(JSON.stringify(annotation, null, 2));
				const x1 = Math.min.apply(Math, annotation.points.map( (p) => p[0] ));
				const y1 = Math.min.apply(Math, annotation.points.map( (p) => p[1] ));
				const x2 = Math.max.apply(Math, annotation.points.map( (p) => p[0] ));
				const y2 = Math.max.apply(Math, annotation.points.map( (p) => p[1] ));

				const width = x2 - x1;
				const height = y2 - y1;
				const label = annotation.label[0].replace(/ /g, '_');
				const xc = (x2 + x1) / 2;
				const yc = (y2 + y1) / 2;

        //console.log(x1, y1, x2, y2, xc, yc, width, height);
				//const string = "1" + " " + xc + " " + yc + " " + width + " " + height;
				//const string = "0 0.5 0.5 0.100 0.100";
        const string = `14 0.750704225352 0.834 0.402816901408 0.332
14 0.412676056338 0.793 0.50985915493 0.414`;
				labels = labels + string + "\n";
			}
		)
    
    fs.writeFileSync('./labels/' + file.substring(0, file.lastIndexOf('.')) + '.txt', labels);

    if (Math.random() > 0.33) {
			train += out + "\n";
    } else {
			test += out + "\n";
    }
		// console.log(data)
	}
);

fs.writeFileSync('images.sh', script);
fs.writeFileSync('cfg/train.txt', train);
fs.writeFileSync('cfg/test.txt', test);
