const fs = require("fs");
const path = require("path");
const flatten = require("lodash/flatten");
const mapValues = require("lodash/mapValues");

const STATS_FILE_PATH = path.resolve(__dirname, "../../src/server/config/webpack-stats.json");

/**
 * [getChunkAssets description]
 * @param {[type]} chunkName [description]
 * @param {String} extension [description]
 * @param {[type]} stats [description]
 * @param {[type]} publicPath [description]
 * @return {[type]} [description]
 */
function getChunkAssets(chunkName, extension = "js", stats, publicPath) {
  let chunkAssets = stats.assetsByChunkName[chunkName];

  // a chunk could be a string or an array, so make sure it is an array
  if (!(Array.isArray(chunkAssets))) {
    chunkAssets = [chunkAssets];
  }

  return chunkAssets
    .filter(asset => path.extname(asset) === `.${extension}`) // filter by extension
    .map(asset => `${publicPath}${asset}`); // add public path to it
}

/* eslint-disable no-param-reassign */
/**
 * [getModuleFilesMap description]
 * @param {[type]} stats [description]
 * @param {[type]} publicPath [description]
 * @return {[type]} [description]
 */
function getModuleFilesMap(stats, publicPath) {
  const { modules, chunks } = stats;
  const chunkFilesMap = chunks.reduce(
    (map, chunk) => {
      map[chunk.id] = chunk.files.map(file => `${publicPath}${file}`);
      return map;
    },
    {},
  );

  return modules.reduce(
    (map, module) => {
      map[module.name] = flatten(
        module.chunks.map(chunkId => chunkFilesMap[chunkId]),
      );
      return map;
    },
    {},
  );
}
/* eslint-enable no-param-reassign */

export default function writeStats(stats) {
  const publicPath = this.options.output.publicPath;
  const json = stats.toJson();
  const modules = getModuleFilesMap(json, publicPath);

  const content = {
    modules,
    js: mapValues(json.assetsByChunkName, value => `${publicPath}${value}`),
    stylesheets: getChunkAssets("main", "css", json, publicPath),
  };

  fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(content));
}
