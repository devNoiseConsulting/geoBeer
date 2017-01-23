let fs = require('fs');

const dirName = process.argv[2];

if (dirName) {
  mergeAll(dirName);
} else {
  const node = getFileName(process.argv[0]);

  const script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <dirname>");
}

function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
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
  const text = fs.readFileSync(fileName, "utf8");
  const brewery = JSON.parse(text);

  return brewery;
}

function writeBreweryMerge(fileName, breweries) {
  let out = fs.createWriteStream(fileName, {
    encoding: "utf8"
  });
  out.write(JSON.stringify(breweries, null, 2));
  out.write("\n");
  out.end(); // currently the same as destroy() and destroySoon()
}

function mergeAll(dirName) {
  let breweries = [];

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
      const brewery = readBrewery(dirName + "/" + fileName);

      brewery.features.forEach(function(item) {
        breweries.push(item);
      });
    }

    const allBreweries = {
      "type": "FeatureCollection",
      "features": breweries
    };

    writeBreweryMerge('breweryList.geojson', allBreweries);
  }
}
