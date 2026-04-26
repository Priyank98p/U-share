import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ItemDetail from "./pages/ItemDetail";
import MyListings from "./pages/MyListings";
import Browse from "./pages/Browse";
import CreateListing from "./pages/CreateListing";
import ScrollToTop from "./components/ScrollToTop";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<Browse/>}/>
            <Route path="/item/:id" element={<ItemDetail/>} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Routes>
        </div>
      </main>

      {/* The Footer anchors the bottom */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;