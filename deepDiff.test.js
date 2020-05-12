/* eslint-env jest */
const { deepDiff } = require('./deepDiff')

describe('deepDiff', () => {
  const obj1 = {
    a1: {
      a2: {
        a3: 123,
        b3: 456,
        c3: 789,
      },
    },
  }
  const obj1copy = Object.assign({}, obj1)
  const obj2 = {
    a1: {
      a2: {
        a3: 123,
        b3: 456,
        c3: 'different',
      },
    },
  }

  const complexObj1 = {
    a: {
      a1: 'foo',
      b1: {
        a2: 1,
        b2: 2,
        c2: ['fee', 'fi', 'fo'],
        d2: ['apple, orange']
      }
    },
    b: 'baz'
  }
  
  const complexObj2 = {
    a: {
      a1: 'bar',
      b1: {
        a2: 1,
        b2: 3,
        c2: ['fee', 'fi', 'fo'],
        d2: ['apple, orange', 'pear'],
        e2: 'extra'
      }
    },
    b: 'bop',
    c: 'extra'
  }
  

  it('returns an empty array if both objects have equal values', () => {
    expect(deepDiff(obj1, obj1copy)).toHaveLength(0)
    expect(deepDiff(obj1copy, obj1)).toHaveLength(0)
  })

  it('returns an Array containing paths to differences', () => {
    expect(deepDiff(obj1, obj2)).toEqual(['a1.a2.c3'])
    expect(deepDiff(obj1, Object.assign({ b1: 'additional' }, obj1))).toEqual(['b1'])
    expect(deepDiff(
      { a1: { b2: [1, 2, 3] } },
      { a1: { b2: [1, 2, 4] } }
    )).toEqual(['a1.b2[3,4]'])
    expect(deepDiff(complexObj1, complexObj2)).toEqual(['a.a1', 'a.b1.b2', 'a.b1.d2[pear]', 'a.b1.e2', 'b', 'c'])
  })
})
