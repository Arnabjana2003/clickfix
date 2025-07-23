import { useState } from "react";
import TransactionDetails from "./TransactionDetails"; // We'll create this next
import Modal from "../Modal";

const statusColors = {
  pending: "text-yellow-600",
  completed: "text-green-600",
  failed: "text-red-600",
  refunded: "text-blue-600",
};

const payments = [
  {
    id: "PAY-2023-1001",
    bookingId: "BK-2023-0456",
    service: "AC Repairing",
    date: "2023-11-15T14:30:00Z",
    amount: 120.5,
    status: "completed",
    method: "Credit Card",
    transactionId: "ch_1JXyz72eZvKYlo2C3X8X9X9X",
    notes: "Payment processed successfully",
  },
  {
    id: "PAY-2023-1002",
    bookingId: "BK-2023-0457",
    service: "Plumbing - Leak Fix",
    date: "2023-11-16T10:00:00Z",
    amount: 85.0,
    status: "pending",
    method: "Bank Transfer",
    notes: "Awaiting bank confirmation",
  },
  {
    id: "PAY-2023-1003",
    bookingId: "BK-2023-0458",
    service: "Electrical Wiring",
    date: "2023-11-10T13:15:00Z",
    amount: 210.0,
    status: "completed",
    method: "PayPal",
    transactionId: "5LY58837KP2661230",
    notes: "Customer paid via PayPal",
  },
];

export default function Transactions() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.service}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {payment.bookingId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[payment.status]
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openPaymentDetails(payment)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for payment details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedPayment && <TransactionDetails payment={selectedPayment} />}
      </Modal>
    </div>
  );
}
