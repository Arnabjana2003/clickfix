import { useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import Modal from "../Modal";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <FiClock className="mr-1" />,
  },
  confirmed: {
    color: "bg-blue-100 text-blue-800",
    icon: <FiCheckCircle className="mr-1" />,
  },
  completed: {
    color: "bg-green-100 text-green-800",
    icon: <FiCheckCircle className="mr-1" />,
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: <FiXCircle className="mr-1" />,
  },
  ongoing: {
    color: "bg-purple-100 text-purple-800",
    icon: <FiClock className="mr-1" />,
  },
};

export default function BookingCard({ booking }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Booking Card */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-fit">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {booking?.service?.name || "ClicknFix Service"}
              </h3>
              <p className="text-sm text-gray-500">
                {booking?.service?.category}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                statusConfig[booking.status].color
              }`}
            >
              {statusConfig[booking.status].icon}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2 text-gray-400" />
              {new Date(
                booking.status == "pending"
                  ? booking?.preferredTime
                  : booking?.scheduledAt
              ).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="mr-2 text-gray-400" />
              {booking?.provider?.name}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiDollarSign className="mr-2 text-gray-400" />$
              {booking?.paymentDetails?.amount.toFixed(2)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="mr-2 text-gray-400" />
              {/* {booking.address.substring(0, 20)}... */}
              <p className="font-medium">
                {booking?.location?.coordinates[0]?.toFixed(3) || "N/A"},
                {booking?.location?.coordinates[1]?.toFixed(3) || null}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 lg:min-w-[50vw]">
          {/* Modal Header */}
          <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>

          {/* Service Details */}
          <div className="py-4 border-b">
            <h3 className="text-lg font-semibold mb-2">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{booking?.service?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{booking?.service?.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="font-medium">
                  {new Date(booking?.preferredTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      statusConfig[booking.status].color
                    }`}
                  >
                    {statusConfig[booking.status].icon}
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Provider Details */}
          {booking.provider && (
            <div className="py-4 border-b">
              <h3 className="text-lg font-semibold mb-2">Service Provider</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {booking.provider.avatar ? (
                    <img
                      src={booking.provider.avatar}
                      alt="Provider"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <FiUser className="text-gray-500 text-xl" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{booking.provider.name}</p>
                  <p className="text-sm text-gray-500">
                    Rating: {booking.provider.rating} ★
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.provider.completedJobs} jobs completed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Address Details */}
          <div className="py-4 border-b">
            <h3 className="text-lg font-semibold mb-2">Service Location</h3>
            <div className="flex items-start">
              <FiMapPin className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="font-medium">
                  {booking?.location?.coordinates[0]?.toFixed(3) || "N/A"},
                  {booking?.location?.coordinates[1]?.toFixed(3) || null}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="py-4 border-b">
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{booking.payment.method}</p>
              </div> */}
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium">
                  ${booking?.paymentDetails?.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      booking?.paymentDetails?.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking?.paymentDetails?.status === "paid"
                      ? "Paid"
                      : "Pending"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium font-mono text-sm">
                  {booking?.paymentDetails?.paymentId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            {booking?.status === "confirmed" && (
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                Cancel Booking
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Contact Provider
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
