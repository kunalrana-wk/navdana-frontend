import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = "https://navdana.com/api/v1/blog";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setBlogs(res.data?.blogss || []);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      alert("Failed to fetch blogs — check console for details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "image" && type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    if (!form.title.trim()) return setFormError("Title is required");
    if (!form.description.trim()) return setFormError("Description is required");
    if (!form.link.trim()) return setFormError("Link is required");
    if (!form.image) return setFormError("Image is required");

    setFormError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    formData.append("image", form.image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add a blog.");
        return;
      }

      await axios.post(API_BASE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({ title: "", description: "", link: "", image: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      console.error("Create blog error:", err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      if (err.response?.status === 401) {
        alert("Unauthorized: Please login to add a blog.");
      } else {
        alert("Failed to create blog: " + serverMessage);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a blog.");
        return;
      }
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete blog error:", err);
      const serverMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 401) alert("Unauthorized: Please login.");
      else alert("Failed to delete blog: " + serverMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded shadow transition"
          onClick={() => setShowForm(true)}
        >
          Add Blog
        </button>
      </div>

      {/* Popup Modal for Blog Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowForm(false)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Blog</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="link"
                  placeholder="Link"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-50 file:text-pink-700"
                />
              </div>
              {formError && (
                <div className="text-red-600 text-sm">{formError}</div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
                >
                  Add Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin h-6 w-6 text-pink-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-gray-600">Loading blogs...</span>
        </div>
      ) : (
        <div>
          {blogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No blogs found.</div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col md:flex-row gap-4"
                >
                  {blog.image && (
                    <div className="flex-shrink-0 w-full md:w-48 flex items-center justify-center">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="rounded-md object-cover w-full h-auto"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{blog.title}</h3>
                    <p className="text-gray-600 mb-2">{blog.description}</p>
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-pink-600 hover:underline font-medium"
                    >
                      Read More
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow transition"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Simple fade-in animation for modal */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
};

export default Blog;