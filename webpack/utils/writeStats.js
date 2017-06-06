const fs = require("fs");
const path = require("path");
const flatten = require("lodash/flatten");
const mapValues = require("lodash/mapValues");

const STATS_FILE_PATH = path.resolve(__dirname, "../../public/build/webpack-stats.json");

/**
 * Get assets for a chunk with specific extension
 * @param {String} chunkName
 * @param {String} extension
 * @param {Object} stats
 * @param {String} publicPath
 * @return {Array}
 */
function getChunkAssetsWithExtension(chunkName, extension, stats, publicPath) {
  let chunkAssets = stats.assetsByChunkName[chunkName];

  // a chunk could be a string or an array, so make sure it is an array
  if (!(Array.isArray(chunkAssets))) {
    chunkAssets = [chunkAssets];
  }

  return chunkAssets
    .filter(asset => asset.match(extension) != null) // filter by extension
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
function getChunkAssetsMapWithExtension(extension, stats, publicPath) {
  const { assetsByChunkName } = stats;
  return mapValues(
    assetsByChunkName,
    (_, chunkName) => getChunkAssetsWithExtension(chunkName, extension, stats, publicPath),
  );
}

/**
 * Get a map from each chunk to its list of assets
 * where key is chunk ID
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
function getModuleAssetsMap(stats, publicPath, pattern = "", extension) {
  const { modules } = stats;
  const chunkAssetsMap = getChunkAssetsMap(stats, publicPath);

  return modules.reduce(
    (map, module) => {
      if (module.name.match(pattern) != null) {
        // eslint-disable-next-line no-param-reassign
        map[module.name] = flatten(
          module.chunks.map(chunkId => chunkAssetsMap[chunkId]),
        )
          .filter(asset => {
            if (extension != null) {
              return asset.match(extension) != null;
            }

            return true;
          })
          .filter(asset => asset.match(/\.hot-update\./) == null)
          .filter(
            (asset, i, arr) => arr.indexOf(asset) === i,
          );
      }

      return map;
    },
    {},
  );
}

function getModuleCSSMap(stats) {
  const { modules } = stats;

  /* eslint-disable no-param-reassign */
  return modules.reduce(
    (map, module) => {
      if (module.name.match(/\/components\/.*\/.*\.css/) != null) {
        module.reasons.forEach(reason => {
          const reasonModuleName = reason.moduleName;
          if (reasonModuleName.match(/\/components\/.*\/.*\.js/) != null) {
            if (map[reasonModuleName] == null) {
              map[reasonModuleName] = [];
            }
            map[reasonModuleName].push(module.name);
          }
        });
      }

      return map;
    },
    {},
  );
}

function getTranslationAssetsMap(stats, publicPath) {
  const { assets } = stats;
  return assets.reduce(
    (map, asset) => {
      const { name: assetName } = asset;
      if (assetName.match(/(\.json)$/) != null) {
        const assetNameWithoutExtension = assetName.split(".")[0];
        const locale = assetNameWithoutExtension.split("_")[0];
        // eslint-disable-next-line no-param-reassign
        map[locale] = `${publicPath}${assetName}`;
      }
      return map;
    },
    {},
  );
}

export default function writeStats(statsData) {
  const publicPath = this.options.output.publicPath;
  const stats = statsData.toJson();

  const content = {
    modules: getModuleAssetsMap(stats, publicPath, /^(\.\/src\/components\/.*\/.*\.js)$/, /(\.js)$/),
    moduleCSS: getModuleCSSMap(stats),
    scripts: getChunkAssetsMapWithExtension(/(\.js)$/, stats, publicPath),
    stylesheets: getChunkAssetsMapWithExtension(/(\.css)$/, stats, publicPath),
    translations: getTranslationAssetsMap(stats, publicPath),
  };

  fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(content));
}
