const STORAGE_KEY = "insightx-settings";
const DEFAULTS = Object.freeze({ workspaceName: "Acme Inc.", timezone: "UTC", weeklyDigest: true });
const TIMEZONES = new Set(["UTC", "America/New_York", "Europe/London"]);

export function loadWorkspaceSettings(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const stored = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return { ...DEFAULTS };
    return {
      workspaceName: typeof stored.workspaceName === "string" && stored.workspaceName.trim()
        ? stored.workspaceName.trim().slice(0, 80)
        : DEFAULTS.workspaceName,
      timezone: TIMEZONES.has(stored.timezone) ? stored.timezone : DEFAULTS.timezone,
      weeklyDigest: typeof stored.weeklyDigest === "boolean" ? stored.weeklyDigest : DEFAULTS.weeklyDigest
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveWorkspaceSettings(settings, storage = globalThis.localStorage) {
  const workspaceName = typeof settings.workspaceName === "string" ? settings.workspaceName.trim() : "";
  if (!workspaceName || workspaceName.length > 80) throw new TypeError("Workspace name must contain 1 to 80 characters.");
  if (!TIMEZONES.has(settings.timezone)) throw new TypeError("Choose a supported timezone.");
  if (typeof settings.weeklyDigest !== "boolean") throw new TypeError("Weekly digest must be enabled or disabled.");

  const normalized = { workspaceName, timezone: settings.timezone, weeklyDigest: settings.weeklyDigest };
  storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}
