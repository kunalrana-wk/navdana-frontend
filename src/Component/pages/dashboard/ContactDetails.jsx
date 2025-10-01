import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Replace this with actual token from localStorage/context
  const token = localStorage.getItem("token"); 

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: "https://navdana.com/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await axiosInstance.get("/contact");
      // Adjust based on your API response shape
      setContacts(res.data.data || res.data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axiosInstance.delete(`/contact/${id}`);
      setContacts(contacts.filter((c) => c._id !== id)); // update UI
    } catch (err) {
      alert("Failed to delete contact");
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      {contacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Message</th>
                <th className="py-2 px-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{contact.name}</td>
                  <td className="py-2 px-4 border-b">{contact.email}</td>
                  <td className="py-2 px-4 border-b">{contact.message}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
