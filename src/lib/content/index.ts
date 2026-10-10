import {demoContentRepository} from "@/lib/content/demo/repository";
import type {ContentRepository} from "@/lib/content/repository";
import {getContentSource} from "@/lib/content/source";
import {
  publishedSanityContentRepository,
  sanityContentRepository
} from "@/sanity/lib/repository";

export function getContentRepository(): ContentRepository {
  return getContentSource() === "sanity"
    ? sanityContentRepository
    : demoContentRepository;
}

export function getPublishedContentRepository(): ContentRepository {
  return getContentSource() === "sanity"
    ? publishedSanityContentRepository
    : demoContentRepository;
}
