'use client';

import { motion } from 'framer-motion';
import { ReactNode, memo } from 'react';

interface AnimatedWrapperProps {
  children: ReactNode;
  delay?: number;
}

function AnimatedWrapper({ children, delay = 0 }: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}

export default memo(AnimatedWrapper);
