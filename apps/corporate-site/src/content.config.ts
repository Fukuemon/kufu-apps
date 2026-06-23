import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const sourceReferenceSchema = z.array(z.string().min(1)).min(1);

const productCategories = defineCollection({
  loader: file("./src/content/product-categories.json"),
  schema: z.object({
    id: z.string().min(1),
    order: z.number().int().positive(),
    name: z.string().min(1),
    summary: z.string().min(1),
    sourceReferences: sourceReferenceSchema,
  }),
});

const categoryMakers = defineCollection({
  loader: file("./src/content/category-makers.json"),
  schema: z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    order: z.number().int().positive(),
    categoryName: z.string().min(1),
    makers: z.array(z.string().min(1)).min(1),
    sourceReferences: sourceReferenceSchema,
  }),
});

export const collections = {
  productCategories,
  categoryMakers,
};
