import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./indexeddb.js", import.meta.url), "utf8");

for (const functionName of [
  "saveWorksheetSession",
  "getWorksheetSession",
  "listWorksheetSessions",
  "deleteWorksheetSession",
  "deleteAllWorksheetSessions",
]) {
  test(`exports ${functionName}`, () => {
    assert.match(source, new RegExp(`export async function ${functionName}\\b`));
  });
}

test("does not upload worksheet answers", () => {
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|sendBeacon/);
});
