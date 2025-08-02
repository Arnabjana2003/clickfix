import { useEffect, useState } from "react";
import {
  FiTool,
  FiDroplet,
  FiZap,
  FiHome,
  FiSettings,
  FiLayers,
  FiTruck,
  FiMonitor,
  FiWind,
} from "react-icons/fi";
import { CategoryApis } from "../apis/CategoryApis";
import CategoryCard from "../skelitons/services/CategoryCard";
import PopularServiceCard from "../skelitons/services/PopularServiceCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const getCategoryIcon = (categoryName) => {
  switch (categoryName.toLowerCase()) {
    case "plumbing":
      return <FiDroplet className="text-blue-500" size={24} />;
    case "electrical":
      return <FiZap className="text-yellow-500" size={24} />;
    case "ac repair":
      return <FiWind className="text-teal-500" size={24} />;
    case "carpentry":
      return <FiTool className="text-amber-500" size={24} />;
    case "appliance repair":
      return <FiSettings className="text-purple-500" size={24} />;
    case "cleaning":
      return <FiHome className="text-green-500" size={24} />;
    case "pest control":
      return <FiLayers className="text-red-500" size={24} />;
    case "painting":
      return <FiTruck className="text-indigo-500" size={24} />;
    default:
      return <FiMonitor className="text-gray-500" size={24} />;
  }
};

const ExploreCategories = () => {
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState({
    category: !categories?.length,
    popularService: !popularServices?.length,
  });

  useEffect(() => {
    CategoryApis.getAllCategories()
      .then(({ data }) => {
        setCategories(data);
        setLoading((prev) => ({ ...prev, category: false }));
      })
      .catch((err) => {
        toast.error(String(err?.message));
      });
      window.scrollTo({behavior:'smooth',top:0})
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Explore Services
        </h1>
        <p className="text-gray-600">
          Choose from our wide range of professional services
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading.category &&
          Array(10)
            .fill(0)
            .map((_, index) => <CategoryCard key={index} />)}
        {!loading.category &&
          categories
            .filter((cat) => cat.isActive)
            .map((category) => (
              <Link to={`/services/${category?._id}`}
                key={category._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {category.name}
                  </h3>
                  <div className="mt-2 text-xs text-gray-500">
                    {category?.numberOfServices} services available
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Popular Services Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Popular Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading.category &&
            Array(3)
              .fill(0)
              .map((_, i) => <PopularServiceCard key={i} />)}
          {categories.slice(0, 3).map((category) => (
            <div
              key={`popular-${category._id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-40 bg-gray-200">
                {category.image?.url ? (
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    {getCategoryIcon(category.name)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="mr-3">{getCategoryIcon(category.name)}</div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Professional {category.name.toLowerCase()} services for your
                  home or business.
                </p>
                <Link to={`/category/${category._id}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                  View Services
                </button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;
