import API, { handleApiError } from ".";


export const CategoryApis = {
  createCategory: async (categoryData) => {
    try {
      const response = await API.post("/category/", categoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllCategories: async () => {
    try {
      const response = await API.get("/category");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteCategory: async () => {
    try {
      const response = await API.delete("/category/");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};