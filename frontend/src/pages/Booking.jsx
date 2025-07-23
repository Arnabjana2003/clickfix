import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiCreditCard,
  FiArrowLeft,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Sample data matching your ISubCategory interface
  const sampleData = {
    services: [
      {
        _id: "101",
        name: "AC Repair",
        categoryId: "1",
        price: 89.99,
        estimatedTimeInMinute: 90,
        image: { url: "https://example.com/ac-repair.jpg" },
        isActive: true,
        numberOfProviders: 24,
        description:
          "Professional AC repair service with 1-year warranty on parts and labor.",
        rating: 4.7,
        reviews: 128,
      },
      // ... other services
    ],
    relatedServices: [
      {
        _id: "102",
        name: "AC Installation",
        categoryId: "1",
        price: 199.99,
        estimatedTimeInMinute: 240,
        image: { url: "https://example.com/ac-installation.jpg" },
        isActive: true,
        numberOfProviders: 15,
      },
      {
        _id: "103",
        name: "AC Maintenance",
        categoryId: "1",
        price: 59.99,
        estimatedTimeInMinute: 60,
        image: { url: "https://example.com/ac-maintenance.jpg" },
        isActive: true,
        numberOfProviders: 32,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API:
        // const serviceRes = await fetch(`/api/services/${subCategoryId}`);
        // const relatedRes = await fetch(`/api/services/${subCategoryId}/related`);

        // Using sample data for demonstration
        const foundService = sampleData.services.find(
          (s) => s._id === subCategoryId
        );
        setService(foundService);
        setRelatedServices(sampleData.relatedServices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subCategoryId]);

  const handleBooking = async () => {
    return;
    setIsBooking(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app:
      // await fetch('/api/bookings', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     serviceId: subCategoryId,
      //     date: selectedDate,
      //     address,
      //     paymentMethod
      //   })
      // });

      navigate("/booking-confirmation", { state: { bookingId: "12345" } });
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Service not found</h2>
        <button
          onClick={() => navigate("/categories")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to services
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to service
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Details and Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {service.name}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <FiStar className="text-yellow-400 mr-1" />
                <span className="font-medium">{service.rating}</span>
                <span className="mx-1">({service.reviews} reviews)</span>
              </div>

              <p className="text-gray-700 mb-6">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FiDollarSign className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">${service.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">
                      {service.estimatedTimeInMinute} mins
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Providers</p>
                    <p className="font-semibold">
                      {service.numberOfProviders}+ available
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold">AC Services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Book This Service
            </h2>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Select Date & Time
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  Service Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCreditCard className="inline mr-2" />
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>PayPal</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Cash on Service</span>
                  </label>
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={handleBooking}
                disabled={isBooking || !address}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                  isBooking || !address ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isBooking
                  ? "Processing..."
                  : `Book Now for $${service.price.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Payment summery */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">${service.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">
                  ${(service.price * 0.1).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount (WELCOME20)</span>
                <span>-${(service.price * 0.2).toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Payable</span>
                  <span className="text-blue-600">
                    ${(service.price * 0.9).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md mt-2">
                <FiCheckCircle className="inline mr-1" />
                You're saving ${(service.price * 0.2).toFixed(2)} with this
                booking
              </div>
            </div>
          </div>

          {/* Related services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Related Services
            </h2>
            <div className="space-y-4">
              {relatedServices.map((related) => (
                <div
                  key={related._id}
                  className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/book/${related._id}`)}
                >
                  {related.image?.url ? (
                    <img
                      src={related.image.url}
                      alt={related.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                      <FiStar className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {related.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiDollarSign className="mr-1" />
                      <span>${related.price.toFixed(2)}</span>
                      <span className="mx-2">•</span>
                      <FiClock className="mr-1" />
                      <span>{related.estimatedTimeInMinute} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
