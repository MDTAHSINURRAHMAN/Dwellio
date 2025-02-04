import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { FaGoogle } from "react-icons/fa";
import Navbar from "../../components/shared/Navbar";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "../../components/Footer";

const Login = () => {
  const { userLogin, signInWithGoogle, setUser } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [email, setEmail] = useState(""); // State to hold the email input
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    setEmail(email); // Store email in state

    userLogin(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Welcome to Dwellio");
        navigate(location?.state ? location.state : "/");
      })
      .catch(() => {
        toast.error(error.message || 'Failed to login');
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Welcome to Dwellio");
        navigate(location?.state?.from || "/");
      })
      .catch(() => {
        toast.error("Failed to sign in with Google");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Login | Dwellio</title>
        <meta name="description" content="Login page of Dwellio" />
      </Helmet>
      <Navbar></Navbar>
      <div className="min-h-screen mt-[100px] flex justify-center items-center font-karla text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-base-100/80 backdrop-blur-sm w-full max-w-lg shrink-0 rounded-lg p-2 md:p-5 lg:p-10 shadow-2xl border border-primary/20"
        >
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Login Your Account
          </motion.h2>
          <motion.form 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onSubmit={handleSubmit} 
            className="card-body"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="email"
                className="input input-bordered rounded-lg bg-base-200/50 focus:border-primary transition-colors duration-300"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="password"
                className="input input-bordered rounded-lg bg-base-200/50 focus:border-primary transition-colors duration-300"
                required
              />
              {error.login && (
                <label className="label text-sm text-red-600">
                  {error.login}
                </label>
              )}
              <label className="label">
                <Link
                  to="/forgot-password"
                  state={{ email }}
                  className="label-text-alt link link-hover text-primary"
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-3">
              <button className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300 rounded-lg">Login</button>
            </div>
          </motion.form>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="form-control px-8 mb-6"
          >
            <button
              onClick={handleGoogleSignIn}
              className="btn bg-gradient-to-r from-secondary to-primary text-white hover:from-primary hover:to-secondary transition-all duration-300 rounded-lg"
            >
              <FaGoogle /> Login With Google
            </button>
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-sm md:text-base text-center font-semibold"
          >
            Don't Have An Account?{" "}
            <Link
              className="text-sm md:text-base text-primary hover:text-secondary transition-colors duration-300 hover:underline ml-1"
              to="/register"
            >
              Register
            </Link>
          </motion.p>
        </motion.div>
      </div>
      <Footer></Footer>
    </motion.div>
  );
};

export default Login;