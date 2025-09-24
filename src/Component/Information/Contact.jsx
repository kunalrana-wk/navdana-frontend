import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showModal, setShowModal] = useState({ visible: false, message: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://navdana.com/api/v1/contact", formData);

      if (response.data.success) {
        setShowModal({ visible: true, message: "✅ Your message has been sent successfully!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setShowModal({ visible: true, message: "❌ Failed to send message. Try again later." });
      }
    } catch (error) {
      setShowModal({ visible: true, message: "⚠️ Something went wrong. Please try again." });
    }

    setTimeout(() => {
      setShowModal({ visible: false, message: "" });
    }, 3000);
  };

  const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setShowModal({ visible: true, message: `Copied "${text}" to clipboard!` });
          setTimeout(() => {
            setShowModal({ visible: false, message: "" });
          }, 2000);
        })
        .catch(() => {
          fallbackCopyTextToClipboard(text);
        });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setShowModal({ visible: true, message: `Copied "${text}" to clipboard!` });
      setTimeout(() => {
        setShowModal({ visible: false, message: "" });
      }, 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  return (
    <div
      className={`min-h-screen w-full py-12 px-4 transition-all duration-700 ease-in-out ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        fontFamily: "Georgia, serif",
        background: "linear-gradient(135deg, #faf7f4 0%, #f5f1eb 100%)",
      }}
    >
      <div className="text-sm text-gray-500 mb-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="hover:underline" style={{ textDecoration: "none" }}>Home</Link> / <span className="text-gray-700 font-medium">Contact</span>
      </div>
      <h1 className="text-center mb-6 text-4xl md:text-5xl font-semibold text-[#2c1810] tracking-widest">
        Contact Us
      </h1>
      <h2 className="text-center font-normal text-xl md:text-2xl text-[#b48a78] mb-8 italic">
        We're here to help you!
      </h2>
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-gray-700 mb-4">
          Have a question or need support? Fill out the form below and our team will get back to you within 24 hours.<br />
          Or email us at{" "}
          <span
            className="text-[#b48a78] underline cursor-pointer"
            onClick={() => handleCopy("support@taractara.com")}
          >
            contact@navdana.com
          </span>
          {" "}or WhatsApp us at{" "}
          <span
            className="text-[#b48a78] underline cursor-pointer"
            onClick={() => handleCopy("+919929767921")}
          >
            +91-9311120477
          </span>
          <br />
          <span className="text-xs text-gray-500">
            (Support available 10:00 AM – 6:00 PM, response within 24 hours)
          </span>
        </p>
        <p className="text-center text-gray-600 mb-6">
          B-108, Sector 6, Noida-201301
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#b48a78] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b48a78] bg-[#faf7f4] placeholder-gray-400 transition"
              placeholder="Your Name"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#b48a78] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b48a78] bg-[#faf7f4] placeholder-gray-400 transition"
              placeholder="Your Email"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-[#b48a78] rounded-md focus:outline-none focus:ring-2 focus:ring-[#b48a78] bg-[#faf7f4] placeholder-gray-400 resize-none transition"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#b48a78] text-white py-3 px-6 rounded-md hover:bg-[#8b5a3c] transition-colors duration-200 font-medium tracking-wide uppercase shadow"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="text-center mt-12">
        <div className="inline-block w-[60px] h-[2px] bg-gradient-to-r from-[#b48a78] to-[#8b5a3c] mx-2"></div>
        <span className="text-[#b48a78] text-2xl">✦</span>
        <div className="inline-block w-[60px] h-[2px] bg-gradient-to-r from-[#8b5a3c] to-[#b48a78] mx-2"></div>
      </div>

      {/* Dynamic Modal */}
      {showModal.visible && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out animate-fade-in-up">
          <div className="bg-[#b48a78] text-white text-sm px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2">
            <span>{showModal.message}</span>
            <button
              onClick={() => setShowModal({ visible: false, message: "" })}
              className="text-gray-200 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
