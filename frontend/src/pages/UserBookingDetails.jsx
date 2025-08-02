import React, { useEffect, useState } from "react";
import BookingCard from "../components/UserProfile/BookingCard";
import OuterContainer from "../components/OuterContainer";
import { BookingApis } from "../apis/BookingApis";
import toast from "react-hot-toast";

const sampleBooking = {
  _id: "BK123456",
  service: {
    name: "AC Repair and Maintenance",
    category: "Appliance Repair",
    price: 89.99,
  },
  date: "2023-06-15T14:30:00Z",
  status: "confirmed",
  provider: {
    name: "John's AC Services",
    rating: 4.7,
    completedJobs: 124,
    avatar: "/path/to/avatar.jpg",
  },
  address: "123 Main Street, Apt 4B",
  landmark: "Near Central Park",
  city: "New York",
  state: "NY",
  pincode: "10001",
  payment: {
    amount: 89.99,
    method: "Credit Card",
    status: "paid",
    transactionId: "TXN789456123",
  },
};

function UserBookingDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await BookingApis.getUserBookings();
        console.log(data);
        setBookings(data);
      } catch (error) {
        toast.error(String(error?.message || error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);
  return (
    <OuterContainer>
      {!bookings.length && (
        <h2 className="text-xl text-center mt-20 font-bold text-slate-400">
          You don't have any booking{" "}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  py-10 gap-5 min-h-[85vh]">
        {bookings.map((item, index) => (
          <BookingCard key={index} booking={item} />
        ))}
      </div>
    </OuterContainer>
  );
}

export default UserBookingDetails;
