/** @format */

import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes({
    isAuthenticated,
    adminOnly,
    admin,
    redirect = "/",
    children,
}) {
    if (!isAuthenticated) {
        return <Navigate to={redirect} />;
    }

    if (adminOnly && !admin) {
        return <Navigate to={redirect} />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoutes;
