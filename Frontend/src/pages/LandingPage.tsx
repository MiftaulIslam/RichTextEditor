import { Button } from '@/Components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import  { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
const AnimatedBackground =()=>{
    return(
      <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className="absolute top-0 left-0 w-full h-full box-border block"
    >
      <defs>
        <linearGradient id="bg">
          <stop offset="0%" style={{ stopColor: "rgba(130, 158, 249, 0.06)" }}></stop>
          <stop offset="50%" style={{ stopColor: "rgba(76, 190, 255, 0.6)" }}></stop>
          <stop offset="100%" style={{ stopColor: "rgba(115, 209, 72, 0.2)" }}></stop>
        </linearGradient>
        <path
          id="wave"
          fill="url(#bg)"
          d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
        />
      </defs>
      <g>
        <use xlinkHref="#wave" opacity=".3">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            dur="10s"
            calcMode="spline"
            values="270 230; -334 180; 270 230"
            keyTimes="0; .5; 1"
            keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
            repeatCount="indefinite"
          />
        </use>
        <use xlinkHref="#wave" opacity=".6">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            dur="8s"
            calcMode="spline"
            values="-270 230;243 220;-270 230"
            keyTimes="0; .6; 1"
            keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
            repeatCount="indefinite"
          />
        </use>
        <use xlinkHref="#wave" opacity=".9">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            dur="6s"
            calcMode="spline"
            values="0 230;-140 200;0 230"
            keyTimes="0; .4; 1"
            keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
            repeatCount="indefinite"
          />
        </use>
      </g>
    </svg>
  
    )
  }

const LandingPage = () => {
    
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const headlines = [
    "Share Your Story with the World",
    "Inspire Others with Your Words",
    "Unleash Your Creativity",
    "Connect Through Your Writing",
  ];

  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000); // Change headline every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    
    <main className="h-full w-full">
    <AnimatedBackground/>
    <div className="absolute bottom-0 left-0 right-0 top-16 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
    <div className="container mx-auto px-4 py-[180px] text-center relative z-10">
      
      <motion.div initial="initial" animate="animate" variants={fadeIn}>
        <AnimatePresence mode="wait">
         
          <motion.h1
            key={currentHeadline}
            className="text-5xl md:text-6xl font-bold  mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {headlines[currentHeadline]}
          </motion.h1>
        </AnimatePresence>
        <motion.p className="text-xl text-gray-500 mb-8" variants={fadeIn}>
          Create, publish, and grow your blog with our easy-to-use platform.
        </motion.p>
        <motion.div variants={fadeIn}>
          <Link to={"/login"}>
          
          <Button size="lg">
            Start Writing <ArrowRight className="ml-2" />
          </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </main>
  )
}

export default LandingPage