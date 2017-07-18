'use strict';

var express = require('express');
var app = express();
var geocoder = require('./geocoder.js');
var helmet = require('helmet');

app.use(helmet());

app.get(/geocode/, (req, res) => {
  var lat = req.query.latitude || req.query.lat || false;
  var lng = req.query.longitude || req.query.lng || false;
  var maxResults = req.query.maxResults || 1;
  if (!lat || !lng) {
    return res.status(400).send('Bad Request');
  }
  var points = [];
  if (Array.isArray(lat) && Array.isArray(lng)) {
    if (lat.length !== lng.length) {
      return res.status(400).send('Bad Request');
    }
    for (var i = 0, lenI = lat.length; i < lenI; i++) {
      points[i] = {latitude:lat[i], longitude:lng[i]};
    }
  } else {
    points[0] =  {latitude:lat, longitude:lng};
  }
  geocoder.lookUp(points, maxResults, (err, addresses) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send(addresses[0]);
  });
});

var options = {
  load: {
	admin1: false,
	admin2: false, 
	admin3And4: false,
	alternateNames: false
  }
};

geocoder.init(options, () => {
  let port = process.env.PORT || 4436;
  app.listen(port, () => {
    console.info('Geocoder API listening on port ' + port);
  });
});
