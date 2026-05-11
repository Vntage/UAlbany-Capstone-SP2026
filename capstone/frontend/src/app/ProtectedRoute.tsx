import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
    const { currentUser, authorizing } = useAuth();
    if (authorizing) {
        return <div>Authorizing...</div>;
    }
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;