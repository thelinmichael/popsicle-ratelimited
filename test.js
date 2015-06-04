/* global it, describe */

require('es6-promise').polyfill()

var popsicle = require('popsicle')
var expect = require('chai').expect
var nock = require('nock')
var popsicleRatelimited = require('./')

var BASE_URL = 'https://api.spotify.com'
var PATH = '/v1/search?type=track&q=beat'

describe('popsicle ratelimited', function () {
  this.timeout(5000)

  it('should retry on rate limit', function (done) {

    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(429, 'rate limited', { 'Retry-After': 2 })

    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(200, '{}')

    var ratelimited = popsicleRatelimited(5, popsicleRatelimited.SECOND)
    var request = popsicle(BASE_URL + PATH).use(ratelimited)

    request.then(function (response) {
      expect(response.status).to.equal(200)
      done()
    }).catch(function (error) {
      done(error)
    })
  })

  it('should fail if rate limit reset time is higher than timeout', function (done) {
    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(429, 'rate limited', { 'Retry-After': 2 })

    var ratelimited = popsicleRatelimited(1, popsicleRatelimited.SECOND)
    var request = popsicle(BASE_URL + PATH).use(ratelimited)

    request.then(function (response) {
      done(new Error('Should have thrown an error'))
    }).catch(function (error) {
      expect(error.message).to.equal('Rate limited: Blocking time higher than timeout')
      done()
    })
  })

  it('should keep retrying even if second attempt also returns rate limit', function (done) {
    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(429, 'rate limited', { 'Retry-After': 2 })

    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(429, 'rate limited', { 'Retry-After': 1 })

    nock(BASE_URL)
      .get(PATH)
      .once()
      .reply(200, '{}')

    var ratelimited = popsicleRatelimited(5, popsicleRatelimited.SECOND)
    var request = popsicle(BASE_URL + PATH).use(ratelimited)

    request.then(function (response) {
      expect(response.status).to.equal(200)
      done()
    }).catch(function (error) {
      done(error)
    })
  })

})
