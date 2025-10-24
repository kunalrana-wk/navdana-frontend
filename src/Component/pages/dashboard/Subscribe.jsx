import axios from "axios";
import React, { useEffect, useState } from "react";

const Subscribe = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token")

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get("https://navdana.com/api/v1/subscribe", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let subs = res?.data?.data || res?.data?.subscribers;
      setSubscribers(subs || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(message)

    try {
      let config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      }

      let dataToSend = { message }

      await axios.post('https://navdana.com/api/v1/subscribe/send-mail',
        dataToSend,
        config
      )
    } catch (error) {

    }

  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-5">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
          📬 Subscribers List
        </h2>

        {subscribers.length === 0 ? (
          <p className="text-center text-gray-500">No subscribers yet.</p>
        ) : (
          <div className="grid gap-3 mb-6">
            {subscribers.map((s) => (
              <div
                key={s._id}
                className="flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-all rounded-lg p-3 shadow-sm border border-indigo-100"
              >
                <p className="text-indigo-700 font-medium">{s.email}</p>
                <span className="text-sm text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <div>
          <label
            htmlFor="message"
            className="block text-gray-600 font-medium mb-2"
          >
            ✉️ Send a message to all subscribers
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <button
            className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-all"
            onClick={handleSubmit}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
