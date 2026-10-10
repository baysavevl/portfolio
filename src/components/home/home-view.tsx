import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import {CareerPreview} from "@/components/home/career-preview";
import {CurrentQuestions} from "@/components/home/current-questions";
import {Hero} from "@/components/home/hero";
import {LatestFieldNote} from "@/components/home/latest-field-note";
import {Principles} from "@/components/home/principles";
import {SelectedWork} from "@/components/home/selected-work";
import type {HomeData} from "@/lib/content/types";

interface HomeViewProps {
  data: HomeData;
}

export function HomeView({data}: HomeViewProps) {
  const {profile, featuredPost, featuredProjects, resume, topics, settings} =
    data;
  const messages = profile.locale === "vi" ? viMessages : enMessages;

  return (
    <>
      <Hero profile={profile} />
      <LatestFieldNote
        locale={profile.locale}
        heading={messages.home.latestFieldNote}
        emptyMessage={messages.writing.empty}
        readLabelTemplate={messages.home.readArticle}
        post={featuredPost}
        topics={topics}
      />
      <CurrentQuestions
        heading={messages.home.currentQuestions}
        questions={profile.currentQuestions}
      />
      <SelectedWork
        locale={profile.locale}
        heading={messages.home.selectedWork}
        viewLabelTemplate={messages.home.viewProject}
        projects={featuredProjects}
        topics={topics}
      />
      <CareerPreview
        locale={profile.locale}
        heading={messages.home.careerPreview}
        resumeLabel={messages.nav.resume}
        resume={resume}
      />
      <Principles
        heading={messages.home.principles}
        principles={profile.principles}
      />
      {settings.contactLinks.length > 0 ? (
        <section
          id="contact"
          className="home-section home-section--contact section-rule"
          aria-labelledby="contact-title"
        >
          <div className="home-section__heading">
            <h2 id="contact-title">{messages.home.contact}</h2>
          </div>
          <ul>
            {settings.contactLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
