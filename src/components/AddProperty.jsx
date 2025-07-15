import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    price: '',
    location: '',
    bhk: '',
    carpetArea: '',
    builtUpArea: '',
    furnishingStatus: 'Furnished',
    reraApproved: false,
    reraId: '',
    ownership: 'Freehold',
    completionStatus: 'Ready to move',
    builder: '',
    amenities: '',
    possessionDate: '',
    images: []
  });
  
  const [builders, setBuilders] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  // Fetch builders on component mount
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const response = await fetch('https://real-esate-backend.vercel.app/api/admin/builders', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setBuilders(data);
        }
      } catch (error) {
        console.error('Error fetching builders:', error);
      }
    };
    
    fetchBuilders();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    // Update state
    setPropertyData({
      ...propertyData,
      images: files
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append all property data
      Object.entries(propertyData).forEach(([key, value]) => {
        if (key === 'images') {
          propertyData.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'amenities' && typeof value === 'string') {
          formData.append(key, value.split(',').map(a => a.trim()));
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch('https://real-esate-backend.vercel.app/api/admin/property', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }

      toast.success('Property created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="property-form max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
  <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Add New Property</h2>

  <form onSubmit={handleSubmit} className="space-y-8">

    {/* Basic Information */}
    <div className="form-section space-y-4">
      <h3 className="text-xl font-semibold text-blue-600">Basic Information</h3>
      <input
        type="text"
        placeholder="Title"
        value={propertyData.title}
        onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={propertyData.price}
        onChange={(e) => setPropertyData({ ...propertyData, price: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <textarea
        placeholder="Full Address (Location)"
        value={propertyData.location}
        onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>

    {/* Property Details */}
    <div className="form-section space-y-4">
      <h3 className="text-xl font-semibold text-blue-600">Property Details</h3>
      <select
        value={propertyData.bhk}
        onChange={(e) => setPropertyData({ ...propertyData, bhk: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select BHK</option>
        {[1, 2, 3, 4, 5, 6].map(num => (
          <option key={num} value={num}>{num} BHK</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Carpet Area (sq.ft)"
        value={propertyData.carpetArea}
        onChange={(e) => setPropertyData({ ...propertyData, carpetArea: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        type="number"
        placeholder="Built-up Area (sq.ft)"
        value={propertyData.builtUpArea}
        onChange={(e) => setPropertyData({ ...propertyData, builtUpArea: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <select
        value={propertyData.furnishingStatus}
        onChange={(e) => setPropertyData({ ...propertyData, furnishingStatus: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Furnishing</option>
        <option value="Furnished">Furnished</option>
        <option value="Semi-Furnished">Semi-Furnished</option>
        <option value="Unfurnished">Unfurnished</option>
      </select>
    </div>

    {/* Builder Selection */}
    <div className="form-section space-y-4">
      <h3 className="text-xl font-semibold text-blue-600">Builder Information</h3>
      <select
        value={propertyData.builder}
        onChange={(e) => setPropertyData({ ...propertyData, builder: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Builder</option>
        {builders.map(builder => (
          <option key={builder._id} value={builder._id}>{builder.name}</option>
        ))}
      </select>
    </div>

    {/* Additional Information */}
    <div className="form-section space-y-4">
      <h3 className="text-xl font-semibold text-blue-600">Additional Information</h3>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={propertyData.reraApproved}
          onChange={(e) => setPropertyData({ ...propertyData, reraApproved: e.target.checked })}
        />
        <span className="text-sm">RERA Approved</span>
      </label>

      {propertyData.reraApproved && (
        <input
          type="text"
          placeholder="RERA ID"
          value={propertyData.reraId}
          onChange={(e) => setPropertyData({ ...propertyData, reraId: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
        />
      )}

      <select
        value={propertyData.ownership}
        onChange={(e) => setPropertyData({ ...propertyData, ownership: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Ownership</option>
        <option value="Freehold">Freehold</option>
        <option value="Leasehold">Leasehold</option>
        <option value="Co-operative Society">Co-operative Society</option>
        <option value="Power of Attorney">Power of Attorney</option>
      </select>

      <select
        value={propertyData.completionStatus}
        onChange={(e) => setPropertyData({ ...propertyData, completionStatus: e.target.value })}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Completion Status</option>
        <option value="Under-construction">Under-construction</option>
        <option value="Ready to move">Ready to move</option>
        <option value="New Launch">New Launch</option>
      </select>

      <input
        type="text"
        placeholder="Amenities (comma separated)"
        value={propertyData.amenities}
        onChange={(e) => setPropertyData({ ...propertyData, amenities: e.target.value })}
        className="w-full border border-gray-300 p-2 rounded"
      />

      <input
        type="date"
        placeholder="Possession Date"
        value={propertyData.possessionDate}
        onChange={(e) => setPropertyData({ ...propertyData, possessionDate: e.target.value })}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>

    {/* Image Upload */}
    <div className="form-section space-y-4">
      <h3 className="text-xl font-semibold text-blue-600">Property Images</h3>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        required
        className="w-full"
      />
      <div className="image-previews grid grid-cols-3 gap-2">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            className="w-full h-32 object-cover rounded border"
          />
        ))}
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
    >
      Add Property
    </button>
  </form>
</div>

  );
};

export default AddProperty;