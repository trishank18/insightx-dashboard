import test from "node:test";
import assert from "node:assert/strict";
import { loadWorkspaceSettings, saveWorkspaceSettings } from "../src/services/preferences.js";

function createStorage(initial = null) {
  let value = initial;
  return {
    getItem(key) { assert.equal(key, "insightx-settings"); return value; },
    setItem(key, nextValue) { assert.equal(key, "insightx-settings"); value = nextValue; },
    read() { return value; }
  };
}

test("settings default safely for empty, malformed, and invalid stored values", () => {
  const defaults = { workspaceName: "Acme Inc.", timezone: "UTC", weeklyDigest: true };
  assert.deepEqual(loadWorkspaceSettings(createStorage()), defaults);
  assert.deepEqual(loadWorkspaceSettings(createStorage("not json")), defaults);
  assert.deepEqual(loadWorkspaceSettings(createStorage(JSON.stringify({ workspaceName: " ", timezone: "Mars/Phobos", weeklyDigest: "yes" }))), defaults);
});

test("settings save normalized values and reload persisted checkbox and timezone selections", () => {
  const storage = createStorage();
  const saved = saveWorkspaceSettings({ workspaceName: "  QA Workspace  ", timezone: "America/New_York", weeklyDigest: false }, storage);
  assert.deepEqual(saved, { workspaceName: "QA Workspace", timezone: "America/New_York", weeklyDigest: false });
  assert.deepEqual(loadWorkspaceSettings(storage), saved);
});

test("settings reject blank or overlong names, unsupported timezones, and non-boolean toggles", () => {
  const storage = createStorage();
  const valid = { workspaceName: "Workspace", timezone: "UTC", weeklyDigest: true };
  assert.throws(() => saveWorkspaceSettings({ ...valid, workspaceName: "   " }, storage), /Workspace name/);
  assert.throws(() => saveWorkspaceSettings({ ...valid, workspaceName: "x".repeat(81) }, storage), /Workspace name/);
  assert.throws(() => saveWorkspaceSettings({ ...valid, timezone: "Invalid/Zone" }, storage), /timezone/);
  assert.throws(() => saveWorkspaceSettings({ ...valid, weeklyDigest: "false" }, storage), /Weekly digest/);
});
