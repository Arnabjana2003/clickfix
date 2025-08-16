import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CategoryApis } from "../../apis/CategoryApis.js";
import { SubCategoryApis } from "../../apis/SubCategoryApis.js";
import ServiceApis from "../../apis/ServicesApis.js";
import constants from "../../utils/constants";

export default function Services() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [isLoading, setIsLoading] = useState({
    categories: true,
    subCategories: false,
    services: true,
    adding: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await CategoryApis.getAllCategories();
        setCategories(data.filter((cat) => cat.isActive));
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Fetch my services
  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const { data } = await ServiceApis.getMyServices();
        setMyServices(data);
      } catch (error) {
        toast.error("Failed to load your services");
      } finally {
        setIsLoading((prev) => ({ ...prev, services: false }));
      }
    };
    fetchMyServices();
  }, []);

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          setIsLoading((prev) => ({ ...prev, subCategories: true }));
          const { data } = await SubCategoryApis.getSubCategories(
            selectedCategory
          );
          setSubCategories(data);
          reset();
        } catch (error) {
          toast.error("Failed to load subcategories");
        } finally {
          setIsLoading((prev) => ({ ...prev, subCategories: false }));
        }
      };
      fetchSubCategories();
    }
  }, [selectedCategory, reset]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSubCategories([]);
  };

  const onSubmit = async (formData) => {
    setIsLoading((prev) => ({ ...prev, adding: true }));
    try {
      const { data } = await ServiceApis.addNewCategory({
        categoryId: selectedCategory,
        subCategoryId: formData?.subCategoryId,
        tags: formData?.tags?.split(","),
        experienceInYear: formData?.experienceInYear,
      });
      toast.success("Service added successfully");
      setMyServices((prev) => [
        ...prev,
        {
          ...data,
          categoryId: categories.find((cat) => cat?._id == selectedCategory),
          subCategoryId: subCategories.find(
            (subcat) => subcat?._id == formData?.subCategoryId
          ),
        },
      ]);
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, adding: false }));
    }
  };

  const removeService = async (serviceId) => {
    try {
      await ServiceApis.deleteService(serviceId);
      setMyServices((prev) =>
        prev.filter((service) => service._id !== serviceId)
      );
      toast.success("Service removed successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Your Services</h1>

      {/* Current Services */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Current Services</h2>
        {isLoading.services ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : myServices.length === 0 ? (
          <p className="text-gray-500">
            You are not providing any services yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myServices.map((service) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.categoryId?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.subCategoryId?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rs.{" "}
                        {(service.subCategoryId?.price *
                          constants.providerPricePercentage) /
                          100}{" "}
                        • {service.subCategoryId?.estimatedTimeInMinute} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.experienceInYear} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => removeService(service._id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Service */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              onChange={handleCategoryChange}
              value={selectedCategory || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading.categories}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {isLoading.categories && (
              <p className="mt-1 text-sm text-gray-500">
                Loading categories...
              </p>
            )}
          </div>

          {/* Subcategory Selection */}
          {selectedCategory && (
            <div>
              <label
                htmlFor="subCategoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service
              </label>
              {isLoading.subCategories ? (
                <p className="text-sm text-gray-500">Loading services...</p>
              ) : subCategories.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No services available in this category
                </p>
              ) : (
                <select
                  id="subCategoryId"
                  {...register("subCategoryId", {
                    required: "Service is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.subCategoryId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a service</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name} (Rs.
                      {(subCategory.price * constants.providerPricePercentage) /
                        100}{" "}
                      • {subCategory.estimatedTimeInMinute} mins)
                    </option>
                  ))}
                </select>
              )}
              {errors.subCategoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subCategoryId.message}
                </p>
              )}
            </div>
          )}

          {/* Experience */}
          {selectedCategory && (
            <div>
              <label
                htmlFor="experienceInYear"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Years of Experience
              </label>
              <input
                id="experienceInYear"
                type="number"
                {...register("experienceInYear", {
                  required: "Experience is required",
                  min: { value: 0, message: "Minimum 0 years" },
                  max: { value: 50, message: "Maximum 50 years" },
                })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.experienceInYear ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.experienceInYear && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experienceInYear.message}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {selectedCategory && (
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                {...register("tags", {
                  required: "Please provide some tags eg. AC, AC repairing",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., AC repair, installation, maintenance"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tags.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Add relevant tags to help customers find your service
              </p>
            </div>
          )}

          {/* Submit Button */}
          {selectedCategory && subCategories.length > 0 && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading.adding}
            >
              {isLoading.adding ? "Adding Service..." : "Add Service"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
