import {demoContentRepository} from "@/lib/content/demo/repository";
import type {ContentRepository} from "@/lib/content/repository";

export function getContentRepository(): ContentRepository {
  return demoContentRepository;
}
