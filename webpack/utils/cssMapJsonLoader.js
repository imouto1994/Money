// Loader to be used with ExtractTextWebpackPlugin to retrieve CSS map for each module
module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }

  return source
    // Format the module export source into JSON format with 2 fields "module" & "css"
    .replace(
      /(exports\.push\(\[module\.id, )([\s\S.]*)(, ""\]\);)/g,
      (match, p1, p2, p3) => {
        return p1 + "\"{\\\"module\\\": \" + \"\\\"" + this.resourcePath + "\\\"\" + \", \\\"css\\\": \\\"\" + " + p2 + " + \"\\\"},\"" + p3;
      },
    );
};
