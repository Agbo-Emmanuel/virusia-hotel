import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./ScrollToTop";
import Landing from "./landing/pages/Landing";
import Home from "./landing/pages/Home";
import Rooms from "./landing/pages/Rooms";
import RoomDetail from "./landing/pages/RoomDetail";
import MyBookings from "./landing/pages/MyBookings";
import AmenitiesPage from "./landing/pages/AmenitiesPage";
import Contact from "./landing/pages/Contact";
import NotFound from "./landing/pages/NotFound";
import BookingModal from "./landing/components/BookingModal";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      {/* <BookingModal /> */}
      <Routes>
        <Route element={<Landing />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
