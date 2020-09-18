const isEqual = require('lodash/isEqual')


function isObject (test) {
  return test &&
    test.constructor &&
    test.constructor.name === 'Object';
}

function isSameType (newPointer, oldPointer) {
  return (
    (Array.isArray(newPointer) && Array.isArray(oldPointer)) ||
    (isObject(newPointer) && isObject(oldPointer)) ||
    ((typeof newPointer === 'string') && (typeof oldPointer === 'string')) ||
    (!isNaN(newPointer) && !isNaN(oldPointer))
  );
}

/**
 * Return an Array of differences between two Arrays
 */
function getArrayDiff ({ newPointer, oldPointer }) {
  const diff = new Set();
  newPointer.forEach((item) => {
    if (!oldPointer.includes(item)) {
      diff.add(item);
    }
  });
  if (Array.isArray(oldPointer)) {
    oldPointer.forEach((item) => {
      if (!newPointer.includes(item)) {
        diff.add(item);
      }
    });
  }
  return Array.from(diff);
}

/**
 * A util that returns an Array containing the paths to diffs between two objects.
 *
 * @param {Object} newObject
 * @param {Object} oldObject
 * @param {number} path - A path to prepend to the diff path results.
 *
 * @return {Array} - An Array of strings of paths to the differences between the Objects.
 */
function getDiffPathArray (newObject, oldObject, path = '') {
  if (typeof newObject !== 'object' || typeof oldObject !== 'object') {
    throw new Error(`${getDiffPathArray.name} parameters must be Arrays or Objects, received: ${newObject} and ${oldObject}`);
  }
  if (!isEqual(newObject, oldObject)) {

    if (Array.isArray(newObject) && Array.isArray(oldObject)) {
      return getArrayDiff({ newPointer: newObject, oldPointer: oldObject });
    }

    const newKeys = Object.keys(newObject);

    const diffArray = newKeys.map((key) => {
      const newPointer = newObject[key];
      const oldPointer = oldObject[key];

      if (!isSameType(newPointer, oldPointer)) {
        return `${path}${key}`;
      }

      if (isObject(newPointer) && isObject(oldPointer)) {
        return getDiffPathArray(newPointer, oldPointer, `${path}${key}.`);
      }

      if (Array.isArray(newPointer)) {
        if (isEqual(newPointer, oldPointer)) {
          return null;
        }

        const arrayDiff = getArrayDiff({ newPointer, oldPointer });
        return `${path}${key}[${arrayDiff}]`;
      }

      if (!isEqual(newPointer, oldPointer)) {
        return `${path}${key}`;
      }

      return null;
    }).filter((item) => !!item);

    // Collect any paths for missing keys in either Object
    const arrayDiff = getArrayDiff({ newPointer: Object.keys(newObject), oldPointer: Object.keys(oldObject) });
    arrayDiff.forEach((item) => {
      if (diffArray.includes(`${path}${item}`)) {
        return;
      }
      diffArray.push(`${path}${item}`);
    });

    return diffArray.flat();
  }
  return [];
}

export { getDiffPathArray }