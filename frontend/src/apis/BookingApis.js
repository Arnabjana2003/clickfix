import API, { handleApiError } from ".";

export const BookingApis = {
  bookService: async (bookingData) => {
    try {
      const response = await API.post(`/booking/`, bookingData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  checkBookingPaymentStatus: async (transactionId) => {
    try {
      const response = await API.get(
        `/booking/payment-status?transactionId=${transactionId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getUserBookings: async () => {
    try {
      const response = await API.get(`/booking`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getPopularServices: async () => {
    try {
      const response = await API.get(
        `/booking/services/popular`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
