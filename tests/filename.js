const test = require("ava");

const { filenameFormatter } = require("../lib/img2picture.js");

test("Should generate filename", async (t) => {
  const output = filenameFormatter("abcd", "hello.png", 600, "jpeg");
  t.is("hello-abcd-600w.jpeg", output);
});
