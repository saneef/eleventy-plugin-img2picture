const test = require("ava");

const { isRemoteUrl } = require("./url");

test("isRemoteUrl: should return true for valid URLs", async (t) => {
  t.true(isRemoteUrl("https://example.com"));
  t.true(isRemoteUrl("https://example.com/image.jpeg"));
  t.true(isRemoteUrl("https://example.com/image.jpeg"));
});

test("isRemoteUrl: should return false for invalid URLs", async (t) => {
  t.false(isRemoteUrl("ftp://example.com"));
  t.false(isRemoteUrl("//example.com/image.jpeg"));
  t.false(isRemoteUrl("ssh://example.com/image.jpeg"));
});
