const unflatten = require("./unflatten");

test("unflattens object", () => {
  const json = {
    "[0]": 2,
    "[1]": 4,
    "[2][0]": 8,
    "[2][1][0]": 2,
    "[2][1][1][0]": 32,
    "[2][1][1][1]": 64,
    "[2][2]": 7,
    "[3]": 5
  };

  const arr = [2, 4, [8, [2, [32, 64]], 7], 5];

  expect(unflatten(json)).toMatchObject(arr);
});
