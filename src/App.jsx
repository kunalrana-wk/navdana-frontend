import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import './App.css';
import { useEffect, useState } from "react";

// Components
import Header from './Component/Header';
import Footer2 from './Component/Footer/Footer2';
import ComingSoon from './Component/ComingSoon';
import ProductDetails from "./Component/ProductDetail";
import CartPage from "./Component/CartPage";
import ScrollToTop from './Component/ScrollToTop';

// Home import
import Home from './Component/Home';

// INFORMATION Section
import About from './Component/Information/About';
import TermsConditions from './Component/Information/TermsConditions';
import Contact from './Component/Information/Contact';
import OurTeam from './Component/Information/OurTeam';
import Faqs from './Component/Information/Faqs';
import BlogPage from './Component/Information/BlogPage';

// POLICIES
import ReturnExchangeRequest from './Component/Policies/ReturnExchangeRequest';
import ReturnsExchanges from './Component/Policies/ReturnsExchanges';
import ShipingPolicy from './Component/Policies/ShipingPolicy';
import PrivacyPolicy from './Component/Policies/PrivacyPolicy';
import CancelPolicy from './Component/Policies/CancelPolicy';
import CollectionPage from "./Component/CollectionPage";
import AllProducts from './Component/collections/AllProducts';

// Chatpopup
import ChatPopup from "./Component/ChatPopup";

// Career page
import Career from './Component/Information/Career';

// Dashboard
import DashboardLayout from "./Component/pages/components/DashboardLayout";
import Dashboard from "./Component/pages/Dashboard";
import Reports from "./Component/pages/dashboard/Reports";
import Settings from "./Component/pages/dashboard/Settings";
import Category from "./Component/pages/dashboard/Category";
import Product from "./Component/pages/dashboard/Product";
import Banners from "./Component/pages/dashboard/Banners";
import Users from "./Component/pages/dashboard/Users";
import Orders from "./Component/pages/dashboard/Orders";
import Coupons from "./Component/pages/dashboard/Coupans";
import Blog from "./Component/pages/dashboard/Blog";
import ContactDetails from "./Component/pages/dashboard/ContactDetails";
import Subscribe from "./Component/pages/dashboard/Subscribe";

// Order page
import MyOrders from "./pages/MyOrders";

// Search page
import SearchPage from "./Component/pages/components/SearchPage";

// 🔹 ProtectedRoute Component
function ProtectedRoute({ element, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return element;
}


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <DiwaliPopup /> {/* 🪔 Added Here */}
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Info Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shiping-policy" element={<ShipingPolicy />} />
              <Route path="/our-team" element={<OurTeam />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/cancel-policy" element={<CancelPolicy />} />
              <Route path="/return-exchange-request" element={<ReturnExchangeRequest />} />
              <Route path="/career" element={<Career />} />

              {/* Product & Cart */}
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/collection-pages/:id" element={<CollectionPage />} />

              {/* Dashboard (Protected for admin) */}
              <Route path="/dashboard" element={<ProtectedRoute role="admin" element={<DashboardLayout><Dashboard /></DashboardLayout>} />} />
              <Route path="/dashboard/reports" element={<ProtectedRoute role="admin" element={<DashboardLayout><Reports /></DashboardLayout>} />} />
              <Route path="/dashboard/settings" element={<ProtectedRoute role="admin" element={<DashboardLayout><Settings /></DashboardLayout>} />} />
              <Route path="/dashboard/category" element={<ProtectedRoute role="admin" element={<DashboardLayout><Category /></DashboardLayout>} />} />
              <Route path="/dashboard/product" element={<ProtectedRoute role="admin" element={<DashboardLayout><Product /></DashboardLayout>} />} />
              <Route path="/dashboard/banners" element={<ProtectedRoute role="admin" element={<DashboardLayout><Banners /></DashboardLayout>} />} />
              <Route path="/dashboard/users" element={<ProtectedRoute role="admin" element={<DashboardLayout><Users /></DashboardLayout>} />} />
              <Route path="/dashboard/orders" element={<ProtectedRoute role="admin" element={<DashboardLayout><Orders /></DashboardLayout>} />} />
              <Route path="/dashboard/blog" element={<ProtectedRoute role="admin" element={<DashboardLayout><Blog /></DashboardLayout>} />} /> 
              <Route path="/dashboard/contact-details" element={<ProtectedRoute role="admin" element={<DashboardLayout><ContactDetails /></DashboardLayout>} />} />
              <Route path="/dashboard/send-mail" element={<ProtectedRoute  role="admin" element={<DashboardLayout><Subscribe/></DashboardLayout>} />} />

              {/* Home */}
              <Route path="/" element={<Home />} />
              <Route path="*" element={<ComingSoon />} />

              {/* Orders & Search */}
              <Route path='/my-orders' element={<MyOrders />} />
              <Route path='/search' element={<SearchPage />} />
            </Routes>
          </main>
          <Footer2 />
        </div>
      </BrowserRouter>
      <ChatPopup />
    </CartProvider>
  );
}

export default App;
