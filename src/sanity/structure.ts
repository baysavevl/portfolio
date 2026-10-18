import type {
  ListItemBuilder,
  StructureBuilder,
  StructureResolver
} from "sanity/structure";

type Group = {
  title: string;
  types: Array<{title: string; schemaType: string}>;
};

export const structureGroups: Group[] = [
  {
    title: "Brand",
    types: [
      {title: "Site settings", schemaType: "siteSettings"},
      {title: "Profile", schemaType: "profile"}
    ]
  },
  {
    title: "Writing",
    types: [{title: "Posts", schemaType: "post"}]
  },
  {
    title: "Work",
    types: [{title: "Projects", schemaType: "project"}]
  },
  {
    title: "Résumé",
    types: [
      {title: "Overview and PDF", schemaType: "resumeAsset"},
      {title: "Experience", schemaType: "experience"},
      {title: "Education", schemaType: "education"}
    ]
  },
  {
    title: "Taxonomy",
    types: [{title: "Topics", schemaType: "topic"}]
  }
];

function documentListItem(
  structure: StructureBuilder,
  title: string,
  schemaType: string
): ListItemBuilder {
  return structure
    .listItem()
    .title(title)
    .schemaType(schemaType)
    .child(
      structure
        .documentTypeList(schemaType)
        .title(title)
        .filter('_type == "' + schemaType + '"')
    );
}

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Content")
    .items(
      structureGroups.map((group) =>
        structureBuilder
          .listItem()
          .title(group.title)
          .child(
            structureBuilder
              .list()
              .title(group.title)
              .items(
                group.types.map(({title, schemaType}) =>
                  documentListItem(structureBuilder, title, schemaType)
                )
              )
          )
      )
    );
