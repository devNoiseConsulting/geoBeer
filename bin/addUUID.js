const fs = require('fs');
const uuidV4 = require('uuid/v4');

const pathName = process.argv[2];

if (pathName) {
  if (fs.lstatSync(pathName).isDirectory()) {
    processAll(pathName);
  } else {
    processFile(pathName);
  }
} else {
  var node = getFileName(process.argv[0]);
  var script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <filename or directory>");
}

function processAll(dirName) {
  fs.readdir(dirName, processBreweries);

  function processBreweries(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files = files.filter(isJsonFile);
    files = files.map(addPath);
    files.forEach(processFile);
  }

  function addPath(fileName) {
    return dirName + '/' + fileName;
  }
}

function processFile(fileName) {
  var brewery;
  try {
    var text = fs.readFileSync(fileName, "utf8");

    var re1 = /([\}\]])\s+([\{\[])/gm;
    text = text.replace(re1, "$1,$2");

    var re2 = /([\}\]\"]),(\s+)?([\}\]])/gm;
    text = text.replace(re2, "$1 $3");

    brewery = JSON.parse(text);
  } catch (e) {
    console.log("ERROR: file: " + fileName + " error: " + e.message);

    return false;
  }

  console.log('Processing: ' + fileName);
  // Need to see how many brewery locations are listed for the brewer.
  // Check each location to see if it has a UUID.
  // Only write the brewer information to the file if a UUID has been added.
  brewery.features.forEach(addUUID);
  try {
    var out = fs.createWriteStream(fileName, {
      encoding: "utf8"
    });
    out.write(JSON.stringify(brewery, null, 2));
    out.write("\n");
    out.end();
  } catch (e) {
    console.log("ERROR: Couldn't write content out to: " + fileName + "");
    console.log("ERROR: " + e.message);
    return false;
  }
}

function addUUID(breweryLocation) {
  if (!breweryLocation.properties.geoBeerId) {
    breweryLocation.properties.geoBeerId = uuidV4();
  }
}

function isJsonFile(file) {
  return file.endsWith('.geojson');
}

function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
}
