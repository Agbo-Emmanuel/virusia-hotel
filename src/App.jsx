import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./ScrollToTop";

// Public Landing Pages
import Landing from "./landing/pages/Landing";
import Home from "./landing/pages/Home";
import Rooms from "./landing/pages/Rooms";
import RoomDetail from "./landing/pages/RoomDetail";
import MyBookings from "./landing/pages/MyBookings";
import AmenitiesPage from "./landing/pages/AmenitiesPage";
import Contact from "./landing/pages/Contact";
import NotFound from "./landing/pages/NotFound";

// Dashboard Wrapper Component
import DashboardLanding from "./dashboard/DashboardLanding";

// Admin Pages
import AdminOverview from "./dashboard/admin/AdminOverview";
import AdminBookings from "./dashboard/admin/AdminBookings";
import AdminRooms from "./dashboard/admin/AdminRooms";
import AdminGuests from "./dashboard/admin/AdminGuests";

// Super Admin Pages
import SuperAdminOverview from "./dashboard/superAdmin/SuperAdminOverview";
import SuperAdminRooms from "./dashboard/superAdmin/SuperAdminRooms";
import SuperAdminBookings from "./dashboard/superAdmin/SuperAdminBookings";
import SuperAdminAdmins from "./dashboard/superAdmin/SuperAdminAdmins";
import SuperAdminSettings from "./dashboard/superAdmin/SuperAdminSettings";
import CreateRoom from "./dashboard/superAdmin/CreateRoom";
import Register from "./landing/auth/Register";
import Login from "./landing/auth/Login";
import RegisterSuccess from "./landing/auth/RegisterSuccess";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/login" element={<Login />} />
        {/* Guest Public Landing Flow */}
        <Route element={<Landing />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Dashboard Flow */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLanding defaultRole="admin" />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/guests" element={<AdminGuests />} />
            <Route path="/admin/create-room" element={<CreateRoom />} />
          </Route>
        </Route>

        {/* Super Admin Dashboard Flow */}
        <Route element={<PrivateRoute allowedRoles={["super-admin"]} />}>
          <Route element={<DashboardLanding defaultRole="super-admin" />}>
            <Route path="/super-admin" element={<SuperAdminOverview />} />
            <Route
              path="/super-admin/overview"
              element={<SuperAdminOverview />}
            />
            <Route path="/super-admin/rooms" element={<SuperAdminRooms />} />
            <Route
              path="/super-admin/bookings"
              element={<SuperAdminBookings />}
            />
            <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
            <Route
              path="/super-admin/settings"
              element={<SuperAdminSettings />}
            />
            <Route path="/super-admin/create-room" element={<CreateRoom />} />
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
