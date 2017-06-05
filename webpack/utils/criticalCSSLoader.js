module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable();
  }

  return source
    .replace(
      /(exports\.push\(\[module\.id, )([\s\S.]*)(, ""\]\);)/g,
      function (match, p1, p2, p3) {
        return p1 + "\"{\\\"module\\\": \" + \"\\\"" + this.resourcePath + "\\\"\" + \", \\\"css\\\": \\\"\" + " + p2 + " + \"\\\"},\"" + p3;
      }.bind(this),
    );
};
