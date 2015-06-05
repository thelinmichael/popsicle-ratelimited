## Popsicle Ratelimited

Popsicle plugin for retrying requests that have been ratelimited.

If the service returns a [Retry-After header](http://tools.ietf.org/html/rfc2616#section-14.37), the request is resent after the amount of time required to wait unless above a given treshold.

### Installation

```
npm install popsicle-ratelimited --save
```

### Usage

```javascript
var request = require('popsicle')
var popsicleRatelimited = require('popsicle-ratelimited')

var ratelimited = popsicleRatelimited(1, popsicleRatelimited.SECOND)

request('/v1/tracks/3FV1zVLMiz3yOmmUGgTlfW')
  .use(ratelimited)
```

### License

MIT