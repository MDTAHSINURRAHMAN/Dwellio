import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const MyAddedProperties = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const {
    data: properties = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-properties", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/properties/agent/${user?.email}`
      );
      return response.data;
    },
  });

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axiosSecureInstance.delete(
          `https://dwellio-realestate.vercel.app/properties/${id}`
        );
        if (response.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Property has been deleted.", "success");
        }
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      image: form.image.value,
      title: form.title.value,
      location: form.location.value,
      priceRange: {
        min: form.minPrice.value,
        max: form.maxPrice.value,
      },
    };

    try {
      const response = await axiosSecureInstance.patch(
        `https://dwellio-realestate.vercel.app/properties/${selectedProperty._id}`,
        updatedData
      );
      if (response.data.modifiedCount > 0) {
        refetch();
        document.getElementById("update_modal").close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Property Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating property:", error);
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
        <title>My Properties | Dwellio</title>
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
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          My Added Properties
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={property._id}
              className="card bg-base-100/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <figure className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover transform hover:scale-110 transition duration-500"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {property.title}
                </h2>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {property.location}
                </p>
                <p>
                  <span className="font-semibold">Price Range:</span> $
                  {property.priceRange.min} - ${property.priceRange.max}
                </p>
                <div className="flex gap-2 my-2">
                  <span className="badge badge-ghost">{property.status}</span>
                  <span
                    className={`badge ${
                      property.verificationStatus === "verified"
                        ? "badge-success"
                        : property.verificationStatus === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {property.verificationStatus}
                  </span>
                </div>
                <div className="card-actions justify-end">
                  {property.verificationStatus !== "rejected" && (
                    <button
                      className="btn btn-sm bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                      onClick={() => {
                        setSelectedProperty(property);
                        document.getElementById("update_modal").showModal();
                      }}
                    >
                      Update
                    </button>
                  )}
                  <button
                    className="btn btn-sm bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-700 hover:to-red-500 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No properties added yet</p>
          </motion.div>
        )}
      </motion.div>

      {/* Update Modal */}
      <dialog id="update_modal" className="modal modal-bottom sm:modal-middle">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="modal-box w-11/12 max-w-4xl bg-gradient-to-br from-base-100 via-primary/5 to-base-200 p-6 rounded-lg shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Update Property
            </h3>
            <form method="dialog">
              <button className="btn btn-circle btn-ghost hover:bg-red-500 hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Property Image URL
                  </span>
                </label>
                <input
                  type="text"
                  name="image"
                  defaultValue={selectedProperty?.image}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Property Title
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedProperty?.title}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Location</span>
              </label>
              <input
                type="text"
                name="location"
                defaultValue={selectedProperty?.location}
                className="input input-bordered bg-base-100/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-300"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Agent Name</span>
                </label>
                <input
                  type="text"
                  value={selectedProperty?.agentName}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Agent Email</span>
                </label>
                <input
                  type="email"
                  value={selectedProperty?.agentEmail}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Minimum Price ($)
                  </span>
                </label>
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={selectedProperty?.priceRange.min}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Maximum Price ($)
                  </span>
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={selectedProperty?.priceRange.max}
                  className="input input-bordered bg-base-100/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn w-full md:w-auto bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Update Property
              </button>
            </div>
          </form>
        </motion.div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default MyAddedProperties;
