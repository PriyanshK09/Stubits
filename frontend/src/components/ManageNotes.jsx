import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Edit, Trash2, FileText, ExternalLink 
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
      const response = await fetch('http://localhost:5000/api/admin/materials', {
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
        const response = await fetch(`http://localhost:5000/api/admin/materials/${id}`, {
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

return (
    <div className="manage-notes">
        <div className="notes-header">
            <h1>Manage Study Materials</h1>
            <button 
                className="add-btn"
                onClick={() => setActiveTab('upload')}
            >
                <Plus />
                Add New Material
            </button>
        </div>

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
                <div className="loading">Loading...</div>
            ) : (
                materials
                    .filter(m => 
                        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(material => (
                        <div key={material._id} className="material-card">
                            <div 
                                className="material-content"
                                onClick={() => handlePreview(material.fileUrl)}
                                style={{ cursor: 'pointer' }}
                            >
                                <FileText className="material-icon" />
                                <h3>{material.title}</h3>
                                <p>{material.description}</p>
                                <div className="material-meta">
                                    <span>{material.category}</span>
                                    <span>₹{material.price}</span>
                                </div>
                            </div>
                            <div className="material-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEditClick(material)}
                                >
                                    <Edit />
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(material._id)}
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    ))
            )}
        </div>

        {showPreview && (
            <div className="preview-modal">
                <div className="preview-content">
                    <h3>Preview Notes</h3>
                    <p>Do you want to view these notes?</p>
                    <div className="preview-actions">
                        <button 
                            className="preview-btn"
                            onClick={() => {
                                window.open(previewUrl, '_blank');
                                setShowPreview(false);
                            }}
                        >
                            <ExternalLink size={16} />
                            Open Notes
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
);
};

export default ManageNotes;