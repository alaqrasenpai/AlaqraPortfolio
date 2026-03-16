"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

const ItemLayout = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      viewport={{ once: true, margin: "-50px" }}
      className={clsx(
        "bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 sm:p-8 rounded-2xl flex items-center justify-center space-y-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default ItemLayout;
