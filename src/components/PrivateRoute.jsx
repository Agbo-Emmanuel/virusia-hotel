import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  if (!token || !userData) return <Navigate to="/login" replace />;

  let role;
  try {
    role = JSON.parse(userData)?.role;
  } catch {
    // Corrupted/invalid JSON in storage — treat as unauthenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={
          role === "super-admin"
            ? "/super-admin"
            : role === "admin"
              ? "/admin"
              : "/"
        }
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
