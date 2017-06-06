const path = require("path");
const fs = require("fs");

export default function formatCriticalCSSJson() {
  // Read current JSON invalid content which we need to format them into correct shape
  const filePath = path.resolve(__dirname, "../../public/build/css-map.json");
  const str = fs.readFileSync(filePath, "utf-8")
    // Remove new line at the beginning and at the end
    .trim()
    // Remove last comma
    .slice(0, -1)
    // Escape all new line characters
    .replace(/(?:\r\n|\r|\n)/g, "\\\\n")
    // Escape all double quotes inside CSS String
    .replace(
      /({"module": ".*", "css": ")(.*)("})/g,
      function (match, p1, p2, p3) {
        return p1 + p2.replace(/"/g, "\\\\\"") + p3;
      },
    );

  // Update JSON content with correct format
  fs.writeFileSync(
    filePath,
    `[${str}]`,
  );
}
