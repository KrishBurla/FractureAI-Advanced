import { motion } from 'framer-motion';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const AnimatedCard = ({ children }) => {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;