import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  CheckCircle,
  Loader2, // 👈 New import for loading spinner
  X, // 👈 New import for clear button
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { useCart } from "../context/CartContext";

// Utility for simple debounce
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { cart } = useCart();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null); 

  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || "",
  });

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to fetch products based on keyword
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    setLoading(true); 
    try {
      // NOTE: Using the general /search endpoint, assuming it handles live queries well
      const response = await axios.get(
        `https://navdana.com/api/v1/product/search?keyword=${query}`
      );
      setSearchResults(response.data.products || []);
      // Only show results if we have results or are loading
      setShowSearchResults(true); 
    } catch (error) {
      console.error("Error fetching live search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(fetchSearchResults, 300), 
    []
  );

  useEffect(() => {
    debouncedSearch(keyword);
  }, [keyword, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setTimeout(() => setShowSearchResults(false), 100); 
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://navdana.com/api/v1/category");
        if (Array.isArray(response.data.categories)) {
          const activeCategories = response.data.categories.filter(
            (cat) => cat.isActive && cat.name !== "All Products"
          );
          const finalCategories = [
            { _id: "all-products", name: "All Products" },
            ...activeCategories,
          ];
          setCategories(finalCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Set auth state from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    setAuthState({
      user: storedUser,
      token: storedToken,
    });
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const handleCategoryClick = (category) => {
    if (category._id === "all-products") {
      navigate("/all-products");
    } else {
      navigate(`/collection-pages/${category._id}`);
    }
    setIsOpen(false);
  };
  
  const handleProductClick = (productId) => {
    console.log("Click on the handle click")
    navigate(`/product/${productId}`);
    setKeyword(""); 
    setSearchResults([]);
    setShowSearchResults(false);
    setIsOpen(false); 
  };

  // New handler to clear search
  const clearSearch = () => {
    setKeyword("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const openLoginPopup = () => {
    setShowEmailPopup(true);
    setDropdownOpen(false);
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      await axios.post("https://navdana.com/api/v1/user/send-otp", { email });
      setLoading(false);
      setShowEmailPopup(false);
      setShowOtpPopup(true);
    } catch {
      setLoading(false);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://navdana.com/api/v1/user/verify",
        { email, otp },
        { withCredentials: true }
      );
      setLoading(false);

      const { user: loggedInUser, token: authToken } = res.data;
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", authToken);

      setAuthState({ user: loggedInUser, token: authToken });
      setShowOtpPopup(false);
      setEmail("");
      setOtp("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      setLoading(false);
      alert("Invalid OTP, try again");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthState({ user: null, token: "" });
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <header className="w-full shadow-lg bg-white sticky top-0 z-50">
      {/* Top promotional strip */}
      <div className="text-center bg-gray-950 text-white py-3">
        <p className="text-sm sm:text-base font-semibold tracking-wide">
          ⚡ PAN India Delivery ⚡
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Company Logo"
              className="h-10 sm:h-12 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
            />
          </div>
        </div>

        {/* Center Section: Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-10">
          {categories.map((item, index) => (
            <button
              key={item._id || item.name}
              className="text-gray-800 hover:text-black font-semibold relative group"
              onClick={() => handleCategoryClick(item)}
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transform -translate-x-1/2 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </nav>

        {/* Right Section: Search + Cart + User */}
        <div className="flex items-center space-x-6">
          {/* Search bar (desktop) - ENHANCED UI + CLEAR BUTTON LOGIC */}
          <div className="relative hidden md:block" ref={searchContainerRef}> 
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search products..."
                className="border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-48 sm:w-64"
              />
              {keyword ? (
                <button
                  onClick={clearSearch}
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-500 hover:text-red-500 transition"
                  aria-label="Clear Search"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <Search
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 w-5 h-5 pointer-events-none" 
                  aria-label="Search Icon"
                />
              )}
            </div>
            
            {/* Search Results Dropdown (Desktop) - UNLIMITED RESULTS + ENHANCED UI */}
            {showSearchResults && keyword.trim() && (
              <div 
                className="absolute top-full mt-2 w-full min-w-[250px] max-h-96 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-y-auto z-50"
              >
                {loading ? (
                  <div className="p-4 text-sm text-gray-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  // ✅ REMOVED .slice(0, 5) to show all results
                  searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="w-full text-left p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {/* Product Image Thumbnail */}
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden border">
                        {product.images && product.images.length > 0 ? (
                          <img 
                              src={product.images[0].url || product.images[0]} 
                              alt={product.name} 
                              className="h-full w-full object-cover" 
                          />
                        ) : (
                          // Fallback icon if no image is present
                          <Package className="h-full w-full p-1 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Product Name */}
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {product.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    No results found for "{keyword}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          {/* User / Login */}
          {!authState.user ? (
            <button onClick={openLoginPopup} aria-label="Login">
              <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="p-1 rounded-full"
                aria-label="User Menu"
              >
                <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-2xl ring-1 ring-black ring-opacity-10 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 text-sm text-gray-800 border-b">
                      <div className="truncate">{authState.user.email}</div>
                    </div>
                    {authState.user.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={18} /> Dashboard
                      </button>
                    )}
                    {authState.user.role === "customer" && (
                      <button
                        onClick={() => {
                          navigate("/my-orders");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package size={18} /> My Orders
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`lg:hidden transition-all duration-500 ${
          isOpen ? "max-h-[30rem] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Mobile Search - ENHANCED UI + CLEAR BUTTON LOGIC */}
        <div className="p-3 relative" ref={searchContainerRef}> 
          <div className="flex relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search products..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="bg-black text-white px-3 py-2 rounded-r-lg flex items-center">
              <Search className="w-4 h-4" />
            </div>
            {keyword && (
                <button
                    onClick={clearSearch}
                    className="absolute top-1/2 -translate-y-1/2 right-16 text-gray-500 hover:text-red-500 transition p-1"
                    aria-label="Clear Search"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
          </div>

          {/* Search Results Dropdown (Mobile) - UNLIMITED RESULTS + ENHANCED UI */}
          {showSearchResults && keyword.trim() && (
            <div className="absolute left-3 right-3 top-full mt-1 max-h-80 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto z-50">
              {loading ? (
                <div className="p-4 text-sm text-gray-500 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching...
                </div>
              ) : searchResults.length > 0 ? (
                // ✅ REMOVED .slice(0, 5) to show all results
                searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="w-full text-left p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {/* Product Image Thumbnail */}
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden border">
                      {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0].url || product.images[0]} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                        />
                      ) : (
                        // Fallback icon if no image is present
                        <Package className="h-full w-full p-1 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Product Name */}
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  No results found for "{keyword}".
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="bg-gray-50 border-t px-4 py-2 space-y-1">
          {categories.map((item) => (
            <button
              key={item._id || item.name}
              className="block w-full text-left font-medium text-gray-700 hover:text-gray-900 py-2"
              onClick={() => handleCategoryClick(item)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Email popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Login/Sign Up</h2>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEmailPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendOtp}
                className="px-6 py-2 bg-black text-white rounded-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Verify OTP</h2>
            <p className="text-sm text-center text-gray-600 mb-4">
              An OTP has been sent to <span className="font-semibold">{email}</span>
            </p>
            <div className="mb-4">
              <input
                id="otp"
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full text-center tracking-widest"
                maxLength="6"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowOtpPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="px-6 py-2 bg-black text-white rounded-lg"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3 border border-green-200">
            <CheckCircle className="text-green-500 w-6 h-6" />
            <span className="text-gray-800 font-medium">
              Successfully logged in!
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;