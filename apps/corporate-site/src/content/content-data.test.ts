import { describe, expect, it } from "vitest";

import { businessContent } from "./business.js";
import categoryMakers from "./category-makers.json";
import { companyProfile } from "./company.js";
import { contactInfo } from "./contact.js";
import { heroContent } from "./hero.js";
import productCategories from "./product-categories.json";
import { servicePillars } from "./services.js";
import {
  companyProfileSource,
  manufacturersSource,
} from "./source-references.js";

describe("corporate site content data", () => {
  it("keeps product categories and makers aligned as one source", () => {
    const categoryIds = new Set(
      productCategories.map((category) => category.id),
    );
    const makerCategoryIds = new Set(
      categoryMakers.map((category) => category.categoryId),
    );

    expect(productCategories).toHaveLength(18);
    expect(categoryMakers).toHaveLength(18);
    expect(makerCategoryIds).toEqual(categoryIds);
    expect(categoryMakers.flatMap((category) => category.makers).length).toBe(
      323,
    );
  });

  it("records source references on all content groups", () => {
    const singletonSources = [
      heroContent,
      businessContent,
      companyProfile,
      contactInfo,
      ...servicePillars,
    ].flatMap((content) => content.sourceReferences);

    expect(
      singletonSources.every((source) => source === companyProfileSource),
    ).toBe(true);
    expect(
      productCategories.every((category) =>
        category.sourceReferences.includes(companyProfileSource),
      ),
    ).toBe(true);
    expect(
      categoryMakers.every(
        (category) =>
          category.sourceReferences.includes(companyProfileSource) &&
          category.sourceReferences.includes(manufacturersSource),
      ),
    ).toBe(true);
  });
});
