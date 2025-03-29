import React, { useEffect, useState } from "react";

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/contact", {
          method: "GET"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="h-[97vh] p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-black mb-6">
        Contact Messages
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-600">No messages found.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg._id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  {msg.firstName} {msg.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {msg.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {msg.phone}
                </p>
                <p className="mt-2 text-gray-700">{msg.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Contact;
