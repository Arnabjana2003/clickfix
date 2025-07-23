import React from "react";

function CategoryCard() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="p-6 flex flex-col items-center">
        {/* Icon placeholder (circle) */}
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4"></div>

        {/* Category name placeholder */}
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>

        {/* Services count placeholder */}
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default CategoryCard;
