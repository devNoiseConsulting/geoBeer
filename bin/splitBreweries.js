var fs = require('fs');

var fileName = process.argv[2];
var text = fs.readFileSync(fileName, "utf8");

var featureCollection = JSON.parse(text);

console.log(typeof(featureCollection.features));
console.log(featureCollection.features.length);

function writeBrewery(brewery) {
	var newFileName = brewery.properties.name.replace(/\s+/gi, '-'); // Replace white space with dash
	newFileName = newFileName.replace(/[^a-zA-Z0-9\-]/gi, ''); // Strip any special characters
	newFileName = newFileName.replace(/--/gi, '-'); // Strip any special characters
	newFileName = "./breweries/" + newFileName + ".geojson";

  var newBrewery = {
    "type": "FeatureCollection",
    "features": []
  };
  newBrewery.features.push(brewery);
	var out = fs.createWriteStream(newFileName, { encoding: "utf8" });
	out.write(JSON.stringify(newBrewery, null, 2));
	out.end(); // currently the same as destroy() and destroySoon()
}

featureCollection.features.forEach(writeBrewery);
console.log('ended');
