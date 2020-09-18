/* eslint-env jest */
const { getDiffPathArray } = require('./getDiffPathArray')

describe('getDiffPathArray', () => {
  const obj1 = {
    a1: {
      a2: {
        a3: 123,
        b3: 456,
        c3: 789,
      },
    },
  };
  const obj1copy = Object.assign({}, obj1);
  const obj2 = {
    a1: {
      a2: {
        a3: 123,
        b3: 456,
        c3: 'different',
      },
    },
  };

  it('returns an empty array if both objects have equal values', () => {
    expect(getDiffPathArray(obj1, obj1)).toEqual([]);
    expect(getDiffPathArray(obj1, obj1copy)).toEqual([]);
    expect(getDiffPathArray(obj1copy, obj1)).toEqual([]);
    expect(getDiffPathArray([], [])).toEqual([]);
    expect(() => getDiffPathArray('foo', 'foo')).toThrow();
  });

  it('returns an Array containing paths to differences for Objects', () => {
    expect(getDiffPathArray(obj1, obj2)).toEqual(['a1.a2.c3']);
    expect(getDiffPathArray(obj1, Object.assign({}, obj1, { b1: 'additional' }))).toEqual(['b1']);
    expect(getDiffPathArray(
      { a1: { b2: [1, 2, 3] } },
      { a1: { b2: [1, 2, 4] } }
    )).toEqual(['a1.b2[3,4]']);
    expect(getDiffPathArray(
      { a1: { b2: [1, 2, 3] } },
      { a1: { b2: 'string' } }
    )).toEqual(['a1.b2']);
    expect(getDiffPathArray(
      { a1: { b2: 'string' } },
      { a1: { b2: [1, 2, 3] } }
    )).toEqual(['a1.b2']);
    expect(getDiffPathArray(
      Object.assign({}, obj1, { b1: false }),
      Object.assign({}, obj1, { b1: true })
    )).toEqual(['b1']);
    expect(getDiffPathArray({
      a1: 123,
      b1: 456,
      c1: 789,
    }, {
      a1: 123,
      new: 'extra',
      b1: 456,
      c1: 789,
    })).toEqual(['new']);
  });

  it('returns an Array containing paths to differences (prefixed)', () => {
    expect(getDiffPathArray(obj1, obj2, 'foo.')).toEqual(['foo.a1.a2.c3']);
  });

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
    };

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
    };
    expect(getDiffPathArray(complexObj1, complexObj2).sort()).toEqual(
      ['a.a1', 'a.b1.b2', 'a.b1.d2[pear]', 'a.b1.e2', 'a.c1', 'b', 'c', 'd']
    );
  });
});