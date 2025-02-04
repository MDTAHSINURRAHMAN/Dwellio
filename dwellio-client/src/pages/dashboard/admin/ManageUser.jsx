import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";

const ManageUser = () => {
  const axiosSecureInstance = axiosSecure();
  const { deleteUserAccount } = useContext(AuthContext);

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/users"
      );
      return response.data;
    },
  });

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await axiosSecureInstance.patch(
        `https://dwellio-realestate.vercel.app/users/${userId}`,
        {
          role: newRole,
        }
      );

      if (response.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `User role updated to ${newRole}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleMarkAsFraud = async (userId, userEmail) => {
    try {
      const response = await axiosSecureInstance.patch(
        `https://dwellio-realestate.vercel.app/users/${userId}`,
        {
          status: "fraud",
        }
      );

      if (response.data.modifiedCount > 0) {
        // Delete all properties by this agent
        await axiosSecureInstance.delete(
          `https://dwellio-realestate.vercel.app/properties/agent/${userEmail}`
        );

        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User marked as fraud and their properties removed",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error marking user as fraud:", error);
    }
  };

  const handleDelete = async (userId, userEmail) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `This user is ${userEmail}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Delete from MongoDB
        const response = await axiosSecureInstance.delete(
          `https://dwellio-realestate.vercel.app/users/${userId}`
        );

        if (response.data.deletedCount > 0) {
          refetch();
          Swal.fire(
            "Deleted!",
            "User has been deleted from both database and authentication.",
            "success"
          );
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Error", "Failed to delete user. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Manage Users | Dwellio</title>
      </Helmet>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl rounded-lg p-4 md:p-8"
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Manage Users
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="overflow-x-auto"
        >
          <table className="table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={user._id}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="flex flex-col md:flex-row gap-2">
                    {user.role === "admin" ? (
                      <span className="text-primary font-medium">
                        Admin User
                      </span>
                    ) : user.status === "fraud" ? (
                      <span className="text-error font-medium">Fraud</span>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateRole(user._id, "admin")}
                          className="btn w-full md:w-auto bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary btn-xs border-none"
                        >
                          Make Admin
                        </motion.button>

                        {user.role !== "agent" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateRole(user._id, "agent")}
                            className="btn w-full md:w-auto bg-gradient-to-r from-secondary to-primary text-white hover:from-primary hover:to-secondary btn-xs border-none"
                          >
                            Make Agent
                          </motion.button>
                        )}

                        {user.role === "agent" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleMarkAsFraud(user._id, user.email)
                            }
                            className="btn w-full md:w-auto bg-gradient-to-r from-warning to-error text-white hover:from-error hover:to-warning btn-xs border-none"
                          >
                            Mark as Fraud
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(user._id, user.email)}
                          className="btn w-full md:w-auto bg-gradient-to-r from-error to-error/70 text-white hover:from-error/70 hover:to-error btn-xs border-none"
                        >
                          Delete
                        </motion.button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {users.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No users found</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ManageUser;
