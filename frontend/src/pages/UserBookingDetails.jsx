import React from 'react'
import BookingCard from '../components/UserProfile/BookingCard';
import OuterContainer from '../components/OuterContainer';

const sampleBooking = {
  _id: "BK123456",
  service: {
    name: "AC Repair and Maintenance",
    category: "Appliance Repair",
    price: 89.99
  },
  date: "2023-06-15T14:30:00Z",
  status: "confirmed",
  provider: {
    name: "John's AC Services",
    rating: 4.7,
    completedJobs: 124,
    avatar: "/path/to/avatar.jpg"
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
    transactionId: "TXN789456123"
  }
};



function UserBookingDetails() {
  return (
    <OuterContainer>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  py-10 gap-5'>
            <BookingCard booking={sampleBooking} />
            <BookingCard booking={sampleBooking} />
            <BookingCard booking={sampleBooking} />
        </div>
    </OuterContainer>
  )
}

export default UserBookingDetails