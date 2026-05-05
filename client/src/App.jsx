import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ItemDetail from "./pages/ItemDetail";
import MyListings from "./pages/MyListings";
import Browse from "./pages/Browse";
import CreateListing from "./pages/CreateListing";
import ScrollToTop from "./components/ScrollToTop";
import MyRentals from "./pages/MyRentals";

import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen pt-16 flex flex-col">
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rentals"
              element={
                <ProtectedRoute>
                  <MyRentals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* The Footer anchors the bottom */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
