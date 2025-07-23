function BookingCardSkeleton() {
  return (
    <div className="w-[32vw] lg:w-[23vw] h-72 shadow-xl rounded-2xl bg-white p-5 text-slate-700 relative animate-pulse">
      {/* Title Skeleton */}
      <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-5"></div>
      
      {/* Date Skeleton */}
      <div className="mt-5 flex items-center">
        <div className="h-4 bg-slate-200 rounded w-12"></div>
        <div className="h-4 bg-slate-200 rounded w-32 ml-2"></div>
      </div>
      
      {/* Customer Skeleton */}
      <div className="mt-5 flex items-center">
        <div className="h-4 bg-slate-200 rounded w-16"></div>
        <div className="h-4 bg-slate-200 rounded w-24 ml-2"></div>
      </div>
      
      {/* Address Skeleton */}
      <div className="mt-5">
        <div className="h-4 bg-slate-200 rounded w-16 mb-1"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 mt-1"></div>
      </div>
      
      {/* Button Skeleton */}
      <div className="mt-5 flex justify-center">
        <div className="bg-slate-200 px-4 py-2 rounded w-32 h-10"></div>
      </div>
    </div>
  );
}

export default BookingCardSkeleton