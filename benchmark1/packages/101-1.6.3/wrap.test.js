const wrap = require("./wrap");

describe("wraps to brackets", () => {
  it('for single index', () => {
    expect(wrap(1)).toEqual('[1]');
  });

  it('for array of indexes', () => {
    expect(wrap([1,2,3])).toEqual('[1][2][3]');
  });
});
