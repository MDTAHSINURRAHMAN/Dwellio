import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { AuthContext } from "../../../providers/AuthProvider";
import { Helmet } from "react-helmet-async";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();
  const navigate = useNavigate();

  const {
    data: wishlistItems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/wishlist/${user.email}`
      );
      return response.data;
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecureInstance.delete(
        `https://dwellio-realestate.vercel.app/wishlist/${id}`
      );
    },
    onSuccess: () => {
      toast.success("Removed from wishlist successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove from wishlist");
    },
  });

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlistMutation.mutate(id);
  };

  const handleMakeOffer = (item) => {
    navigate("/dashboard/make-offer", { state: { property: item } });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Helmet>
        <title>My Wishlist | Dwellio</title>
      </Helmet>
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transform transition-all duration-300">
        My Wishlist
      </h2>

      {wishlistItems?.length === 0 ? (
        <div className="text-center text-gray-500 p-12 bg-gradient-to-br from-base-200/50 to-base-300/50 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="text-xl font-medium">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems?.map((item) => (
            <div
              key={item._id}
              className="card hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 backdrop-blur-sm shadow-xl hover:shadow-primary/20 group"
            >
              <figure className="relative overflow-hidden h-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </figure>
              <div className="card-body p-6">
                <h3 className="card-title text-xl md:text-2xl text-titleText hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 hover:text-secondary transition-colors duration-300">
                  {item.location}
                </p>

                <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                  <img
                    src={item.agentImage}
                    alt={item.agentName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary hover:ring-secondary transition-colors duration-300"
                  />
                  <div>
                    <p className="font-medium text-titleText">
                      {item.agentName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          item.status === "available"
                            ? "badge-success"
                            : "badge-warning"
                        } badge-sm md:badge-md transition-all duration-300 hover:scale-105`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                  <p className="font-medium text-titleText">Price Range:</p>
                  <p className="text-primary text-lg font-bold">
                    ${item.priceRange.min} - ${item.priceRange.max}
                  </p>
                </div>

                <div className="card-actions justify-between mt-6 gap-4">
                  <button
                    onClick={() => handleMakeOffer(item)}
                    className="bg-primary text-white px-4 py-3 rounded-lg transition-all duration-300 flex-1"
                  >
                    Make an Offer
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="btn btn-error btn-sm md:btn-md hover:bg-red-600 transition-colors duration-300"
                    disabled={removeFromWishlistMutation.isLoading}
                  >
                    {removeFromWishlistMutation.isLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <FaTrash className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
