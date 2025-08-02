import API, { handleApiError } from ".";

export default {
  getMyBookings: async () => {
    try {
      const response = await API.get("/service-provider/bookings");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateBookingStatus: async ({ bookingId, newStatus }) => {
    try {
      const response = await API.patch("/service-provider/bookings", {
        bookingId,
        newStatus,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
