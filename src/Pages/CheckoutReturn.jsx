import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RFw9KFLdm8H3uLtVxpCoHglnX3MvNTKPtCMofkG7ahl4ICfdKnu27Fi3ruBnP853snSIeZAXM1PL2rgjjppzzzo00DGNVdbg7');

const CheckoutReturn = () => {
  const [status, setStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId) {
      const fetchSession = async () => {
        const stripe = await stripePromise;
        const { error, status } = await stripe.retrieveEmbeddedCheckoutSession(sessionId);
        if (error) {
          console.error(error);
        } else {
          setStatus(status);
        }
      };
      fetchSession();
    }
  }, [location.search]);

  if (status === 'complete') {
    return <div>Payment successful!</div>;
  } else if (status === 'expired') {
    return <div>Payment session expired. Please try again.</div>;
  } else {
    return <div>Processing payment...</div>;
  }
};

export default CheckoutReturn;
