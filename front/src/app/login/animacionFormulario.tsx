import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimacionFormularioProps {
  isVisible: boolean;
  children: React.ReactNode;
}

const AnimacionFormulario: React.FC<AnimacionFormularioProps> = ({ isVisible, children }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimacionFormulario;