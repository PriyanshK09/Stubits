import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Edit, Trash2, FileText, ExternalLink, Eye, EyeOff, Loader 
} from 'lucide-react';
import './ManageNotes.css';

const ManageNotes = ({ adminPassword, setActiveTab, setEditData }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://stubits.onrender.com/api/admin/materials', {
        headers: {
          'adminKey': adminPassword
        }
      });
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
    setLoading(false);
  }, [adminPassword]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const response = await fetch(`https://stubits.onrender.com/api/admin/materials/${id}`, {
          method: 'DELETE',
          headers: {
            'adminKey': adminPassword
          }
        });
        if (response.ok) {
          fetchMaterials();
        }
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handlePreview = (url) => {
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const handleEditClick = (material) => {
    setEditData(material);
    setActiveTab('upload');
  };

  const handleToggleVisibility = async (id, isHidden) => {
    try {
      const response = await fetch(`https://stubits.onrender.com/api/admin/materials/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'adminKey': adminPassword
        },
        body: JSON.stringify({ isHidden: !isHidden })
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

return (
  <div className="admin-component-content">
    <div className="admin-component-header">
      <div className="header-text">
        <h2>Manage Study Materials</h2>
        <p>Add, edit, or remove study materials from the platform</p>
      </div>
      <div className="header-actions">
        <button className="add-btn" onClick={() => setActiveTab("upload")}>
          <Plus />
          Add New Material
        </button>
      </div>
    </div>
    <div className="manage-notes">

      <div className="search-bar">
        <Search />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="materials-grid">
        {loading ? (
          <div className="loader-container">
            <div className="loader">
              <Loader size={32} />
            </div>
            <p>Loading study materials...</p>
          </div>
        ) : (
          materials
            .filter(
              (m) =>
                m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((material) => (
              <div 
                key={material._id} 
                className={`material-card ${material.isHidden ? 'hidden' : ''}`}
              >
                {material.isHidden && (
                  <div className="hidden-tag">
                    <EyeOff size={12} />
                    Hidden
                  </div>
                )}
                <div
                  className="material-content"
                  onClick={() => handlePreview(material.fileUrl)}
                  style={{ cursor: "pointer" }}
                >
                  <FileText className="material-icon" />
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                  <div className="material-meta">
                    <span>{material.category}</span>
                    <span>₹{material.price}</span>
                  </div>
                </div>
                <div className="material-actions mn-material-actions">
                  <button
                    className="mn-edit-btn"
                    onClick={() => handleEditClick(material)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="mn-delete-btn"
                    onClick={() => handleDelete(material._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3>Access Study Material</h3>
            <p>Choose an action for this study material</p>
            <div className="preview-actions">
              <button
                className="preview-btn"
                onClick={() => {
                  window.open(previewUrl, "_blank");
                  setShowPreview(false);
                }}
              >
                <ExternalLink size={16} />
                Open Notes
              </button>
              <button
                className="mn-preview-edit-btn"
                onClick={() => {
                  handleEditClick(
                    materials.find((m) => m.fileUrl === previewUrl)
                  );
                  setShowPreview(false);
                }}
              >
                <Edit size={16} />
                Edit Material
              </button>
              <button
                className="mn-preview-delete-btn"
                onClick={() => {
                  handleDelete(
                    materials.find((m) => m.fileUrl === previewUrl)?._id
                  );
                  setShowPreview(false);
                }}
              >
                <Trash2 size={16} />
                Delete Material
              </button>
              <button
                className={`mn-preview-visibility-btn ${
                  materials.find((m) => m.fileUrl === previewUrl)?.isHidden ? 'hidden' : 'visible'
                }`}
                onClick={() => {
                  const material = materials.find((m) => m.fileUrl === previewUrl);
                  handleToggleVisibility(material._id, material.isHidden);
                  setShowPreview(false);
                }}
              >
                {materials.find((m) => m.fileUrl === previewUrl)?.isHidden ? (
                  <>
                    <EyeOff size={16} />
                    Notes: Hidden
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Notes: Visible
                  </>
                )}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default ManageNotes;