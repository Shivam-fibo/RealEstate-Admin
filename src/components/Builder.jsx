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
      const response = await fetch('http://localhost:5000/api/admin/createBuilder', {
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
    <div className="builder-form">
      <h2>Create Builder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={builderData.name}
          onChange={(e) => setBuilderData({...builderData, name: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={builderData.description}
          onChange={(e) => setBuilderData({...builderData, description: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={builderData.contactEmail}
          onChange={(e) => setBuilderData({...builderData, contactEmail: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={builderData.phoneNumber}
          onChange={(e) => setBuilderData({...builderData, phoneNumber: e.target.value})}
          required
        />
        <button type="submit">Create Builder</button>
      </form>
    </div>
  );
};

export default Builder;