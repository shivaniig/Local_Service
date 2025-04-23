import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

// Safely load the Stripe publishable key from .env
const stripeKey = loadStripe('pk_test_51RFw9KFLdm8H3uLtVxpCoHglnX3MvNTKPtCMofkG7ahl4ICfdKnu27Fi3ruBnP853snSIeZAXM1PL2rgjjppzzzo00DGNVdbg7');

// Debug check
if (!stripeKey) {
  console.error('❌ Stripe publishable key is missing from .env');
}

const stripePromise = loadStripe('pk_test_51RFw9KFLdm8H3uLtVxpCoHglnX3MvNTKPtCMofkG7ahl4ICfdKnu27Fi3ruBnP853snSIeZAXM1PL2rgjjppzzzo00DGNVdbg7');

const StripeCheckout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        });

        const data = await response.json();

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('❌ No clientSecret returned from backend:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching client secret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [bookingId]);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (clientSecret && stripePromise) {
        const stripe = await stripePromise;

        if (!stripe) {
          console.error('❌ Stripe failed to initialize.');
          return;
        }

        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
        });

        checkout.mount('#checkout');
      }
    };

    initializeCheckout();
  }, [clientSecret]);

  return (
    <div>
      {loading ? (
        <p>Loading checkout...</p>
      ) : (
        <div id="checkout" />
      )}
    </div>
  );
};

export default StripeCheckout;
