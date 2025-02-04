import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./axiosSecure";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAgent = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: isAgent = false, isLoading, error } = useQuery({
        queryKey: [user?.email, "isAgent"],
        queryFn: async () => {
            if (!user?.email) return false; // Return false if no user email
            try {
                const res = await axiosSecure.get(`/agent/check/${user.email}`);
                return res.data?.isAgent || false; // Ensure a boolean is returned
            } catch (err) {
                console.error('Error fetching agent status:', err);
                return false; // Return false on error
            }
        }
    });

    return [isAgent, isLoading, error];
};

export default useAgent;