import { motion } from "framer-motion";
import Link from "next/link";

const item = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};

const ProjectLink = motion(Link);
const ProjectLayout = ({ name, description, date, demoLink }) => {
  const isLink = demoLink && demoLink !== "#";

  const content = (
    <>
      <div className="flex items-center justify-center space-x-2">
        <h2 className="text-foreground">{name}</h2>
        <p className="text-muted hidden sm:inline-block">{description}</p>
      </div>
      <div className="self-end flex-1 mx-2 mb-1 bg-transparent border-b border-dashed border-muted" />
      <p className="text-muted sm:text-foreground">
        {date ? new Date(date).toDateString() : ""}
      </p>
    </>
  );

  if (isLink) {
    return (
      <ProjectLink
        variants={item}
        href={demoLink}
        target={"_blank"}
        className="text-sm md:text-base flex items-center justify-between w-full relative rounded-lg overflow-hidden p-4 md:p-6 custom-bg"
      >
        {content}
      </ProjectLink>
    );
  }

  return (
    <motion.div
      variants={item}
      className="text-sm md:text-base flex items-center justify-between w-full relative rounded-lg overflow-hidden p-4 md:p-6 custom-bg cursor-default"
    >
      {content}
    </motion.div>
  );
};

export default ProjectLayout;
