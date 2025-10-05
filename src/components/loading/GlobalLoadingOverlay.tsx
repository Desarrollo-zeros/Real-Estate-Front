'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Building2 } from 'lucide-react';

/**
 * Global Loading Overlay
 * Shows a full-screen loading indicator during API requests
 */
export function GlobalLoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black/50 to-black/40 backdrop-blur-md"
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-2xl p-10 border border-gray-200/50 min-w-[280px]"
          >
            {/* Logo + Spinner Combined */}
            <div className="relative">
              {/* Outer spinning ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '4px solid transparent',
                  borderTopColor: '#003366',
                  borderRightColor: '#0099CC',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderBottomColor: '#FFCC00',
                  borderLeftColor: '#0099CC',
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Center icon */}
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003366] to-[#0099CC] rounded-full opacity-10" />
                <Building2 className="h-10 w-10 text-[#003366] relative z-10" strokeWidth={2} />
              </div>
            </div>

            {/* Loading text */}
            <div className="text-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#003366] to-[#0099CC] bg-clip-text text-transparent mb-2">
                Processing
              </h3>
              <p className="text-sm text-gray-600 font-medium">Please wait a moment...</p>
            </div>

            {/* Animated progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#003366] to-[#0099CC]"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
