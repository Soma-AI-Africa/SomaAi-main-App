import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';
import ReviewScreen from './ReviewScreen';

export const Onboarding25 = () => {
  const navigate = useNavigate();
  const { formData, submitFormData } = useContext(FormDataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  // Handle form submission with loading state and error handling
  const handleProfileUpdate = useCallback(async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const { success, error } = await submitFormData();
      if (!success) {
        throw new Error(error || 'Failed to submit form data');
      }
      console.log('Form data submitted successfully');
      navigate('/home'); // Navigate to home on successful submission
    } catch (err) {
      console.error('Error submitting form data:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, submitFormData]);

  // Show review screen before submission
  const handleReview = () => {
    setShowReview(true);
  };

  // Edit review
  const handleEdit = () => {
    setShowReview(false);
  };

  // Confirm and submit after reviewing
  const handleConfirm = () => {
    setShowReview(false);
    handleProfileUpdate(); // Submit form data after confirmation
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div>
      </div>
      <p className="section-title">~ Welcome To SomaAi</p>
      <h2>Review Your Information</h2>
      {error && <p className="error-message">{error}</p>}
      
      {showReview ? (
        <ReviewScreen
          formData={formData}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
        />
      ) : (
      <div className='w-600'>
        <button
          className="continue-button px-4"
          onClick={handleReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner-container">
              <div className="loading-spinner"></div>
              Submitting...
            </div>
          ) : (
            'Review and Set Up Profile'
          )}
        </button>
        <button
          className="later-button"
          onClick={() => navigate('/home')}
        >
          I will do this later
        </button>
      </div>
      )}
    </div>
  );
};











