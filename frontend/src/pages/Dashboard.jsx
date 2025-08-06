import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Modal from 'react-modal'; // Import Modal
import { AuthContext } from '../context/AuthContext';
import ResultCard from '../components/ResultCard/ResultCard';
import './Dashboard.css';
import { ThreeDots } from 'react-loader-spinner';
import AnimatedCard from '../components/AnimatedCard';

// Set app element for accessibility
Modal.setAppElement('#root');

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STATE FOR MODAL AND PATIENT DETAILS ---
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState('');
  // --- END ---

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  // This function now just OPENS the modal
  const handleAnalyzeClick = () => {
    if (!authState.isAuthenticated) {
      setError('Please log in to analyze an image.');
      return;
    }
    if (!file) {
      alert('Please upload an image first.');
      return;
    }
    setModalIsOpen(true);
  };

  // This new function handles the final submission FROM the modal
  const handleConfirmAnalysis = async (e) => {
    e.preventDefault(); // Prevent form from reloading page
    if (!patientName || !patientAge || !patientSex) {
      alert("Please fill in all patient details.");
      return;
    }

    setModalIsOpen(false);
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    // --- FIX: APPEND PATIENT DETAILS TO FORMDATA ---
    formData.append('patientName', patientName);
    formData.append('patientAge', patientAge);
    formData.append('patientSex', patientSex);

    try {
      const res = await axios.post(`${API_URL}/api/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': authState.token,
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.response?.data?.details || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (event) => {
    if (event) event.stopPropagation();
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    setPatientName('');
    setPatientAge('');
    setPatientSex('');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user ? user.fullName : 'Guest'}</h1>
        <p>Upload an X-ray image for AI-powered bone fracture detection</p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Patient Details"
        className="patient-modal"
        overlayClassName="patient-modal-overlay"
      >
        <h2>Patient Details</h2>
        <p>Please enter the following information before analysis.</p>
        <form onSubmit={handleConfirmAnalysis} className="patient-details-form">
          <label>Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g., John Doe"
            required
          />
          <label>Patient Age</label>
          <input
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="e.g., 45"
            required
          />
          <label>Patient Sex</label>
          <select value={patientSex} onChange={(e) => setPatientSex(e.target.value)} required>
            <option value="" disabled>Select Sex...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div className="modal-buttons">
            <button type="button" onClick={() => setModalIsOpen(false)} className="modal-cancel-button">Cancel</button>
            <button type="submit" className="modal-confirm-button">Confirm & Analyze</button>
          </div>
        </form>
      </Modal>

      <AnimatedCard>
        <div className="upload-card">
          {result && <ResultCard user={user} result={result} onReset={handleReset} />}
          {error && <div className="alert-message">{error}</div>}
          {loading && (
            <div className="loading-container">
              <ThreeDots height="80" width="80" radius="9" color="var(--primary)" visible={true} />
              <p>Analyzing, please wait...</p>
            </div>
          )}
          {!result && !loading && (
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''} ${preview ? 'ready' : ''}` })}>
              <input {...getInputProps()} />
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="X-ray preview" className="image-preview" />
                  <button onClick={handleReset} className="clear-button">×</button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <h4>{isDragActive ? 'Drop the image here ...' : 'Drop your X-ray image here'}</h4>
                  <p>or click to browse files</p>
                </div>
              )}
            </div>
          )}
          {preview && !result && !loading && (
            <button onClick={handleAnalyzeClick} className="analyze-button">
              Analyze X-ray
            </button>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Dashboard;