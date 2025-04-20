const createCheckoutSession = async (priceId) => {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.VITE_API_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  
    return { clientSecret: session.client_secret };
  };
  