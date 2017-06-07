import get from "lodash/get";

let isPreloadSupportedFlag;
/**
 * Check if `preload` link is supported
 * We will use a singleton flag to make sure the logic of checking is only done once
 * @return {Boolean}
 */
export function isPreloadSupported() {
  if (process.env.BROWSER) {
    if (isPreloadSupportedFlag == null) {
      const link = document.createElement("link");
      const supportCheck = get(link, ["relList", "supports"]);
      if (supportCheck != null) {
        isPreloadSupportedFlag = supportCheck("preload");
      } else {
        isPreloadSupportedFlag = false;
      }
    }

    return isPreloadSupportedFlag;
  } else {
    throw new Error(
      "Check for 'preload' support should only be done in browser environment"
    );
  }
}
