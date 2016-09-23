var fs = require('fs');

var fileName = process.argv[2];
if (fileName) {
    var text = fs.readFileSync(fileName, "utf8");

    var breweries = text.toString().split("\n");
    if (breweries[0].startsWith("Brewery\t")) {
        breweries = breweries.slice(1);
    }

    breweries = breweries.filter(function(n){ return n != undefined });
    breweries = breweries.map(createBrewery);
    breweries.forEach(writeBrewery);
} else {
    function getFileName(path) {
        return path.substring(path.lastIndexOf('/') + 1, path.length);
    }

    var node = getFileName(process.argv[0]);
    var script = getFileName(process.argv[1]);

    console.log("Usage: " + node + " " + script + " <filename> ");
    console.log("\nExpects a tab delimited text file following the following column format:");
    console.log("1) Brewery\n2) Address\n3) GeoLat\n4) GeoLong\n5) WebsiteUrl");
}

function writeBrewery(brewery) {
    var newFileName = brewery.features[0].properties.name.replace(/\s+/gi, '-'); // Replace white space with dash
    newFileName = newFileName.replace(/[^a-zA-Z0-9\-]/gi, ''); // Strip any special characters
    newFileName = newFileName.replace(/-+/gi, '-'); // Strip any special characters
    if (newFileName) {
        newFileName = "./breweries/" + newFileName + ".geojson";
        console.log(newFileName);

        var out = fs.createWriteStream(newFileName, {
            encoding: "utf8"
        });
        out.write(JSON.stringify(brewery, null, 2));
        out.write("\n");
        out.end(); // currently the same as destroy() and destroySoon()
    }
}


function createBrewery(dataString) {
    var data = dataString.split("\t");
    console.log(dataString);

    var fileName = "./breweries/brewery-sample.json";
    var text = fs.readFileSync(fileName, "utf8");
    var brewery = JSON.parse(text);

    brewery.features[0].properties.name = data[0];
    brewery.features[0].properties.address = data[1];
    brewery.features[0].geometry.coordinates = [Number(data[3]), Number(data[2])];
    brewery.features[0].properties.url = data[4];

    return brewery;

}
