import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    fetchClientSecret();
  }, [bookingId]);

  useEffect(() => {
    if (clientSecret) {
      const initializeCheckout = async () => {
        const stripe = await stripePromise;
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
        });

        checkout.mount('#checkout');
      };

      initializeCheckout();
    }
  }, [clientSecret]);

  return <div id="checkout" />;
};

export default StripeCheckout;
