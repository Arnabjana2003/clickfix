import React, { useEffect, useState } from "react";
import { BookingApis } from "../apis/BookingApis";
import { Link } from "react-router-dom";


function MostBooked() {
  const [services, setServices] = useState([]);
  useEffect(()=>{
    BookingApis.getPopularServices().then(({data})=>{
      setServices(data.map(ser=>ser?.subCategory))
    })
  },[])
  return (
    <div className="flex flex-row flex-nowrap gap-10 overflow-x-auto w-full py-2">
      {services.map((cat, index) => (
        <Link
        to={`/book/${cat?._id}`}
          key={index}
          className="rounded-lg overflow-hidden flex-shrink-0 w-56"
        >
          <div className="w-full h-44">
            <img
              src={cat.image?.url}
              alt={cat.name + " image"}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h4 className="text-lg mt-3 px-3 text-center">{cat.name}</h4>
        </Link>
      ))}
    </div>
  );
}

export default MostBooked;
