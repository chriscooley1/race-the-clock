import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to the Letter Reader App</h1>
      <button onClick={() => navigate('/register')}>Register</button>
      <button onClick={() => navigate('/login')}>Already Registered</button>
    </div>
  );
};

export default LandingPage;
