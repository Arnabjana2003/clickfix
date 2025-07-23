import React from "react";

function PopularServiceCard() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Image placeholder */}
      <div className="relative h-40 bg-gray-200 animate-pulse">
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="p-6">
        {/* Title with icon placeholder */}
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default PopularServiceCard;
