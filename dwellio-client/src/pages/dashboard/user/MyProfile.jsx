import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/user/profile/${user.email}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-8">
      <Helmet>
        <title>My Profile | Dwellio</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-primary/70 to-secondary/70 shadow-2xl rounded-lg p-6 md:p-12 hover:shadow-primary/20 transition-all duration-300 backdrop-blur-sm max-w-4xl w-full"
      >
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25"
              animate={{ opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.img
              src={user?.photoURL}
              alt={user?.displayName}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-primary hover:border-secondary transition-colors duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-titleText to-titleText/50 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {user?.displayName}
            </motion.h2>
            <motion.p
              className="text-gray-600 text-sm hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              {user?.email}
            </motion.p>

            {userRole?.role && userRole.role !== "user" && (
              <motion.div
                className="mt-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="badge badge-primary badge-lg capitalize hover:badge-secondary transition-colors duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {userRole.role}
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
