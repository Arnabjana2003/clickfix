import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiDollarSign, FiStar, FiCheckCircle } from 'react-icons/fi';

const CategoryServices = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data matching your interfaces
  const sampleData = {
    categories: [
      {
        _id: '1',
        name: 'AC Services',
        image: { url: 'https://example.com/ac-service.jpg' },
        isActive: true
      },
      {
        _id: '2',
        name: 'Plumbing',
        image: { url: 'https://example.com/plumbing.jpg' },
        isActive: true
      }
    ],
    subCategories: [
      {
        _id: '101',
        name: 'AC Repair',
        categoryId: '1',
        price: 89.99,
        estimatedTimeInMinute: 90,
        image: { url: 'https://example.com/ac-repair.jpg' },
        isActive: true,
        numberOfProviders: 24
      },
      {
        _id: '102',
        name: 'AC Installation',
        categoryId: '1',
        price: 199.99,
        estimatedTimeInMinute: 240,
        image: { url: 'https://example.com/ac-installation.jpg' },
        isActive: true,
        numberOfProviders: 15
      },
      {
        _id: '103',
        name: 'AC Maintenance',
        categoryId: '1',
        price: 59.99,
        estimatedTimeInMinute: 60,
        image: { url: 'https://example.com/ac-maintenance.jpg' },
        isActive: true,
        numberOfProviders: 32
      }
    ]
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API:
        // const categoryRes = await fetch(`/api/categories/${categoryId}`);
        // const subCategoriesRes = await fetch(`/api/categories/${categoryId}/subcategories`);
        
        // Using sample data for demonstration
        const foundCategory = sampleData.categories.find(cat => cat._id === categoryId);
        const foundSubCategories = sampleData.subCategories.filter(sub => sub.categoryId === categoryId);
        
        setCategory(foundCategory);
        setSubCategories(foundSubCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Category not found</h2>
        <Link to="/categories" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/categories" className="flex items-center text-blue-600 hover:underline">
          <FiArrowLeft className="mr-2" /> Back to all categories
        </Link>
      </div>

      <div className="flex items-center mb-8">
        {category.image?.url ? (
          <img 
            src={category.image.url} 
            alt={category.name} 
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
            <FiStar size={24} className="text-gray-400" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{category.name} Services</h1>
          <p className="text-gray-600">{subCategories.length} services available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((service) => (
          <div 
            key={service._id} 
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48 bg-gray-200">
              {service.image?.url ? (
                <img 
                  src={service.image.url} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FiStar size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <FiDollarSign className="mr-1" />
                <span className="font-medium">${service.price.toFixed(2)}</span>
                <span className="mx-2">•</span>
                <FiClock className="mr-1" />
                <span>{service.estimatedTimeInMinute} mins</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FiCheckCircle className="mr-1 text-green-500" />
                <span>{service.numberOfProviders}+ providers available</span>
              </div>

              <div className="flex justify-between items-center">
                <Link 
                  to={`/book/${service._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Book Now
                </Link>
                <Link 
                  to={`/services/${service._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subCategories.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700">No services available in this category</h3>
          <p className="text-gray-500 mt-2">Check back later or explore other categories</p>
        </div>
      )}
    </div>
  );
};

export default CategoryServices;