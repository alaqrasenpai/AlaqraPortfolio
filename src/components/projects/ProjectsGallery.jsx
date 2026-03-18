"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ProjectModal from "./ProjectModal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const ProjectsGallery = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-7xl px-4 mx-auto lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={item}
            onClick={() => setSelectedProject(project)}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-background/40 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
          >
            {/* Project Image */}
            <div className="relative w-full aspect-video overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span className="text-foreground/50 text-sm">No Image Provided</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
            </div>

            {/* Project Content */}
            <div className="flex flex-col flex-1 p-6 relative">
              <h2 className="text-xl font-bold text-accent mb-3 group-hover:text-white transition-colors">
                {project.name}
              </h2>
              <p className="text-foreground/80 text-sm font-light leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                {project.date && (
                  <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10 text-foreground/70">
                    {new Date(project.date).getFullYear()}
                  </span>
                )}

                {project.demoLink && project.demoLink !== "#" ? (
                  <Link
                    href={project.demoLink}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-2 text-accent hover:text-white hover:underline transition-all text-sm font-medium z-10"
                  >
                    <span>View Demo</span>
                    <ExternalLink size={16} />
                  </Link>
                ) : (
                  // <span className="text-sm text-foreground/40 italic">Coming Soon</span>
                  <span className="text-sm text-foreground/40 italic"></span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Render the modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectsGallery;
