import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../components/shared/Loading";
import useAgent from "../hooks/useAgent";

const AgentPrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAgent, isAgentLoading] = useAgent();
    const location = useLocation();

    if (loading || isAgentLoading) {
        return <Loading></Loading>;
    }

    if (user && isAgent) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AgentPrivateRoute;
