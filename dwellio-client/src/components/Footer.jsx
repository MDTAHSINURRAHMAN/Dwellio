import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaArrowUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/LOGO/logo1.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-bl from-secondary  via-primary to-titleText  text-white relative">
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
              <img
                src={logo}
                alt="Dwellio"
                className="w-28 h-28 bg-white rounded-full"
              />
            </Link>
            <p className="text-white text-opacity-75 text-base tracking-wider leading-[2rem]">
              Your trusted partner in finding the perfect property. We make real
              estate simple and accessible for everyone.
            </p>
            <div className="inline-block space-x-4 bg-white py-4 px-8 rounded-full">
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ y: -5, color: "#4267B2" }}
                  href="#"
                  className="text-primary transition-colors"
                >
                  <FaFacebookF size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, color: "#1DA1F2" }}
                  href="#"
                  className="text-primary transition-colors"
                >
                  <FaTwitter size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, color: "#0077B5" }}
                  href="#"
                  className="text-primary transition-colors"
                >
                  <FaLinkedinIn size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, color: "#FF0000" }}
                  href="#"
                  className="text-primary transition-colors"
                >
                  <FaYoutube size={20} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="playfair text-3xl font-extrabold">Quick Links</h3>
            <ul className="space-y-4 text-base tracking-wider text-white text-opacity-75">
              <li>
                <Link
                  to="/all-properties"
                  className="hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:text-opacity-95transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:text-opacity-95transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="playfair text-3xl font-semibold">Services</h3>
            <ul className="space-y-4 text-base tracking-wider">
              <li>
                <Link
                  to="/property-management"
                  className="text-white text-opacity-75 hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Property Management
                </Link>
              </li>
              <li>
                <Link
                  to="/consulting"
                  className="text-white text-opacity-75 hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Real Estate Consulting
                </Link>
              </li>
              <li>
                <Link
                  to="/valuation"
                  className="text-white text-opacity-75  hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Property Valuation
                </Link>
              </li>
              <li>
                <Link
                  to="/investment"
                  className="text-white text-opacity-75 hover:text-white hover:text-opacity-95 transition-colors"
                >
                  Investment Advisory
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="playfair text-3xl font-semibold">Newsletter</h3>
            <p className="text-white text-opacity-75 text-base tracking-wider leading-[2rem]">
              Subscribe to our newsletter for the latest updates and exclusive
              offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-md focus:outline-none focus:border-primary placeholder:text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-white text-primary font-semibold  tracking-[0.01rem] rounded-md hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm font-light text-center md:text-left">
            © {new Date().getFullYear()} Dwellio. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 text-sm font-light hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 text-sm font-light hover:text-primary transition-colors"
            >
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
