import { useContext, useState, useEffect } from "react";
import { FaRegUser, FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/LOGO/logo1.png";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const links = [
    {
      key: 1,
      label: "Home",
      to: "/",
      isPublic: true,
    },
    {
      key: 2,
      label: "All Properties",
      to: "/all-properties",
      isPublic: true,
    },
    {
      key: 3,
      label: "Dashboard",
      to: "/dashboard",
      isPublic: false,
    },
  ];

  // Filter links based on user authentication
  const filteredLinks = links.filter((link) => link.isPublic || user);

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 bg-white bg-opacity-90 mt-8 rounded-lg">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/" className="flex items-center">
              <img src={logo} alt="logo" className="w-24 h-24 md:w-32 md:h-32" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {filteredLinks.map((link) => (
              <motion.div
                key={link.key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-base tracking-[0.1rem] font-medium transition-colors ${
                      isActive 
                        ? 'text-[#a84ecf]' 
                        : 'text-[#131313] hover:text-[#a84ecf]'
                    }`
                  }
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 h-0.5 bg-[#a84ecf] bottom-0"
                      initial={false}
                    />
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:bg-[#74338f] focus:outline-none"
            >
              <motion.div
                animate={isOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-around"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 },
                  }}
                  className="w-full h-0.5 bg-current transform origin-center"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-full h-0.5 bg-current"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 },
                  }}
                  className="w-full h-0.5 bg-current transform origin-center"
                />
              </motion.div>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user && user?.email ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logOut}
                  className="flex items-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                  >
                    <FaRegUser />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg">
                {filteredLinks.map((link) => (
                  <NavLink
                    key={link.key}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? 'text-[#a84ecf] bg-[#E8F6F3]'
                          : 'text-gray-700 hover:text-[#a84ecf] hover:bg-[#E8F6F3]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {/* Mobile Auth Buttons */}
                {user && user?.email ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={logOut}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </motion.button>
                ) : (
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                    >
                      <FaRegUser />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#a84ecf] text-white rounded-lg hover:bg-[#74338f] transition-colors"
                    >
                      <FaUserPlus />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;