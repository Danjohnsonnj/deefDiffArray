const isEqual = require('lodash/isEqual')

function deepDiff(o1, o2, path = '') {
  if (!isEqual(o1, o2)) {
    const keys1 = Object.keys(o1)
    const keys2 = Object.keys(o2)

    const diffArray = keys1.map((key) => {
      const pointer1 = o1[key]
      const pointer2 = o2[key]

      if (!pointer2) {
        return `${path}${key}`
      }

      if (pointer1.constructor.name === 'Object') {
        return deepDiff(pointer1, pointer2, `${path}${key}.`)
      }

      if (Array.isArray(pointer1)) {
        if (isEqual(pointer1, pointer2)) {
          return null
        }

        const diff = new Set()
        pointer1.forEach((item, index) => {
          if (item !== pointer2[index]) {
            diff.add(item)
          }
        })
        if (Array.isArray(pointer2)) {
          pointer2.forEach((item, index) => {
            if (item !== pointer1[index]) {
              diff.add(item)
            }
          })
        }
        return `${path}${key}[${Array.from(diff)}]`
      }

      if (!isEqual(pointer1, pointer2)) {
        return `${path}${key}`
      }

      return null
    }).filter(item => !!item)

    if (keys1.length < keys2.length) {
      const diff = keys2.filter((item, index) => {
        return !o1[item]
      })
      diffArray.push(`${path}${diff}`)
    }
  

    return diffArray.flat()
  }
  return []
}

export { deepDiff }