import { describe, expect, it } from "bun:test";
import { querySchema, searchQuerySchema } from "../../src/shared/http/schemas/query.schema";

describe("query contracts", () => {
  it("coerces page query params into numbers", () => {
    const result = querySchema.parse({
      page: "3",
      q: "108",
    });

    expect(result).toEqual({
      page: 3,
      q: "108",
    });
  });

  it("defaults page to one when it is not provided", () => {
    const result = querySchema.parse({});

    expect(result).toEqual({
      page: 1,
    });
  });

  it("rejects invalid page numbers", () => {
    const result = querySchema.safeParse({
      page: "0",
    });

    expect(result.success).toBe(false);
  });

  it("accepts optional search-only query params", () => {
    const result = searchQuerySchema.safeParse({
      q: "trinidad",
    });

    expect(result.success).toBe(true);
  });
});
