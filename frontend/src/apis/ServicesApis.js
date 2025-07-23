import API, { handleApiError } from ".";

const ServiceApis = {
  upgradeToServiceProvider: async (providerData) => {
    try {
      const response = await API.post(
        "/service-provider/upgrade",
        providerData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getMyServices: async () => {
    try {
      const response = await API.get("/service-provider/services");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  addNewCategory: async (serviceData) => {
    try {
      const response = await API.post("/service-provider/service", serviceData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteService: async (serviceId) => {
    try {
      const response = await API.delete(
        `/service-provider/service/${serviceId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default ServiceApis;
