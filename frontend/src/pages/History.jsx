import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { AuthContext } from '../context/AuthContext';
import './History.css';

Modal.setAppElement('#root');

const History = () => {
  const { authState } = useContext(AuthContext);
  const [history, setHistory] = useState([]); // Master list of all predictions
  const [filteredHistory, setFilteredHistory] = useState([]); // List to be displayed
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Fetch all history data when the component loads
  useEffect(() => {
    const fetchHistory = async () => {
      if (authState.isAuthenticated) {
        try {
          const res = await axios.get('http://localhost:5001/api/history', {
            headers: { 'x-auth-token': authState.token }
          });
          setHistory(res.data);
          setFilteredHistory(res.data); // Initially, display all history
        } catch (err) {
          console.error('Failed to fetch history:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [authState.isAuthenticated, authState.token]);

  // --- NEW: Effect to filter history when search term changes ---
  useEffect(() => {
    const results = history.filter(prediction =>
      prediction.patientId && prediction.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(results);
  }, [searchTerm, history]);
  // --- END ---

  const openModal = (prediction) => {
    setSelectedPrediction(prediction);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPrediction(null);
    setIsZoomed(false);
  };

  const formatPredictionText = (text) => {
    if (!text) return 'N/A';
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
  
  const handleImageClick = () => setIsZoomed(!isZoomed);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to permanently delete your entire prediction history?')) {
      try {
        await axios.delete('http://localhost:5001/api/history', {
          headers: { 'x-auth-token': authState.token }
        });
        setHistory([]); // Clear the master list
        setSearchTerm(''); // Reset search term
      } catch (err) {
        console.error('Failed to clear history:', err);
        alert('Could not clear history. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="history-container"><p>Loading history...</p></div>;
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <h1>Prediction History</h1>

        {/* --- NEW: Search Bar --- */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Patient ID..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* --- END --- */}

        {history.length === 0 ? (
          <p>You have no past predictions.</p>
        ) : filteredHistory.length === 0 ? (
            <p>No predictions found for that Patient ID.</p>
        ) : (
          <>
            <div className="history-list">
              {/* --- MODIFIED: Map over filteredHistory --- */}
              {filteredHistory.map((item) => (
                <div key={item.id} className="history-item" onClick={() => openModal(item)}>
                  <img src={item.imagePath} alt="X-ray thumbnail" className="history-thumbnail" />
                  <div className="history-item-details">
                    <span className="history-result">{formatPredictionText(item.result)}</span>
                    <span className="history-patient-info">
                        {item.patientName} (ID: {item.patientId || 'N/A'})
                    </span>
                    <span className="history-confidence">{(item.confidence * 100).toFixed(2)}% Confidence</span>
                  </div>
                  <span className="history-date">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="clear-history-container">
              <button onClick={handleClearHistory} className="clear-history-button">
                Clear All History
              </button>
            </div>
          </>
        )}
      </div>

      {selectedPrediction && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Prediction Details"
          className="history-modal"
          overlayClassName="history-modal-overlay"
        >
          <button onClick={closeModal} className="close-modal-button">×</button>
          <h3>Analysis Details</h3>
          <div className="history-modal-content">
            <div 
              className={`history-modal-image-container ${isZoomed ? 'zoomed' : ''}`}
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={selectedPrediction.imagePath} 
                alt="X-ray preview" 
                style={{
                  transform: `scale(${isZoomed ? 2.5 : 1})`,
                  transformOrigin: `${position.x}% ${position.y}%`
                }}
              />
            </div>
            <div className="history-modal-details-container">
              <div className="patient-details-section">
                <h4>Patient Details</h4>
                <p><strong>ID:</strong> {selectedPrediction.patientId || 'N/A'}</p>
                <p><strong>Name:</strong> {selectedPrediction.patientName}</p>
                <p><strong>Age:</strong> {selectedPrediction.patientAge}</p>
                <p><strong>Sex:</strong> {selectedPrediction.patientSex}</p>
              </div>
              <div className="analysis-details-section">
                <h4>Analysis</h4>
                <p><strong>Result:</strong> {formatPredictionText(selectedPrediction.result)}</p>
                <p><strong>Confidence:</strong> {(selectedPrediction.confidence * 100).toFixed(2)}%</p>
                <p><strong>Date:</strong> {new Date(selectedPrediction.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default History;