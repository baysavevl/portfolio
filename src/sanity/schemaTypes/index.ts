import {educationType} from "@/sanity/schemaTypes/documents/education";
import {experienceType} from "@/sanity/schemaTypes/documents/experience";
import {postType} from "@/sanity/schemaTypes/documents/post";
import {profileType} from "@/sanity/schemaTypes/documents/profile";
import {projectType} from "@/sanity/schemaTypes/documents/project";
import {resumeAssetType} from "@/sanity/schemaTypes/documents/resume-asset";
import {siteSettingsType} from "@/sanity/schemaTypes/documents/site-settings";
import {topicType} from "@/sanity/schemaTypes/documents/topic";
import {articleBodyType} from "@/sanity/schemaTypes/objects/article-body";
import {imageWithAltType} from "@/sanity/schemaTypes/objects/image-with-alt";
import {seoType} from "@/sanity/schemaTypes/objects/seo";

export const schemaTypes = [
  seoType,
  imageWithAltType,
  articleBodyType,
  siteSettingsType,
  profileType,
  topicType,
  postType,
  projectType,
  experienceType,
  educationType,
  resumeAssetType
];
