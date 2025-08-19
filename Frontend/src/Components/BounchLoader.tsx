
import React from 'react'
import { motion } from 'motion/react'

interface BounceLoaderProps {
  size?: number
  color?: string
  duration?: number
}

const BounceLoader: React.FC<BounceLoaderProps> = ({
  size = 40,
  color = '#4CAF50',
  duration = 0.8,
}) => {
  const bounceTransition = {
    y: {
      duration: duration,
      repeat: Infinity,
      ease: 'easeOut',
      repeatType: 'reverse' as const,
    },
    backgroundColor: {
      duration: duration,
      repeat: Infinity,
      ease: 'easeOut',
      repeatType: 'reverse' as const,
      repeatDelay: duration / 2,
    },
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-80 backdrop-blur-sm">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: '50%',
            }}
            transition={bounceTransition}
            animate={{
              y: ['0%', '-100%'],
              backgroundColor: [color, `${color}80`],
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BounceLoader
