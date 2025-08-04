import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      navigate('/'); // Redirect to dashboard on success
    } else {
      setError(result.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Please enter your details to sign in.</p>
        <form onSubmit={onSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;