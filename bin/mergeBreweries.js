var fs = require('fs');

var dirName = process.argv[2];

if (dirName) {
  mergeAll(dirName);

  function mergeAll(dirName) {
    var breweries = [];

    fs.readdir(dirName, processBreweries);

    function processBreweries(err, files) {
      if (err) {
        console.log(err);
        return;
      }

      files = files.filter(isGeoJsonFile);
      files.sort(caseInsensitiveSort);
      files.forEach(addBrewery);

      function addBrewery(fileName) {
        var brewery = readBrewery(dirName + "/" + fileName);

        brewery.features.forEach(function(item) {
          breweries.push(item);
        });

        //breweries.push(brewery);
      }

      var allBreweries = {
        "type": "FeatureCollection",
        "features": breweries
      };

      writeBreweryMerge('myBreweryList.geojson', allBreweries);
    }
  }

  function isGeoJsonFile(file) {
    return file.endsWith('.geojson');
  }

  function caseInsensitiveSort(a, b) {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  }

  function readBrewery(fileName) {
    var text = fs.readFileSync(fileName, "utf8");
    var brewery = JSON.parse(text);

    return brewery;
  }

  function writeBreweryMerge(fileName, breweries) {
    var out = fs.createWriteStream(fileName, {
      encoding: "utf8"
    });
    out.write(JSON.stringify(breweries, null, 2));
    out.write("\n");
    out.end(); // currently the same as destroy() and destroySoon()
  }

} else {
  function getFileName(path) {
    return path.substring(path.lastIndexOf('/') + 1, path.length);
  }
  var node = getFileName(process.argv[0]);

  var script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <dirname>");
}
