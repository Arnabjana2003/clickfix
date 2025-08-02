import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import BookingDetails from "./BookingDetails";
import ProviderApis from "../../apis/ProviderApis";
import toast from "react-hot-toast";

function BookingCard({ bookingData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(bookingData?.status);
  }, [bookingData]);
  const handleUpdateStatus = async (newStatus) => {
    try {
      await ProviderApis.updateBookingStatus({
        bookingId: bookingData?.bookingId,
        newStatus,
      });
      setStatus(newStatus);
      toast.success("Booking's status is updated");
    } catch (error) {
      toast.error(String(error?.message || error));
    }
  };
  return (
    <div className="w-[32vw] lg:w-[23vw] h-72 shadow-xl rounded-2xl bg-white p-5 text-slate-700 relative">
      <h5 className="text-center font-bold text-xl">{bookingData?.service}</h5>
      <div className="mt-5 line-clamp-1">
        <span className="font-medium">Date: </span>{" "}
        {new Date(bookingData?.date).toLocaleString()}
      </div>
      <div className="mt-5 line-clamp-1">
        <span className="font-medium">Customer: </span>{" "}
        {bookingData?.customerName || "N/A"}
      </div>
      <div className="mt-5 line-clamp-2">
        <span className="font-medium">Address: </span>:{" "}
        {bookingData?.address || "N/A"}
      </div>
      <div
        className="mt-5 flex justify-center"
        onClick={() => setShowDetails(true)}
      >
        <button className="bg-slate-300 px-4 py-2 rounded-lg font-semibold text-slate-800 cursor-pointer">
          View Details
        </button>
      </div>

      <label
        className={`absolute top-2 -left-6 -rotate-40 px-4 shadow ${
          status == "completed"
            ? "bg-green-300"
            : status == "confirmed"
            ? "bg-blue-300"
            : status == "ongoing"
            ? "bg-yellow-300"
            : "bg-red-300"
        }`}
      >
        {status == "confirmed" ? "Scheduled" : status || "N/A"}
      </label>

      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)}>
        <BookingDetails
          bookingData={{ ...bookingData, status }}
          onStatusUpdate={handleUpdateStatus}
        />
      </Modal>
    </div>
  );
}

export default BookingCard;
