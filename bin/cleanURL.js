const fs = require('fs');
const path = require('path');

const pathName = process.argv[2];

if (pathName) {
  if (fs.lstatSync(pathName).isDirectory()) {
    processAll(pathName);
  } else {
    processFile(pathName);
  }
} else {
  var node = path.basename(process.argv[0]);
  var script = path.basename(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <filename or directory>");
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

function processAll(dirName) {
  let files = fileWalkSync(dirName, []);
  processBreweries(files);

  function processBreweries(files) {
    files = files.filter(isJsonFile);
    files.forEach(processFile);
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
  brewery.features.forEach(addSlashToURL);

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

function addSlashToURL(breweryLocation) {
  if (breweryLocation.properties.url.endsWith('.com')) {
    console.log(breweryLocation.properties.name);
    breweryLocation.properties.url = breweryLocation.properties.url + "/";
  }
}

function isJsonFile(file) {
  return file.endsWith('.geojson');
}
