import {defineQuery} from "next-sanity";

const TRANSLATION_GROUP = `"translationGroup": coalesce(
  *[_type == "translation.metadata" && references(^._id)][0]._id,
  _id
)`;

const SEO_PROJECTION = `seo {
  title,
  description
}`;

const IMAGE_PROJECTION = `{
  alt,
  caption,
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      },
      lqip
    }
  }
}`;

const BODY_PROJECTION = `body[]{
  _key,
  _type,
  style,
  children[]{
    _key,
    _type,
    text,
    marks
  },
  markDefs[]{
    _key,
    _type,
    href
  }
}`;

const POST_PROJECTION = `{
  _id,
  language,
  ${TRANSLATION_GROUP},
  "slug": slug.current,
  title,
  summary,
  "topics": topics[]->key,
  publishedAt,
  featured,
  isDemo,
  ${BODY_PROJECTION},
  "coverImage": coverImage ${IMAGE_PROJECTION},
  ${SEO_PROJECTION}
}`;

const PROJECT_PROJECTION = `{
  _id,
  language,
  ${TRANSLATION_GROUP},
  "slug": slug.current,
  title,
  summary,
  "topics": topics[]->key,
  context,
  role,
  decisions,
  outcome,
  reflection,
  "media": media[] ${IMAGE_PROJECTION},
  links[]{label, href},
  dateRange,
  sortOrder,
  featured,
  isDemo,
  ${SEO_PROJECTION}
}`;

const SETTINGS_SELECTION = `*[
  _type == "siteSettings" && language == $locale
][0]{
  _id,
  language,
  footerNote,
  socialLinks[]{label, href},
  contactLinks[]{label, href},
  ${SEO_PROJECTION},
  "featuredPost": *[
    _type == "post" &&
    language == $locale &&
    _id == ^.featuredPost._ref
  ][0] ${POST_PROJECTION},
  "featuredProjects": *[
    _type == "project" &&
    language == $locale &&
    _id in ^.featuredProjects[]._ref
  ] | order(sortOrder asc) ${PROJECT_PROJECTION}
}`;

const PROFILE_SELECTION = `*[
  _type == "profile" && language == $locale
][0]{
  _id,
  language,
  name,
  descriptor,
  positioning,
  introduction,
  heroInitialMode,
  currentQuestions,
  principles[]{title, description}
}`;

const TOPICS_SELECTION = `*[
  _type == "topic" && $locale in ["en", "vi"]
] | order(key asc) {
  _id,
  key,
  "label": select($locale == "vi" => labels.vi, labels.en),
  "description": select(
    $locale == "vi" => descriptions.vi,
    descriptions.en
  ),
  accent
}`;

const POSTS_SELECTION = `*[
  _type == "post" && language == $locale
] | order(publishedAt desc) ${POST_PROJECTION}`;

const PROJECTS_SELECTION = `*[
  _type == "project" && language == $locale
] | order(sortOrder asc, title asc) ${PROJECT_PROJECTION}`;

const EXPERIENCE_SELECTION = `*[
  _type == "experience" &&
  language == $locale &&
  visibility == true
] | order(sortOrder asc) {
  _id,
  language,
  organization,
  role,
  location,
  dateRange,
  description,
  achievements
}`;

const EDUCATION_SELECTION = `*[
  _type == "education" &&
  language == $locale &&
  visibility == true
] | order(sortOrder asc) {
  _id,
  language,
  institution,
  program,
  dateRange,
  notes
}`;

const RESUME_ASSET_SELECTION = `*[
  _type == "resumeAsset" && language == $locale
][0]{
  _id,
  language,
  summary,
  capabilities,
  "pdfUrl": pdf.asset->url,
  pdfLabel,
  effectiveDate
}`;

export const SETTINGS_QUERY = defineQuery(SETTINGS_SELECTION);
export const PROFILE_QUERY = defineQuery(PROFILE_SELECTION);
export const TOPICS_QUERY = defineQuery(TOPICS_SELECTION);
export const POSTS_QUERY = defineQuery(POSTS_SELECTION);
export const PROJECTS_QUERY = defineQuery(PROJECTS_SELECTION);
export const EXPERIENCE_QUERY = defineQuery(EXPERIENCE_SELECTION);
export const EDUCATION_QUERY = defineQuery(EDUCATION_SELECTION);
export const RESUME_ASSET_QUERY = defineQuery(RESUME_ASSET_SELECTION);

export const POST_DETAIL_QUERY = defineQuery(`*[
  _type == "post" &&
  language == $locale &&
  slug.current == $slug
][0] ${POST_PROJECTION}`);

export const PROJECT_DETAIL_QUERY = defineQuery(`*[
  _type == "project" &&
  language == $locale &&
  slug.current == $slug
][0] ${PROJECT_PROJECTION}`);

export const TRANSLATED_ROUTE_QUERY = defineQuery(`*[
  _type == "translation.metadata" &&
  _id == $translationGroup
][0]{
  "target": *[
    _id == ^.translations[language == $targetLocale][0].value._ref &&
    _type == $kind &&
    language == $targetLocale
  ][0]{
    _id,
    _type,
    language,
    "slug": slug.current
  }
}.target`);

export const RESUME_QUERY = defineQuery(`{
  "resumeAsset": ${RESUME_ASSET_SELECTION},
  "experience": ${EXPERIENCE_SELECTION},
  "education": ${EDUCATION_SELECTION}
}`);

export const HOME_QUERY = defineQuery(`{
  "settings": ${SETTINGS_SELECTION},
  "profile": ${PROFILE_SELECTION},
  "topics": ${TOPICS_SELECTION},
  "posts": ${POSTS_SELECTION},
  "projects": ${PROJECTS_SELECTION},
  "resumeAsset": ${RESUME_ASSET_SELECTION},
  "experience": ${EXPERIENCE_SELECTION},
  "education": ${EDUCATION_SELECTION}
}`);

const SEARCH_POST_PROJECTION = POST_PROJECTION.replace(
  TRANSLATION_GROUP,
  '"translationGroup": _id'
);
const SEARCH_PROJECT_PROJECTION = PROJECT_PROJECTION.replace(
  TRANSLATION_GROUP,
  '"translationGroup": _id'
);

export const SEARCH_QUERY = defineQuery(`{
  "posts": *[
    _type == "post" && language == $locale
  ] | order(publishedAt desc) ${SEARCH_POST_PROJECTION},
  "projects": *[
    _type == "project" && language == $locale
  ] | order(sortOrder asc, title asc) ${SEARCH_PROJECT_PROJECTION},
  "topics": ${TOPICS_SELECTION}
}`);
