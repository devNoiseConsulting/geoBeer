const fs = require('fs');
const path = require('path');

const dirName = process.argv[2];

if (dirName) {
  mergeAll(dirName);
} else {
  const node = path.basename(process.argv[0]);
  const script = path.basename(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <dirname>");
}

function isGeoJsonFile(file) {
  return file.endsWith('.geojson');
}

function caseInsensitiveSort(a, b) {
  a = path.basename(a);
  b = path.basename(b);
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

function fileWalkSync(dir, filelist) {
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    let filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = fileWalkSync(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
}

function mergeAll(dirName) {
  let breweries = [];

  let files = fileWalkSync(dirName, []);
  processBreweries(files);

  function processBreweries(files) {
    files.sort(caseInsensitiveSort);

    files = files.filter(isGeoJsonFile);
    files.forEach(addBrewery);

    function addBrewery(fileName) {
      const brewery = readBrewery(fileName);

      brewery.features.forEach(function(item) {
        breweries.push(item);
      });
    }

    const allBreweries = {
      "type": "FeatureCollection",
      "features": breweries
    };

    writeBreweryMerge('./data/breweryList.geojson', allBreweries);
  }
}
