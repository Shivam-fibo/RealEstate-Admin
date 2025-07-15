import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { toast } from 'react-toastify';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://real-esate-backend.vercel.app/api/admin/allProperty', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`https://real-esate-backend.vercel.app/api/admin/property/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          toast.success('Property deleted successfully');
          setProperties(properties.filter(property => property._id !== id));
        } else {
          throw new Error('Failed to delete property');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (!isAuthorized) return null;

  if (loading) return <div>Loading properties...</div>;

  return (
    <div className="property-list max-w-6xl mx-auto p-6">
  <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Manage Properties</h2>

  <div className="flex justify-end mb-4">
    <button
      onClick={() => navigate('/add-property')}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Add New Property
    </button>
  </div>

  <div className="property-grid grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {properties.map(property => (
      <div
        key={property._id}
        className="property-card bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
      >
        <div className="property-images h-48 bg-gray-100 overflow-hidden">
          {property.images.slice(0, 1).map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Property ${index}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        <div className="property-details p-4 space-y-1">
          <h3 className="text-lg font-semibold text-blue-600">{property.title}</h3>
          <p className="text-gray-700 font-medium">₹{property.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{property.location}</p>
          <p className="text-sm text-gray-500">{property.bhk} BHK</p>
          <p className="text-sm text-gray-500">
            Builder: <span className="font-medium">{property.builder?.name || 'Unknown'}</span>
          </p>
        </div>

        <div className="property-actions flex justify-between px-4 py-2 border-t">
          <button
            onClick={() => navigate(`/edit-property/${property._id}`)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(property._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default PropertyList;