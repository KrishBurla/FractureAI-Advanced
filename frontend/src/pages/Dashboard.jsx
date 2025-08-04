import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ResultCard from '../components/ResultCard/ResultCard';
import './Dashboard.css';
import { ThreeDots } from 'react-loader-spinner';
import AnimatedCard from '../components/AnimatedCard';

const Dashboard = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  // State for the uploaded file and its preview
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // State for the API response
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      // Reset previous results when a new file is dropped
      setResult(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!authState.isAuthenticated) {
      setError('Please log in to analyze an image.');
      return;
    }

    if (!file) {
      alert('Please upload an image first.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5001/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (event) => {
  if (event) {
    event.stopPropagation(); // Prevents the dropzone from opening
  }
  setFile(null);
  setPreview(null);
  setResult(null);
  setError('');
};

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user ? user.fullName : 'Guest'}</h1>
        <p>Upload an X-ray image for AI-powered bone fracture detection</p>
      </div>

      <AnimatedCard>
        <div className="upload-card">
          {result && <ResultCard user={user} result={result} onReset={handleReset} />}
          
          {error && <div className="alert-message">{error}</div>}
          
          {loading && (
            <div className="loading-container">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="var(--primary)"
                ariaLabel="three-dots-loading"
                visible={true}
              />
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <h4>{isDragActive ? 'Drop the image here ...' : 'Drop your X-ray image here'}</h4>
                  <p>or click to browse files</p>
                </div>
              )}
            </div>
          )}

          {preview && !result && !loading && (
            <button onClick={handleAnalyze} className="analyze-button">
              Analyze X-ray
            </button>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Dashboard;