import { useState, useEffect } from "react";
import axios from "axios";

export default function Coupons() {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: 1,
    usedCount: 0,
    perUserLimit: 1,
    expiry: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  // fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://navdana.com/api/v1/coupon", config);
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://navdana.com/api/v1/coupon",
        formData,
        config
      );
      setMessage(res.data.message || "Coupon created successfully");
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        usageLimit: 1,
        usedCount: 0,
        perUserLimit: 1,
        expiry: "",
        isActive: true,
      });
      fetchCoupons(); // refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Manage Coupons
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto mb-10"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min={1}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min={1}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Used Count
            </label>
            <input
              type="number"
              name="usedCount"
              value={formData.usedCount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per User Limit
            </label>
            <input
              type="number"
              name="perUserLimit"
              value={formData.perUserLimit}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min={1}
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date & Time
            </label>
            <input
              type="datetime-local"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>

      {message && (
        <p className="text-center mb-6 text-lg font-medium text-green-600">
          {message}
        </p>
      )}

      {/* Coupon List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Available Coupons
        </h2>
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-blue-600">
                  {coupon.code}
                </h3>
                <p className="text-gray-600">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue} flat`}
                </p>
                <p className="text-sm text-gray-500">
                  Expiry: {new Date(coupon.expiry).toLocaleString()}
                </p>
                <div className="mt-2 flex flex-col space-y-1 text-sm text-gray-700">
                  <span>Usage Limit: {coupon.usageLimit}</span>
                  <span>Used Count: {coupon.usedCount}</span>
                  <span>Per User Limit: {coupon.perUserLimit}</span>
                  <span>
                    Status: {coupon.isActive ? "Active ✅" : "Inactive ❌"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
