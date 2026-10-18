import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {CaseStudyView} from "@/components/work/case-study-view";
import {demoContentRepository} from "@/lib/content/demo/repository";
import {resolveLocaleSwitch} from "@/lib/content/translation";

describe("CaseStudyView", () => {
  it("renders every structured case-study section in the active locale", async () => {
    const project = await demoContentRepository.getProject(
      "vi",
      "nhat-ky-quyet-dinh"
    );
    const topics = await demoContentRepository.getTopics("vi");

    expect(project).not.toBeNull();
    if (!project) return;

    render(
      <CaseStudyView
        locale="vi"
        project={project}
        topics={topics}
        localeSwitchTarget={resolveLocaleSwitch({
          currentLocale: "vi",
          section: "work",
          topics: project.topics,
          translatedRoute: {
            locale: "en",
            href: "/en/work/decision-journal"
          }
        })}
      />
    );

    for (const heading of [
      "Bối cảnh",
      "Vai trò",
      "Quyết định chính",
      "Kết quả",
      "Suy ngẫm"
    ]) {
      expect(screen.getByRole("heading", {name: heading})).toBeInTheDocument();
    }
  });
});
