import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconImage from '../assets/Google.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Onboarding1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authResult = urlParams.get('auth');
    const errorMessage = urlParams.get('error');
    urlParams.get('action');

    if (authResult === 'success') {
      fetch('https://somaai.onrender.com/auth/user', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userId', data.user.id);
            
            // Ensure user is created in our database
            return fetch('https://somaai.onrender.com/api/user/ensure-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                userId: data.user.id, 
                email: data.user.email,
                name: data.user.name // Assuming Google provides a name
              })
            });
          } else {
            throw new Error('User data not found');
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            navigate('/onboarding2');
          } else {
            throw new Error(data.message || 'Failed to create user profile');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setError(err.message || 'An unexpected error occurred');
        });
    } else if (authResult === 'failure' || errorMessage) {
      setError(errorMessage || 'Authentication failed');
    }
  }, [navigate, location]);

  const initiateGoogleAuth = (action) => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}${location.pathname}`);
    window.location.href = `https://somaai.onrender.com/auth/google?action=${action}&redirect_url=${redirectUrl}`;
  };

  return (
    <section className="text-center mt-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        className="bg-[#1E1548] text-white rounded-full w-full px-16 py-2 flex items-center justify-center mb-4 transition-transform transform hover:bg-[#3a2d78] active:bg-[#1a1038] active:scale-95"
        onClick={() => initiateGoogleAuth('signup')}
        aria-label="Sign up with Google"
      >
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Sign up with Google
      </button>
      <p className="text-gray-500 mb-4">Already have an account?</p>
      <button
        className="text-[#1E1548] rounded-full px-16 py-3 flex items-center justify-center border border-blue-800 transition-transform transform hover:bg-[#e0e0e0] active:bg-[#d0d0d0] active:scale-95"
        onClick={() => initiateGoogleAuth('login')}
        aria-label="Log in with Google"
      >
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Log in with Google
      </button>
    </section>
  );
};












