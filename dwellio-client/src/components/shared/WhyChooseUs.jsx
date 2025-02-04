import { motion } from 'framer-motion';
import { FaShieldAlt, FaMoneyBillWave, FaClock, FaChartLine, FaHandHoldingHeart, FaUserTie } from 'react-icons/fa';

const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "Secure Transactions",
      description: "Your security is our priority. All transactions are protected with advanced encryption."
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "Best Market Price",
      description: "We ensure you get the best value for your investment with competitive market prices."
    },
    {
      icon: <FaClock className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "24/7 Support",
      description: "Our dedicated team is available round the clock to assist you with any queries."
    },
    {
      icon: <FaChartLine className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "Market Analysis",
      description: "Get detailed market insights and trends to make informed decisions."
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "Personalized Service",
      description: "We provide tailored solutions to meet your specific real estate needs."
    },
    {
      icon: <FaUserTie className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />,
      title: "Expert Agents",
      description: "Our certified agents bring years of experience and market knowledge."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-base-200/50 via-base-100 to-base-200/50">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Why Choose Dwellio?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of technology and personal service. We make your property journey seamless and successful.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-8 bg-white rounded-xl shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-secondary transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyChooseUs;