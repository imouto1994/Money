const fs = require("fs");
const path = require("path");

module.exports = class {
  /**
   * Marko component to contain inline scripts for `loadCSS`
   * TODO: Minify & uglify them
   */
  onCreate() {
    this.state = {
      cssRelPreload: fs.readFileSync(
        path.resolve(
          __dirname,
          "../../../node_modules/fg-loadcss/src/cssRelPreload.js"
        )
      ),
      loadCSS: fs.readFileSync(
        path.resolve(
          __dirname,
          "../../../node_modules/fg-loadcss/src/loadCSS.js"
        )
      ),
    };
  }
};
