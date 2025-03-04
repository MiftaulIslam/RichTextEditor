
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowDown } from 'lucide-react'

export default function Alert() {
  const [isHovered, setIsHovered] = useState(false)

  return (
      <div className="relative">
        <motion.div
          className="text-red-500 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <AlertCircle size={20} />
          </motion.div>
          <motion.div
          className={`${isHovered ? " ": "hidden"}`}
          >
          <p className="flex justify-center"><ArrowDown size={15}/></p>

          </motion.div>
          
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute -left-32 w-[300px] mt-2 px-4 py-2 bg-white text-gray-800 text-sm rounded-lg shadow-lg"
            >
              <p className=" text-gray-500 text-xs break-words whitespace-normal">Please complete the verification process to use the platform to its full potential.</p>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
  )
}

