function popsicleRatelimited (timeout, unit) {

  if (timeout === undefined || timeout === null) {
    throw new Error('Timeout not set')
  }

  if (unit === undefined || unit == null) {
    throw new Error('Unit not set')
  }

  return function (req) {

    req.after(function (res) {

      return new Promise(function (resolve, reject) {

        // Req or Response not set. Should never happen.
        if (!res) {
          reject(new Error('Could not read response'))
        }

        // Handle rate limit
        if (res.status === StatusCode.RATE_LIMITED) {

          var retryAfter = res.get(Headers.RETRY_AFTER)

          if (retryAfter === undefined || retryAfter === null) {
            reject(new Error('Rate limited: Missing ' + Headers.RETRY_AFTER + ' header'))
          }

          if (retryAfter > _toSeconds(timeout, unit)) {
            reject(new Error('Rate limited: Blocking time higher than timeout'))
          }

          setTimeout(function () {
            req._promise = null
            req.then(function (secondResponse) {
              resolve(secondResponse)
            }, function (error) {
              reject(error)
            })
          }, retryAfter * 1000)

        } else {
          // Not rate limited
          resolve(res)
        }

      })

    })
  }

};

function _toSeconds (value, unit) {
  switch (unit) {
    case popsicleRatelimited.MILLISECOND:
      return (value / 1000)
    case popsicleRatelimited.SECOND:
      return value
  }
}

var StatusCode = {
  RATE_LIMITED: 429
}

var Headers = {
  RETRY_AFTER: 'Retry-After'
}

popsicleRatelimited.MILLISECOND = 1
popsicleRatelimited.SECOND = popsicleRatelimited.MILLISECOND * 1000

module.exports = popsicleRatelimited
