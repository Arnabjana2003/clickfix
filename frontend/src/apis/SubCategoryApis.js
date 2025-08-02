import API, { handleApiError } from ".";

export const SubCategoryApis = {
  createSubCategory: async (subCategoryData) => {
    try {
      const response = await API.post("/subcategory/", subCategoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSubCategories: async (categoryId) => {
    try {
      const response = await API.get(`/subcategory/?categoryId=${categoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSubCategoryById: async (subCategoryId) => {
    try {
      const response = await API.get(`/subcategory/${subCategoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateSubCategory: async (subCategoryId, updateData) => {
    try {
      const response = await API.patch(
        `/subcategory/${subCategoryId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteSubCategory: async (subCategoryId) => {
    try {
      const response = await API.delete(`/subcategory/${subCategoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  toggleSubCategoryStatus: async (subCategoryId, isActive) => {
    try {
      const response = await API.patch(`/subcategory/${subCategoryId}/status`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadSubCategoryImage: async (subCategoryId, imageData) => {
    try {
      const response = await API.post(
        `/subcategory/${subCategoryId}/image`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSubcategoryServices: async (categoryId) => {
    try {
      const response = await API.get(
        `/subcategory/services?categoryId=${categoryId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSubcategoryDetails: async (subCategoryId) => {
    try {
      const response = await API.get(`/subcategory/${subCategoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
