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

// 🪔 Festive Popup Component
function DiwaliPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("diwaliPopupShown");
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem("diwaliPopupShown", "true");
      setTimeout(() => setShow(false), 8000); // auto close after 8 seconds
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-3xl shadow-2xl p-8 max-w-md w-[90%] text-center border-4 border-yellow-400 animate-pop">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-4 text-gray-700 hover:text-black text-2xl"
        >
          ×
        </button>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3037/3037068.png"
          alt="Diya Lamp"
          className="w-20 h-20 mx-auto mb-4 animate-bounce"
        />

        <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-2">
          🪔 Happy Diwali! 🪔
        </h2>
        <p className="text-gray-700 mb-4">
          Wishing you joy, prosperity, and brightness this festive season.
        </p>

        <div className="bg-yellow-400 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-200">
          Enjoy Festive Offers 🎉
        </div>

        {/* Floating sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full opacity-75 animate-float"
              style={{
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ✨ Animations
const style = document.createElement("style");
style.innerHTML = `
@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes float {
  0% { transform: translateY(0px); opacity: 1; }
  100% { transform: translateY(-80px); opacity: 0; }
}
.animate-pop { animation: pop 0.5s ease-out; }
.animate-fadeIn { animation: fadeIn 0.4s ease-out; }
.animate-float { animation: float linear infinite; }
`;
document.head.appendChild(style);

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
