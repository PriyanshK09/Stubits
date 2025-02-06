import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import './UploadMaterial.css';

const UploadMaterial = ({ adminPassword, editData, setEditData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'iitjee',
    subject: '',
    price: '',
    pages: '',
    fileUrl: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editData 
        ? `https://stubits.onrender.com/api/admin/materials/${editData._id}`
        : 'https://stubits.onrender.com/api/admin/materials';
      
      const method = editData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'adminKey': adminPassword
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          category: 'iitjee',
          subject: '',
          price: '',
          pages: '',
          fileUrl: ''
        });
        setEditData(null);
        alert(editData ? 'Material updated successfully!' : 'Material uploaded successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-material">
      <h1>{editData ? 'Edit Study Material' : 'Upload Study Material'}</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter material title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter description"
            required
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="iitjee">IIT-JEE</option>
              <option value="neet">NEET</option>
              <option value="boards">Board Exams</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            >
              <option value="">Select Subject</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="mathematics">Mathematics</option>
              <option value="biology">Biology</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Enter price"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Pages</label>
            <input
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({...formData, pages: e.target.value})}
              placeholder="Number of pages"
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>File URL</label>
          <input
            type="url"
            value={formData.fileUrl}
            onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
            placeholder="Enter file URL"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          <Upload size={18} />
          {loading ? 'Processing...' : editData ? 'Save Changes' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;