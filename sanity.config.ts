"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  name: "default",
  title: "Line Tech",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("product").title("Products"),
            S.divider(),
            S.listItem()
              .title("Category Showcases")
              .child(
                S.document()
                  .schemaType("categoryShowcase")
                  .documentId("category-showcases"),
              ),
          ]),
    }),
    internationalizedArray({
      languages: [
        { id: "ko", title: "한국어" },
        { id: "en", title: "English" },
        { id: "zh", title: "中文" },
      ],
      defaultLanguages: ["ko", "en", "zh"],
      fieldTypes: ["string"],
    }),
  ],
  schema: { types: schemaTypes },
});
