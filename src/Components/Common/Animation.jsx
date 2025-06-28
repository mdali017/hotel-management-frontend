import React from "react";
import { motion } from "framer-motion";

const Animation = ({ direction, delay, children }) => {
  const fadeInVariants = {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 1.5,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

export default Animation;
