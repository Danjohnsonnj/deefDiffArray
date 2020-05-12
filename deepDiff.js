const isEqual = require('lodash/isEqual')

function getArrayDiff({ newPointer, oldPointer }) {
  const diff = new Set()
  newPointer.forEach((item, index) => {
    if (item !== oldPointer[index]) {
      diff.add(item)
    }
  })
  if (Array.isArray(oldPointer)) {
    oldPointer.forEach((item, index) => {
      if (item !== newPointer[index]) {
        diff.add(item)
      }
    })
  }
  return Array.from(diff)
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
function deepDiff(newObject, oldObject, path = '') {
  if (!isEqual(newObject, oldObject)) {
    const newKeys = Object.keys(newObject)

    const diffArray = newKeys.map((key) => {
      const newPointer = newObject[key]
      const oldPointer = oldObject[key]

      if (newPointer.constructor.name === 'Object') {
        return deepDiff(newPointer, oldPointer, `${path}${key}.`)
      }

      if (Array.isArray(newPointer)) {
        if (isEqual(newPointer, oldPointer)) {
          return null
        }

        const arrayDiff = getArrayDiff({ newPointer, oldPointer })
        return `${path}${key}[${arrayDiff}]`
      }

      if (!isEqual(newPointer, oldPointer)) {
        return `${path}${key}`
      }

      return null
    }).filter((item) => !!item)

    // Collect any paths for missing keys in either Object
    const arrayDiff = getArrayDiff({ newPointer: Object.keys(newObject), oldPointer: Object.keys(oldObject) })
    arrayDiff.forEach((item) => {
      if (diffArray.includes(`${path}${item}`)) {
        return
      }
      diffArray.push(`${path}${item}`)
    })

    return diffArray.flat()
  }
  return []
}

export { deepDiff }