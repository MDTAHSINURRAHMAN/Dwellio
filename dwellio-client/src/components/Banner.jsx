import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import { motion } from 'framer-motion';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const Banner = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const AnimatedText = ({ text }) => (
    <motion.h1 
      className="playfair text-4xl md:text-6xl lg:text-8xl tracking-[0.2rem] font-medium"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterAnimation}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AutoplaySlider
        play={true}
        cancelOnInteraction={false}
        interval={6000}
        className="h-[400px] sm:h-[500px] md:h-[600px] w-full"
        bullets={false}
      >
        <div className="w-full h-full">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')`
            }}
          >
            <div className="h-full w-full bg-black/50 flex items-center justify-center">
              <div className="text-center text-white space-y-2 md:space-y-4 px-4">
                <AnimatedText text="Find Your Dream Home" />
                <motion.p 
                  className="text-base md:text-lg tracking-[0.1rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  Discover the perfect property that matches your lifestyle
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')`
            }}
          >
            <div className="h-full w-full bg-black/50 flex items-center justify-center">
              <div className="text-center text-white space-y-2 md:space-y-4 px-4">
                <AnimatedText text="Luxury Properties" />
                <motion.p 
                  className="text-base md:text-lg tracking-[0.1rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  Experience elegance and comfort in our premium listings
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')`
            }}
          >
            <div className="h-full w-full bg-black/50 flex items-center justify-center">
              <div className="text-center text-white space-y-2 md:space-y-4 px-4">
                <AnimatedText text="Expert Real Estate Agents" />
                <motion.p 
                  className="text-base md:text-lg tracking-[0.1rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  Let our professionals guide you to your next property
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </AutoplaySlider>
    </motion.div>
  );
};

export default Banner;
