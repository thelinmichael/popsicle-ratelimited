function popsicleRatelimited () {

  return function (req) {
    req.after(function () {
      return true
    })
  }

};

popsicleRatelimited.SECOND = 1000
popsicleRatelimited.MINUTE = popsicleRatelimited.SECOND * 60
popsicleRatelimited.HOUR = popsicleRatelimited.MINUTE * 60
popsicleRatelimited.DAY = popsicleRatelimited.HOUR * 24
popsicleRatelimited.WEEK = popsicleRatelimited.DAY * 7

module.exports = popsicleRatelimited
