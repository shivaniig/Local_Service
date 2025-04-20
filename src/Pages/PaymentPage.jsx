import React from 'react';
import { Link, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { bookingId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
      <p className="text-lg mb-6">
        Click below to proceed with payment for Booking ID: <span className="font-semibold">{bookingId}</span>
      </p>
      <Link
        to={`/checkout/${bookingId}`}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Pay with Stripe
      </Link>
    </div>
  );
};

export default PaymentPage;
