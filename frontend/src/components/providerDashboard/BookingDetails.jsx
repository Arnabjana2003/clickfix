import { useState } from 'react';

const statusFlow = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['ongoing', 'cancelled'],
  ongoing: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function BookingDetails({ bookingData, onStatusUpdate }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(bookingData.status);
  
  const availableStatuses = statusFlow[bookingData.status];
  const canChangeStatus = availableStatuses.length > 0;

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setIsDropdownOpen(false);
    onStatusUpdate(newStatus);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">Booking Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-500">Service</h3>
          <p className="mt-1">{bookingData.service}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Booking ID</h3>
          <p className="mt-1">{bookingData.id}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Date & Time</h3>
          <p className="mt-1">
            {new Date(bookingData.date).toLocaleString()}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Customer</h3>
          <p className="mt-1">{bookingData.customerName}</p>
        </div>
        
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-500">Address</h3>
          <p className="mt-1">{bookingData.address}</p>
        </div>
      </div>

      <div className="relative">
        <h3 className="font-semibold text-gray-500 mb-2">Status</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[bookingData.status]}`}>
            {bookingData.status}
          </span>
          
          {canChangeStatus && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                Change Status
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md py-1 border">
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${status === selectedStatus ? 'font-semibold' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {bookingData.notes && (
        <div>
          <h3 className="font-semibold text-gray-500">Notes</h3>
          <p className="mt-1 bg-gray-50 p-3 rounded">{bookingData.notes}</p>
        </div>
      )}
    </div>
  );
}