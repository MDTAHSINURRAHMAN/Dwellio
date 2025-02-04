import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"; // Import eye icons
import Navbar from "../../components/shared/Navbar";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";

const Register = () => {
  const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const photo = form.get("photo");
    const password = form.get("password");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError((prevError) => ({
        ...prevError,
        password:
          "Password Must Have At Least 6 Characters, Including An Uppercase And A Lowercase Letter.",
      }));
      return;
    }

    try {
      const result = await createNewUser(email, password);
      const user = result.user;
      setUser(user);

      // Save user to database
      const userInfo = {
        name,
        email,
        photo,
        role: "user", // Default role for new users
      };

      const response = await axios.post(
        "https://dwellio-realestate.vercel.app/users",
        userInfo
      );

      if (response.data) {
        toast.success(
          "Account successfully created! Welcome aboard! We're excited to have you with us."
        );
        await updateUserProfile({ displayName: name, photoURL: photo });
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Helmet */}
      <Helmet>
        <title>Register | Dwellio</title>
        <meta name="description" content="Register page of Dwellio" />
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
            Register Your Account
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
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="input input-bordered rounded-lg bg-base-200/50 focus:border-primary transition-colors duration-300"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="input input-bordered rounded-lg bg-base-200/50 focus:border-primary transition-colors duration-300"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                name="photo"
                type="text"
                placeholder="Your Photo URL"
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
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                className="input input-bordered rounded-lg bg-base-200/50 focus:border-primary transition-colors duration-300 pr-10"
                required
              />
              <div className="relative">
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3.5 text-xl cursor-pointer text-gray-600 hover:text-primary transition-colors duration-300"
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
              {error.password && (
                <label className="label text-xs text-start text-red-500 mt-2">
                  {error.password}
                </label>
              )}
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300 rounded-lg">
                Register
              </button>
            </div>
          </motion.form>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm md:text-base text-center font-semibold"
          >
            Already Have An Account?
            <Link
              className="text-sm md:text-base text-primary hover:text-secondary transition-colors duration-300 hover:underline ml-1"
              to="/login"
            >
              Login
            </Link>
          </motion.p>
        </motion.div>
      </div>
      <Footer></Footer>
    </motion.div>
  );
};

export default Register;
