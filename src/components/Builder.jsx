import React, { useState, useContext } from 'react';
import { Context } from '../main';
import { toast } from 'react-toastify';
import Login from './Login';

const Builder = () => {
  const [builderData, setBuilderData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    phoneNumber: ''
  });
  const { isAuthorized } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://real-esate-backend.vercel.app/api/admin/createBuilder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(builderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create builder');
      }

      ToastContainer.success('Builder created successfully!');
      setBuilderData({
        name: '',
        description: '',
        contactEmail: '',
        phoneNumber: ''
      });
    } catch (error) {
      ToastContainer.error(error.message);
    }
  };

  if (!isAuthorized) {
    return <Login/>
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-8">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
    <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Create Builder</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={builderData.name}
        onChange={(e) => setBuilderData({ ...builderData, name: e.target.value })}
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      
      <textarea
        placeholder="Description"
        value={builderData.description}
        onChange={(e) => setBuilderData({ ...builderData, description: e.target.value })}
        required
        rows={3}
        className="w-full rounded-md border border-gray-300 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <input
        type="email"
        placeholder="Contact Email"
        value={builderData.contactEmail}
        onChange={(e) => setBuilderData({ ...builderData, contactEmail: e.target.value })}
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={builderData.phoneNumber}
        onChange={(e) => setBuilderData({ ...builderData, phoneNumber: e.target.value })}
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Create Builder
      </button>
    </form>
  </div>
</div>

  );
};

export default Builder;