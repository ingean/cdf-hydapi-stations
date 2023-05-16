/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

describe('model', function () {
  it('should get a geojson from the getData() function', (done) => {
    const Model = require('../src/model')
    const model = new Model()

    model.getData({}, (err, geojson) => {
      expect(err).to.equal(null)
      console.log("Test data for first feature")
      console.log(geojson.features[0].geometry)
      console.log(geojson.features[0].properties)
      console.log(`Number of features is: ${geojson.features.length}`)

      expect(geojson.type).to.equal('FeatureCollection')
      expect(geojson.features).to.be.an('array')
      done()
    })
  })
})
