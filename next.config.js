site = require("./config/site.js")

module.exports = {
  trailingSlash: true,
  env: {
    TZ: site.timezone,
  },
}
