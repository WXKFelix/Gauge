import { describe, expect, it } from "vitest";
import { DEFAULT_FOCUS_AREAS, toggleFocusArea } from "./user-focus";

describe("user-focus", () => {
  it("toggles focus area on and off", () => {
    const on = toggleFocusArea(DEFAULT_FOCUS_AREAS, "health");
    expect(on).toContain("health");
    const off = toggleFocusArea(on, "health");
    expect(off).not.toContain("health");
  });

  it("keeps at least one focus area", () => {
    let areas = DEFAULT_FOCUS_AREAS;
    for (const id of [...areas]) {
      areas = toggleFocusArea(areas, id);
    }
    expect(areas.length).toBeGreaterThan(0);
  });
});
