import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaStar } from "react-icons/fa";

const feedbackData = [
  { month: "Jan", positive: 12, negative: 3, neutral: 5, rating: 4.2 },
  { month: "Feb", positive: 15, negative: 2, neutral: 4, rating: 4.4 },
  { month: "Mar", positive: 18, negative: 1, neutral: 3, rating: 4.6 },
  { month: "Apr", positive: 20, negative: 2, neutral: 2, rating: 4.7 },
  { month: "May", positive: 22, negative: 1, neutral: 3, rating: 4.8 },
  { month: "Jun", positive: 25, negative: 0, neutral: 2, rating: 4.9 },
];

const recentFeedbacks = [
  {
    id: 1,
    customer: "Tony Stark",
    service: "AC Repair",
    rating: 5,
    comment: "Excellent service!",
    date: "2023-06-15",
  },
  {
    id: 2,
    customer: "Steve Rogers",
    service: "Plumbing",
    rating: 4,
    comment: "Good work but slightly late",
    date: "2023-06-12",
  },
  {
    id: 3,
    customer: "Natasha Romanoff",
    service: "Electrical",
    rating: 5,
    comment: "Perfect as always!",
    date: "2023-06-10",
  },
  {
    id: 4,
    customer: "Bruce Banner",
    service: "Carpentry",
    rating: 3,
    comment: "Average work, could be better",
    date: "2023-06-08",
  },
  {
    id: 5,
    customer: "Thor Odinson",
    service: "Appliance",
    rating: 5,
    comment: "Mighty good service!",
    date: "2023-06-05",
  },
];

export default function Feedbacks() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const openFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetails(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feedback Analytics</h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          Overall Rating: 4.7 ★
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Feedback Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feedbackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Negative"
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Neutral"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Rating Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedbackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="rating" fill="#3B82F6" name="Average Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Feedbacks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Recent Feedbacks</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {feedback.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {feedback.service}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                        key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">
                        ({feedback.rating})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(feedback.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openFeedbackDetails(feedback)}
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Details Modal */}
      {showDetails && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Feedback Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-500">Customer</h3>
                    <p className="mt-1">{selectedFeedback.customer}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Service</h3>
                    <p className="mt-1">{selectedFeedback.service}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Date</h3>
                    <p className="mt-1">
                      {new Date(selectedFeedback.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Rating</h3>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                        key={i}
                          className={`w-4 h-4 ${
                            i < selectedFeedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2">
                        ({selectedFeedback.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-500">Comment</h3>
                  <p className="mt-1 bg-gray-50 p-3 rounded">
                    {selectedFeedback.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
