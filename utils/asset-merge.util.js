/**
* Merges source object properties into target.
* @param {Object} target Target object.
* @param {Object} source Source object.
* @returns {Object}
*/
export function smartMerge(target, source) {
    if (!source || typeof source !== "object") return target || {};
    if (!target || typeof target !== "object") target = {};
    for (const [key, value] of Object.entries(source)) {
        mergeEntry(target, key, value);
    }
    return target;
}

/**
* Merges a single entry into the target object.
* @param {Object} target Target object.
* @param {string} key Entry key.
* @param {*} value Entry value.
*/
function mergeEntry(target, key, value) {
    const isSheet =
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.type === "sheet";
    if (isSheet) {
        target[key] = value;
        return;
    }
    mergeNonSheet(target, key, value);
}

/**
* Merges a non-sheet value into the target object.
* @param {Object} target Target object.
* @param {string} key Entry key.
* @param {*} value Entry value.
*/
function mergeNonSheet(target, key, value) {
    const isObject =
        value &&
        typeof value === "object" &&
        !Array.isArray(value);
    if (isObject) {
        if (!target[key] || typeof target[key] !== "object") {
            target[key] = {};
        }
        smartMerge(target[key], value);
    } else {
        target[key] = value;
    }
}