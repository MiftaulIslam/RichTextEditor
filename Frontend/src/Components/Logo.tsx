import { motion } from 'framer-motion'

interface LogoProps {
  size?: {
    dev_text: number;
    talks_text: number;
  };
  unit?: string; // Default unit hobe rem
}

const Logo = ({ size = { dev_text: 1, talks_text: 2 }, unit = 'rem' }: LogoProps) => {
  // Custom size thakle size calculation howar part
  const baseSize = `${size.dev_text}${unit}`;
  const accentSize = `${size.talks_text}${unit}`;

  // Custom size thakle hover and tap er shomoy scale calculation howar part
  const sizeRatio = size.talks_text / size.dev_text;
  const hoverScale = 1 + (0.02 / sizeRatio);
  const tapScale = 1 - (0.02 / sizeRatio);

  return (
    <motion.div
      className="flex items-center px-4 py-2 rounded-xl select-none"
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
    >
      <span
        className="bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800 font-bold text-transparent"
        style={{ fontSize: baseSize }}
      >
        Dev
      </span>
      <motion.span
        className="bg-clip-text bg-gradient-to-r from-green-600 to-green-500 font-bold text-transparent"
        style={{ fontSize: accentSize }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Talks
      </motion.span>
    </motion.div>
  )
}

export default Logo
