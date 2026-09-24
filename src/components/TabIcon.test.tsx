import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabIcon } from "./TabIcon";

describe("TabIcon", () => {
  it("renders svg for each tab", () => {
    const { container } = render(<TabIcon id="home" active />);
    expect(container.querySelector("svg.tab-icon--active")).toBeTruthy();
  });
});
