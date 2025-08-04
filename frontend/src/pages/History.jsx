import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // 1. Import Modal
import { AuthContext } from '../context/AuthContext';
import './History.css';

// 2. Set the app element for accessibility
Modal.setAppElement('#root');

const History = () => {
  const { authState } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 3. Add state for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (authState.isAuthenticated) {
        try {
          const res = await axios.get('http://localhost:5001/api/history');
          setHistory(res.data);
        } catch (err) {
          console.error('Failed to fetch history:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [authState.isAuthenticated]);

  // 4. Functions to control the modal
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="history-container"><p>Loading history...</p></div>;
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <h1>Prediction History</h1>
        {history.length === 0 ? (
          <p>You have no past predictions.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              // 5. Make the item clickable
              <div key={item.id} className="history-item" onClick={() => openModal(item.imagePath)}>
                <img src={item.imagePath} alt="X-ray thumbnail" className="history-thumbnail" />
                <div className="history-item-details">
                  <span className="history-result">{item.result.replace('_', ' ')}</span>
                  <span className="history-confidence">{(item.confidence * 100).toFixed(2)}% Confidence</span>
                </div>
                <span className="history-date">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. The Modal component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="X-Ray Image Preview"
        className="image-modal"
        overlayClassName="image-modal-overlay"
      >
        <img src={selectedImage} alt="X-ray preview" />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default History;