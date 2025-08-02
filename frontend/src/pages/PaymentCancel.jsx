import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect } from "react";

const PaymentCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");
  const redirected = queryParams.get("redirected");

  useEffect(() => {
    localStorage.removeItem("ongoing_payment");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <MdOutlineCancel className="h-12 w-12 text-red-600" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your booking{" "}
          {bookingId ? `(#${bookingId})` : ""} remains pending.
        </p>

        {/* Booking ID (if available) */}
        {bookingId && (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm font-medium text-gray-700">
              Booking Reference:
            </p>
            <p className="text-sm text-gray-900 font-mono">{bookingId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeftLong className="h-5 w-5 mr-2" />
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Need help?</h3>
          <p className="text-sm text-gray-600">
            Contact our support team at{" "}
            <a
              href="mailto:support@clicknfix.com"
              className="text-blue-600 hover:underline"
            >
              support@clicknfix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
