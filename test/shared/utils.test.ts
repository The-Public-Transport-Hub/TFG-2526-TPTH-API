import { describe, expect, it } from "bun:test";
import { getCurrentMonth } from "../../src/shared/utils/date";
import { escapeRegex } from "../../src/shared/utils/regex";

describe("shared utils", () => {
  it("escapes regular expression special characters", () => {
    expect(escapeRegex("L1. (Tincer)?")).toBe("L1\\. \\(Tincer\\)\\?");
    expect(escapeRegex("[108]+")).toBe("\\[108\\]\\+");
  });

  it("returns the current month in ISO year-month format", () => {
    expect(getCurrentMonth()).toMatch(/^\d{4}-\d{2}$/);
  });
});
