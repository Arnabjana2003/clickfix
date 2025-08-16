import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { BookingApis } from "../apis/BookingApis.js";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");
  const transactionId = queryParams.get("transactionId");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!bookingId) {
          throw new Error("Booking ID not found");
        }

        const { data } = await BookingApis.checkBookingPaymentStatus(
          transactionId
        );
        localStorage.removeItem("ongoing_payment");
        console.log(data);
        if (data?.paymentStatus == "success") {
          setBooking(data.orderData);
        } else {
          navigate("/payment/cancel?redirected=1");
        }
      } catch (err) {
        console.log(err);
        toast.error(String(err?.message || err));
        // navigate("/bookings")
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your booking details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold mt-4">
              Payment Verification Failed
            </h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => navigate("/bookings")}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-100 px-6 py-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <FaCheckCircle
                className="h-10 w-10 text-green-600"
                aria-hidden="true"
              />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for your payment. Your booking has been confirmed.
            </p>
          </div>

          {/* Booking Details */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Booking Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p className="mt-1 text-sm text-gray-900">{bookingId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Transaction ID
                </p>
                <p className="mt-1 text-sm text-gray-900">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="mt-1 text-sm text-gray-900">
                  {booking?.serviceName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                <p className="mt-1 text-sm text-gray-900">
                  ₹
                  {booking?.amount ? (booking.amount / 100).toFixed(2) : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(booking?.createdAt || new Date()).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-sm text-green-600 font-medium">
                  Confirmed
                </p>
              </div>
            </div>
          </div>

          {/* Service Provider Info (if applicable) */}
          {booking?.provider && (
            <div className="px-6 py-8 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Service Provider
              </h2>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={booking.provider.avatar || "/default-avatar.png"}
                    alt="Provider"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {booking.provider.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {booking.provider.rating
                      ? `⭐ ${booking.provider.rating.toFixed(1)}`
                      : "New provider"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-6 bg-gray-50 text-right">
            <button
              onClick={() => navigate("/bookings")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Bookings
            </button>
            <button
              onClick={() => window.print()}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Print Receipt
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              What happens next?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  You'll receive a confirmation email with all the details
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Our service provider will contact you shortly to schedule the
                  service
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  You can track your booking status in your account dashboard
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
