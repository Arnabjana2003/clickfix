import React from 'react'
import BookingCard from './BookingCard'
import BookingCardSkeleton from './BookingCardSkeleton'

const data = [
  {
    "id": "BK-2023-0456",
    "service": "AC Repairing",
    "status": "completed",
    "date": "2023-11-15T14:30:00Z",
    "customerName": "Tony Stark",
    "address": "10880 Malibu Point, Malibu, CA 90265",
    "notes": "AC not cooling properly"
  },
  {
    "id": "BK-2023-0457",
    "service": "Plumbing - Leak Fix",
    "status": "ongoing",
    "date": "2023-11-16T10:00:00Z",
    "customerName": "Steve Rogers",
    "address": "569 Leaman Place, Brooklyn, NY 11201",
    "notes": "Kitchen sink leaking"
  },
  {
    "id": "BK-2023-0458",
    "service": "Electrical Wiring",
    "status": "completed",
    "date": "2023-11-10T13:15:00Z",
    "customerName": "Natasha Romanoff",
    "address": "200 Park Avenue, New York, NY 10166",
    "notes": "Rewiring living room outlets"
  },
  {
    "id": "BK-2023-0459",
    "service": "Appliance Installation",
    "status": "ongoing",
    "date": "2023-11-20T09:00:00Z",
    "customerName": "Bruce Banner",
    "address": "1407 Graymalkin Lane, Salem Center, NY 10560",
    "notes": "Install new dishwasher"
  },
  {
    "id": "BK-2023-0460",
    "service": "Carpentry - Cabinet Repair",
    "status": "cancelled",
    "date": "2023-11-12T11:30:00Z",
    "customerName": "Thor Odinson",
    "address": "1 Asgard Palace Way, Asgard",
    "notes": "Customer cancelled - moving to new home"
  }
]

function Booking() {
  return (
    <div>
        <header>
            <h3 className='font-bold text-3xl text-slate-700'>Your Bookings</h3>
        </header>
        
        <div className='mt-10 flex justify-evenly lg:justify-between flex-wrap gap-8'>
            {data.map((booking)=><BookingCard key={booking.id} bookingData={booking} />)}
            {/* <BookingCardSkeleton/> */}
        </div>
    </div>
  )
}

export default Booking