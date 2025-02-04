import { motion } from "framer-motion";
import { FaHome, FaHandshake, FaUsers } from "react-icons/fa";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left side - Image */}
          <motion.div variants={itemVariants} className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              alt="Modern Building"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-6 rounded-2xl shadow-xl">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm">Years of Experience</div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              About Dwellio
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed"
            >
              At Dwellio, we're more than just a real estate platform. We're
              your trusted partner in finding the perfect property that matches
              your dreams and aspirations. With over 15 years of experience,
              we've helped thousands of families find their ideal homes.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FaHome className="text-4xl text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Quality Properties
                </h3>
                <p className="text-gray-600 text-sm">
                  Carefully curated selection of premium properties
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FaHandshake className="text-4xl text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                <p className="text-gray-600 text-sm">
                  Professional support throughout your journey
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FaUsers className="text-4xl text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Happy Clients</h3>
                <p className="text-gray-600 text-sm">
                  Thousands of satisfied customers
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
