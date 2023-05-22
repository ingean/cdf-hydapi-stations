const request = require('request').defaults({ gzip: true, json: true })
const config = require('config')

function Model (koop) {}

// A Model is a javascript function that encapsulates custom data access code.
// Each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {
  const url = config.apiUrl
  const apiKey = config.apiKey
  
  request({
    headers: {
      "accept": "application/json",
      "X-API-Key": apiKey
    },
    uri: url,
    method: 'GET'
  }, (err, res, body) => {
    if (err) return callback(err)
    const geojson = translate(body)
    callback(null, geojson)
  })
}

function translate(results) {
  let data = results.data
  let features = data.map(feature => {
    let f = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [feature['longitude'], feature['latitude']]
      },
      "properties": feature
    }
    f.properties.seriesList = null // Flatten last property
    return f
  })

  let geojson = {
    type: 'FeatureCollection',
    features: features
  }

  geojson.metadata = {
    name: 'NVE Stations',
    description: 'Hydrological stations from NVE API',
    geometryType: 'Point'
  }
  
  return geojson
}

module.exports = Model
