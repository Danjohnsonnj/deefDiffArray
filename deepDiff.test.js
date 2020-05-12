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

  it('returns an empty array if both objects have equal values', () => {
    expect(deepDiff(obj1, obj1copy)).toHaveLength(0)
    expect(deepDiff(obj1copy, obj1)).toHaveLength(0)
  })

  it('returns an Array containing paths to differences', () => {
    expect(deepDiff(obj1, obj2)).toEqual(['a1.a2.c3'])
    expect(deepDiff(obj1, Object.assign({}, obj1, { b1: 'additional' }))).toEqual(['b1'])
    expect(deepDiff(
      { a1: { b2: [1, 2, 3] } },
      { a1: { b2: [1, 2, 4] } }
    )).toEqual(['a1.b2[3,4]'])
  })

  it('returns an Array containing paths to differences (prefixed)', () => {
    expect(deepDiff(obj1, obj2, 'foo.')).toEqual(['foo.a1.a2.c3'])
  })

  it('returns an Array containing paths to differences (complex objects)', () => {
    const complexObj1 = {
      a: {
        a1: 'foo',
        b1: {
          a2: 1,
          b2: 2,
          c2: ['fee', 'fi', 'fo'],
          d2: ['apple, orange'],
        },
        c1: 'extra',
      },
      b: 'baz',
      d: 'removed',
    }

    const complexObj2 = {
      a: {
        a1: 'bar',
        b1: {
          a2: 1,
          b2: 3,
          c2: ['fee', 'fi', 'fo'],
          d2: ['apple, orange', 'pear'],
          e2: 'extra',
        },
      },
      b: 'bop',
      c: 'extra',
    }
    expect(deepDiff(complexObj1, complexObj2).sort()).toEqual(
      ['a.a1', 'a.b1.b2', 'a.b1.d2[pear]', 'a.b1.e2', 'a.c1', 'b', 'c', 'd']
    )
  })
})
