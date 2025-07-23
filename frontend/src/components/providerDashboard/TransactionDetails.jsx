export default function TransactionDetails({ payment }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold border-b pb-2">Payment Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-500">Transaction ID</h3>
          <p className="mt-1 font-mono">{payment.id}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Booking ID</h3>
          <p className="mt-1">{payment.bookingId}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Service</h3>
          <p className="mt-1">{payment.service}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Date</h3>
          <p className="mt-1">
            {new Date(payment.date).toLocaleString()}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Amount</h3>
          <p className="mt-1 text-lg font-bold">${payment.amount.toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-500">Status</h3>
          <p className="mt-1 capitalize">{payment.status}</p>
        </div>
        
        {payment.method && (
          <div>
            <h3 className="font-semibold text-gray-500">Payment Method</h3>
            <p className="mt-1">{payment.method}</p>
          </div>
        )}
        
        {payment.transactionId && (
          <div>
            <h3 className="font-semibold text-gray-500">Gateway Transaction ID</h3>
            <p className="mt-1 font-mono">{payment.transactionId}</p>
          </div>
        )}
      </div>
      
      {payment.notes && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-500">Notes</h3>
          <p className="mt-1 bg-gray-50 p-3 rounded">{payment.notes}</p>
        </div>
      )}
    </div>
  );
}