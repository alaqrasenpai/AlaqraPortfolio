"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Focus trap / escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project]);

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const hasImages = project.images && project.images.length > 0;
  const images = hasImages ? project.images : [project.image].filter(Boolean);

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-background/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-accent hover:text-white text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left/Top: Image Carousel */}
          <div className="relative w-full md:w-[55%] h-64 sm:h-80 md:h-auto bg-black flex items-center justify-center overflow-hidden">
            {images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                      fill
                      className="object-contain" // Use object-contain to not crop project screenshots
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 p-2 bg-black/50 hover:bg-accent text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 p-2 bg-black/50 hover:bg-accent text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? "bg-accent w-6" : "bg-white/50 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <span className="text-white/50">No images available</span>
            )}
          </div>

          {/* Right/Bottom: Project Details */}
          <div className="w-full md:w-[45%] p-6 sm:p-8 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-accent mb-2">{project.name}</h2>
            <div className="flex items-center space-x-4 mb-6">
              {project.date && (
                <span className="text-sm px-3 py-1 bg-white/5 rounded-full border border-white/10 text-foreground/80">
                  {new Date(project.date).getFullYear()}
                </span>
              )}
              {project.demoLink && project.demoLink !== "#" && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm font-medium text-white hover:text-accent transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            
            <div className="prose prose-invert prose-p:text-foreground/80 prose-p:font-light prose-p:leading-relaxed max-w-none">
              <p>{project.fullDescription || project.description}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
