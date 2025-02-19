import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../hooks/axiosSecure";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CheckoutForm = ({ offerId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (amount > 0) {
      axiosSecure.post('/create-payment-intent', { price: amount })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [amount, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setProcessing(true);

    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || 'anonymous',
              name: user?.displayName || 'anonymous'
            }
          }
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Update offer status and save payment info
        await axiosSecure.patch(`/offers/${offerId}`, {
          status: 'bought',
          transactionId: paymentIntent.id,
          paymentDate: new Date()
        });

        toast.success('Payment successful!');
        navigate('/dashboard/property-bought');
      }
    } catch (err) {
      setError('An error occurred during payment processing');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="btn btn-primary w-full"
      >
        {processing ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm; 