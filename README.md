# geoBeer
Keeping track of Brewery visits with GeoJSON

## Introduction

A simple git repository for tracking brewery visits. The brewery files are [GeoJSON files](http://geojson.org/geojson-spec.html)  using the Point geometry object. Most meta data and styling information is stored on the properties object.


The marker-color and marker-size properties are used to indicate the visitation status of the brewery.

| Status |Color|Hex Code|Size|
|---|---|---|---|---|
|visited|blue|#0047AB|large|
|visiting soon|green|#009688|medium|
|to be visited|gray|#607D8B|small|
|not yet open|DarkOrange|#FF8C00|small|


A couple of javascript files are available to assist in creating and merging breweries.

## Build

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Type `npm run merge` to merge all the brewery GeoJSON files into myBreweryList.geojson.
