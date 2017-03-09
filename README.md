# geoBeer
GeoJSON data files for Breweries.

## Introduction
A simple git repository for tracking breweries. This repository is mostly just data files for you to use in other projects. The brewery files are [GeoJSON files](http://geojson.org/geojson-spec.html) using the Point geometry object. Most meta data and styling information is stored on the properties object.

Generally the data files focus on breweries in and around Pennsylvania.

## Adding breweries

New breweries contributions are welcome. See the [example file](./exampleBrewery.geojson) for how to populate a file with brewery information.

1. Just fork this repo.
* Add the new breweries files.
* Run `npm run format` to beautify the files.
* Commit your changes.
* Make a Pull Requests.

## Build

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

* `npm run merge` will merge all the brewery GeoJSON files into breweryList.geojson file.
* `npm run format` will process all the GeoJSON files in the breweries directory and give them a standard indentation formatting.
* `npm run uuid` will process all the GeoJSON files in the breweries directory and generate a UUID if the brewery location does not have a geoBeerId property set on the properties object. This is the only script that relies on an external module. You need to run `npm install` before running this script.
