const test = require("ava");

const { removeObjectProperties } = require("./object");

test("removeObjectProperties: should remove name and age properties from object", async (t) => {
  const obj = {
    name: "Jane Doe",
    age: 20,
    height: 165,
  };

  const res = removeObjectProperties(obj, ["name", "age"]);
  t.deepEqual(res, { height: 165 });
});
