/* global beforeEach, it, describe */

require('es6-promise').polyfill()

var popsicle = require('popsicle')
var expect = require('chai').expect
var nock = require('nock')
var popsicleRatelimited = require('./')

describe('popsicle ratelimited', function () {
  beforeEach(function () {
    nock('http://example.com')
      .persist()
      .get('/endpoint')
      .reply(429, 'rate limited')
  })

  it('should rate limit api calls', function () {
    var url = 'http://example.com/endpoint'
    var ratelimited = popsicleRatelimited()

    function request (obj) {
      return popsicle(obj).use(ratelimited)
    }

    return request(url)
      .then(function () {
        return request(url)
      })
  })

  it('provide common short cuts', function () {
    expect(popsicleRatelimited.SECOND).to.be.a('number')
    expect(popsicleRatelimited.MINUTE).to.be.a('number')
    expect(popsicleRatelimited.HOUR).to.be.a('number')
    expect(popsicleRatelimited.DAY).to.be.a('number')
    expect(popsicleRatelimited.WEEK).to.be.a('number')
  })
})
