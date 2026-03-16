import ProjectList from "@/components/projects";
import { workExperienceList } from "../../data";

export const metadata = {
  title: "Work Experience",
};

export default function WorkExperience() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-24 pb-8 space-y-4 text-center">
        <h1 className="text-4xl xs:text-5xl font-bold text-accent drop-shadow-lg">
          Work Experience
        </h1>
        <p className="text-sm xs:text-base font-light text-foreground/80 max-w-2xl px-4">
          A timeline of my professional journey in software development and technology.
        </p>
      </div>

      <ProjectList projects={workExperienceList} />
    </>
  );
}
