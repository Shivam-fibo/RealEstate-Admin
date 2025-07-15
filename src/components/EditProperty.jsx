import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../main';
import { toast } from 'react-toastify';

const EditProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [builders, setBuilders] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property data
        const propResponse = await fetch(`https://real-esate-backend.vercel.app/api/admin/property/${id}`, {
          credentials: 'include'
        });
        
        if (!propResponse.ok) throw new Error('Failed to fetch property');
        
        const propData = await propResponse.json();
        setProperty(propData);
        setImagePreviews(propData.images.map(img => img.url));

        // Fetch builders
        const buildersResponse = await fetch('https://real-esate-backend.vercel.app/api/admin/builders', {
          credentials: 'include'
        });
        
        if (!buildersResponse.ok) throw new Error('Failed to fetch builders');
        
        const buildersData = await buildersResponse.json();
        setBuilders(buildersData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty({
      ...property,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImages(files);
    setImagePreviews([...property.images.map(img => img.url), ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append all property data
      Object.entries(property).forEach(([key, value]) => {
        if (key !== 'images' && key !== '_id' && key !== '__v') {
          formData.append(key, value);
        }
      });

      // Append new images if any
      if (newImages.length > 0) {
        newImages.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`https://real-esate-backend.vercel.app/api/admin/property/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update property');
      }

      toast.success('Property updated successfully!');
      navigate('/properties');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isAuthorized) return null;
  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="edit-property max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
  <h2 className="text-2xl font-bold mb-6 text-blue-600">Edit Property</h2>

  <form onSubmit={handleSubmit} className="space-y-8">

    {/* Basic Information */}
    <div className="form-section">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={property.title}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={property.price}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        />

        <textarea
          name="location"
          placeholder="Full Address (Location)"
          value={property.location}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md col-span-full"
        />
      </div>
    </div>

    {/* Property Details */}
    <div className="form-section">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Property Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="bhk"
          value={property.bhk}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">Select BHK</option>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} BHK</option>
          ))}
        </select>

        <input
          type="number"
          name="carpetArea"
          placeholder="Carpet Area (sq.ft)"
          value={property.carpetArea}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        />

        <input
          type="number"
          name="builtUpArea"
          placeholder="Built-up Area (sq.ft)"
          value={property.builtUpArea}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        />

        <select
          name="furnishingStatus"
          value={property.furnishingStatus}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>
    </div>

    {/* Builder Selection */}
    <div className="form-section">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Builder Information</h3>
      <select
        name="builder"
        value={property.builder._id}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded-md w-full"
      >
        <option value="">Select Builder</option>
        {builders.map(builder => (
          <option key={builder._id} value={builder._id}>{builder.name}</option>
        ))}
      </select>
    </div>

    {/* Additional Information */}
    <div className="form-section">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="reraApproved"
            checked={property.reraApproved}
            onChange={handleChange}
          />
          RERA Approved
        </label>

        {property.reraApproved && (
          <input
            type="text"
            name="reraId"
            placeholder="RERA ID"
            value={property.reraId || ''}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        )}

        <select
          name="ownership"
          value={property.ownership}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Freehold">Freehold</option>
          <option value="Leasehold">Leasehold</option>
          <option value="Co-operative Society">Co-operative Society</option>
          <option value="Power of Attorney">Power of Attorney</option>
        </select>

        <select
          name="completionStatus"
          value={property.completionStatus}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Under-construction">Under-construction</option>
          <option value="Ready to move">Ready to move</option>
          <option value="New Launch">New Launch</option>
        </select>

        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md"
        />

        <input
          type="date"
          name="possessionDate"
          placeholder="Possession Date"
          value={property.possessionDate ? new Date(property.possessionDate).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
    </div>

    {/* Image Upload */}
    <div className="form-section">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Property Images</h3>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 p-2 rounded-md"
      />
      <div className="flex flex-wrap mt-4 gap-3">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            className="w-24 h-24 object-cover border rounded-md"
          />
        ))}
      </div>
    </div>

    {/* Actions */}
    <div className="form-actions flex justify-end gap-4">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
      <button
        type="button"
        onClick={() => navigate('/properties')}
        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
      >
        Cancel
      </button>
    </div>
  </form>
</div>

  );
};

export default EditProperty;