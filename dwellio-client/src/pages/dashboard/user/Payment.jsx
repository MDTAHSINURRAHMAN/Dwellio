import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../../components/CheckoutForm";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
  const location = useLocation();
  const { offerId, amount, propertyTitle } = location.state;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Helmet>
        <title>Payment | Dwellio</title>
      </Helmet>

      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Complete Your Payment
      </h2>

      <div className="bg-base-200 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">{propertyTitle}</h3>
        <p className="text-lg">Amount to Pay: ${amount}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl">
        <Elements stripe={stripePromise}>
          <CheckoutForm offerId={offerId} amount={amount} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment; 