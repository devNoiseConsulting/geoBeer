const fs = require('fs');

const licenseFile = process.argv[2];
const breweryFile = process.argv[3];

if (licenseFile && breweryFile) {
    processFile(licenseFile, breweryFile);
} else {
    var node = getFileName(process.argv[0]);
    var script = getFileName(process.argv[1]);

    console.log("Usage: " + node + " " + script + " <filename or directory>");
}

var breweries;
var currentLicense;

function processFile(fileName, breweryFile) {
    var licenses;
    try {
        var text = fs.readFileSync(breweryFile, "utf8");
        breweries = JSON.parse(text);

        text = fs.readFileSync(fileName, "utf8");

        var re1 = /([\}\]])\s+([\{\[])/gm;
        text = text.replace(re1, "$1,$2");

        var re2 = /([\}\]\"]),(\s+)?([\}\]])/gm;
        text = text.replace(re2, "$1 $3");

        licenses = JSON.parse(text);
    } catch (e) {
        console.log("ERROR: file: " + fileName + " error: " + e.message);

        return false;
    }

    console.log(breweries.features.length);
    // Need to see how many brewery locations are listed for the brewer.
    // Check each location to see if it has a UUID.
    // Only write the brewer information to the file if a UUID has been added.
    licenses = licenses.map(findBrewery);
    let sum = licenses.reduce(function(a, b) {
        return a + b.distance;
    }, 0);
    let avg = sum / licenses.length;
    console.log("sum", sum);
    console.log("avg", avg);

    try {
        var out = fs.createWriteStream(fileName, {encoding: "utf8"});
        out.write(JSON.stringify(licenses, null, 2));
        out.write("\n");
        out.end();
    } catch (e) {
        console.log("ERROR: Couldn't write content out to: " + fileName + "");
        console.log("ERROR: " + e.message);
        return false;
    }
}

function findBrewery(license) {
    currentLicense = license;
    var closestBreweries = breweries.features.sort(closestSort);
    license.brewery = closestBreweries[0];
    license.distance = distance(license.latitude, license.longitude, license.brewery.geometry.coordinates[1], license.brewery.geometry.coordinates[0]);

    return license;
}

function closestSort(a, b) {
    var distance1 = distance(currentLicense.latitude, currentLicense.longitude, a.geometry.coordinates[1], a.geometry.coordinates[0]);
    var distance2 = distance(currentLicense.latitude, currentLicense.longitude, b.geometry.coordinates[1], b.geometry.coordinates[0]);
    return distance1 - distance2;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    // Because 1.0000000000000002 returns NaN. :(
    dist = (dist > 1) ? 1 : dist;
    dist = (dist < -1) ? -1 : dist;
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist;
}

function isJsonFile(file) {
    return file.endsWith('.geojson');
}

function getFileName(path) {
    return path.substring(path.lastIndexOf('/') + 1, path.length);
}
