site = require("./config/site.js")

module.exports = {
  output: "export",
  trailingSlash: true,
  env: {
    TZ: site.timezone,
  },
}
