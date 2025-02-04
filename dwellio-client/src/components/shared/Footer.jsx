import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-[#1a1e25] text-white relative">
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Dwellio" className="h-8" />
              <span className="text-2xl font-bold">Dwellio</span>
            </Link>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect property. We make real estate simple and accessible for everyone.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ y: -5, color: '#4267B2' }}
                href="#" 
                className="hover:text-primary transition-colors"
              >
                <FaFacebookF size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, color: '#1DA1F2' }}
                href="#" 
                className="hover:text-primary transition-colors"
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, color: '#0077B5' }}
                href="#" 
                className="hover:text-primary transition-colors"
              >
                <FaLinkedinIn size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, color: '#FF0000' }}
                href="#" 
                className="hover:text-primary transition-colors"
              >
                <FaYoutube size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/all-properties" className="text-gray-400 hover:text-primary transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/property-management" className="text-gray-400 hover:text-primary transition-colors">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/consulting" className="text-gray-400 hover:text-primary transition-colors">
                  Real Estate Consulting
                </Link>
              </li>
              <li>
                <Link to="/valuation" className="text-gray-400 hover:text-primary transition-colors">
                  Property Valuation
                </Link>
              </li>
              <li>
                <Link to="/investment" className="text-gray-400 hover:text-primary transition-colors">
                  Investment Advisory
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold">Newsletter</h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-primary"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Dwellio. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
};

export default Footer; 