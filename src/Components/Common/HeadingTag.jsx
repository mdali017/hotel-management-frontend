import { fadeIn } from "../../variants";
import { motion } from "framer-motion";
const HeadingTag = ({ text }) => {
  return (
    <>
      <motion.div
        variants={fadeIn("up")}
        initial="hidden"
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileInView={"show"}
        viewport={{ once: true, amount: 0.7 }}
        className="my-6 relative z-0"
      >
        <div className="border-2 border-[var(--primary)] w-16 mx-auto" />
        <div className="text-center text-[var(--secondary)] uppercase text-3xl mt-3 font-semibold font-[raleway] tracking-wider">
          {text}
        </div>
      </motion.div>
    </>
  );
};

export default HeadingTag;
