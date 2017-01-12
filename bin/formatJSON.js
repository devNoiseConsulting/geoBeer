var fs = require('fs');

var pathName = process.argv[2];

if (pathName) {
  if (fs.lstatSync(pathName).isDirectory()) {
    formatAll(pathName);
  } else {
    formatFile(pathName);
  }
} else {
  var node = getFileName(process.argv[0]);
  var script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <filename or directory>");
}

function formatAll(dirName) {
  fs.readdir(dirName, processCompanies);

  function processCompanies(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files = files.filter(isJsonFile);
    files = files.map(addPath);
    files.forEach(formatFile);
  }

  function addPath(fileName) {
    return dirName + '/' + fileName;
  }
}

function formatFile(fileName) {
  var opportunties;
  try {
    var text = fs.readFileSync(fileName, "utf8");

    var re1 = /([\}\]])\s+([\{\[])/gm;
    text = text.replace(re1, "$1,$2");

    var re2 = /([\}\]\"]),(\s+)?([\}\]])/gm;
    text = text.replace(re2, "$1 $3");

    opportunties = JSON.parse(text);
  } catch (e) {
    console.log("ERROR: file: " + fileName + " error: " + e.message);

    return false;
  }

  try {
    var out = fs.createWriteStream(fileName, {
      encoding: "utf8"
    });
    out.write(JSON.stringify(opportunties, null, 2));
    out.write("\n");
    out.end();
  } catch (e) {
    console.log("ERROR: Couldn't write content out to: " + fileName + "");
    console.log("ERROR: " + e.message);
    return false;
  }
}

function isJsonFile(file) {
  return file.endsWith('.geojson');
}

function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
}
