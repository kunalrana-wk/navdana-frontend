// src/pages/Users.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaBuilding, FaSpinner } from 'react-icons/fa'; // Icons for better UI

const API_URL = "https://navdana.com/api/v1/user";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    DOB: "",
    phoneNumber: "",
    role: "customer",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setFormError("");
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let userList = res.data?.data || res.data?.users || res.data || [];
      if (!Array.isArray(userList) && Array.isArray(res.data?.users)) {
        userList = res.data.users;
      }
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error fetching users"
      );
      setUsers([]);
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching users:", error);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    setLoading(true);

    // Filter out empty DOB and password if editing
    const dataToSend = { ...formData };
    if (!dataToSend.DOB) delete dataToSend.DOB;
    if (!dataToSend.phoneNumber) delete dataToSend.phoneNumber;
    
    try {
      if (editingId) {
        // Handle PUT (Update) - Password only included if provided
        if (!dataToSend.password) delete dataToSend.password;
        await axios.put(`${API_URL}/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg("User updated successfully!");
      } else {
        // Handle POST (Create)
        await axios.post(API_URL, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg("User added successfully!");
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        DOB: "",
        phoneNumber: "",
        role: "customer",
      });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error saving user"
      );
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving user:", error);
      }
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      DOB: "",
      phoneNumber: "",
      role: "customer",
    });
    setEditingId(null);
    setFormError("");
    setSuccessMsg("");
  };

  // Note: handleDelete and handleEdit functions were removed as requested

  return (
    <div className="p-0 m-0 w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        {/* <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">
          <FaUserPlus className="inline-block mr-3 text-blue-600" /> Manage User Accounts
        </h2> */}
{/* 
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md mb-6 text-sm">
            {formError}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mb-6 text-sm">
            {successMsg}
          </div>
        )} */}

        {/* Form - Enhanced Style */}
        <div className="mb-10 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
          
         
            {/* Form Fields (Original Structure Kept for Functionality) */}
            {/* Name */}
            
            
            {/* Actions */}
            
               
              
        </div>


        {/* User List/Table */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            User Accounts ({users.length})
        </h3>
        
        {loading && users.length === 0 && (
          <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-md">
            <FaSpinner className="animate-spin text-blue-600 text-3xl mr-3" />
            <span className="text-lg text-gray-600">Loading Users...</span>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-md text-gray-500 text-lg">
            No user accounts found.
          </div>
        )}

        {/* Desktop Table - More Attractive Design */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">User Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">DOB/Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Orders</th>
                  {/* Replaced 'Name' with 'Created Date' */}
                  <th className="px-4 py-3 text-left text-sm font-semibold flex items-center">
                    <FaCalendarAlt className="mr-1" /> Created Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr 
                    key={u._id} 
                    className={`transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/50 border-b border-gray-200`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 break-all">{u.email}</td>
                    <td className="px-4 py-3 text-sm capitalize">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-red-200 text-red-800' :
                          u.role === 'manager' ? 'bg-yellow-200 text-yellow-800' :
                          u.role === 'staff' ? 'bg-green-200 text-green-800' :
                          'bg-gray-200 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {u.DOB ? <div className='flex items-center'><FaCalendarAlt className='mr-1 text-gray-400'/> {new Date(u.DOB).toLocaleDateString()}</div> : "—"}
                      {u.phoneNumber && <div className='flex items-center mt-1'><FaPhoneAlt className='mr-1 text-gray-400'/> {u.phoneNumber}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700">
                      {Array.isArray(u.orders) ? u.orders.length : 0}
                    </td>
                    {/* Display Created Date */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    {/* Removed Actions column and buttons */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards - More Attractive Design */}
        <div className="block md:hidden">
          <div className="flex flex-col space-y-4">
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition duration-200 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-2 border-b pb-2">
                    <div className="font-extrabold text-lg text-gray-900 leading-tight">{u.name}</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          u.role === 'admin' ? 'bg-red-200 text-red-800' :
                          u.role === 'manager' ? 'bg-yellow-200 text-yellow-800' :
                          u.role === 'staff' ? 'bg-green-200 text-green-800' :
                          'bg-gray-200 text-gray-800'
                      }`}>
                        {u.role}
                    </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center"><FaEnvelope className="text-blue-500 mr-2 w-4"/> <span className="text-gray-600 break-all">{u.email}</span></div>
                  
                  <div className="flex items-center text-xs">
                    <FaCalendarAlt className="text-gray-500 mr-2 w-4"/> 
                    **Created:** {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-dashed mt-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <FaBuilding className="text-gray-500 mr-1 w-3"/> DOB: {u.DOB ? new Date(u.DOB).toLocaleDateString() : "—"}
                    </div>
                    <div className="font-semibold text-sm text-blue-600">
                      Orders: {Array.isArray(u.orders) ? u.orders.length : 0}
                    </div>
                  </div>

                  {u.phoneNumber && (
                    <div className="flex items-center text-xs text-gray-600">
                      <FaPhoneAlt className="text-gray-500 mr-2 w-4"/> Phone: {u.phoneNumber}
                    </div>
                  )}
                </div>
                {/* Removed Edit and Delete buttons */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;