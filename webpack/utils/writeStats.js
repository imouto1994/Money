const fs = require("fs");
const path = require("path");
const flatten = require("lodash/flatten");
const mapValues = require("lodash/mapValues");

const STATS_FILE_PATH = path.resolve(__dirname, "../../src/server/config/webpack-stats.json");

/**
 * Get assets for a chunk with specific extension
 * @param {String} chunkName
 * @param {String} extension
 * @param {Object} stats
 * @param {String} publicPath
 * @return {Array}
 */
function getChunkAssetsWithExtension(chunkName, extension = "js", stats, publicPath) {
  let chunkAssets = stats.assetsByChunkName[chunkName];

  // a chunk could be a string or an array, so make sure it is an array
  if (!(Array.isArray(chunkAssets))) {
    chunkAssets = [chunkAssets];
  }

  return chunkAssets
    .filter(asset => path.extname(asset) === `.${extension}`) // filter by extension
    .map(asset => `${publicPath}${asset}`); // add public path to it
}

/**
 * Get map from each chunk to its list of assets with specific extension
 * This map will only contain those chunks with specified chunk name
 * @param {String} extension
 * @param {Object} stats
 * @param {String} publicPath
 * @return {Object}
 */
function getChunkAssetsMapWithExtension(extension = "js", stats, publicPath) {
  const { assetsByChunkName } = stats;
  return mapValues(
    assetsByChunkName,
    (_, chunkName) => getChunkAssetsWithExtension(chunkName, extension, stats, publicPath),
  );
}

/**
 * Get a map from each chunk to its list of assets
 * @param {Object} stats
 * @param {String} publicPath [description]
 * @return {Object}
 */
function getChunkAssetsMap(stats, publicPath) {
  const { chunks } = stats;
  return chunks.reduce(
    (map, chunk) => {
      // eslint-disable-next-line no-param-reassign
      map[chunk.id] = chunk.files.map(file => `${publicPath}${file}`);
      return map;
    },
    {},
  );
}

/**
 * Get a map from each module to its list of related chunk assets
 * @param {Object} stats
 * @param {String} publicPath
 * @return {Object}
 */
function getModuleAssetsMap(stats, publicPath) {
  const { modules } = stats;
  const chunkAssetsMap = getChunkAssetsMap(stats, publicPath);

  return modules.reduce(
    (map, module) => {
      // eslint-disable-next-line no-param-reassign
      map[module.name] = flatten(module.chunks.map(chunkId => chunkAssetsMap[chunkId])).filter(
        (asset, i, arr) => arr.indexOf(asset) === i,
      );
      return map;
    },
    {},
  );
}

export default function writeStats(stats) {
  const publicPath = this.options.output.publicPath;
  const json = stats.toJson();
  const modules = getModuleAssetsMap(json, publicPath);

  const content = {
    modules,
    js: getChunkAssetsMapWithExtension("js", json, publicPath),
    stylesheets: getChunkAssetsMapWithExtension("css", json, publicPath),
  };

  fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(content));
}
