const fs = require('fs');
const text = fs.readFileSync('termite tubes.json', 'utf8');
const data = text.split(/[\r\n]/);
data.filter(
	(row) => row.length > 0
).map(
	(row) => {
		console.log(row);
		return JSON.parse(row)
	}
).map(
	(data) => console.log(data)
)
