import { motion } from "motion/react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const sugts = [
  {
    label: "AC repairing",
    iconImg:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1741326936056-c3a39a.jpeg",
  },
  {
    label: "Electrician",
    iconImg:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1658402794135-faf080.png",
  },
];

function SearchBar() {
  const [suggestions, setSuggestions] = useState([]);
  return (
    <div className="relative">
      <div className="border rounded-lg border-slate-400 p-1 md:p-3 px-2 md:px-5 flex gap-10 shadow">
        <div className="flex gap-4 items-center grow">
          <IoIosSearch size={30} color="grey" />
          <input
            type="text"
            placeholder="Search for a service"
            className="grow md:text-xl outline-0"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.1, animationDuration: 0.5 }}
          className="bg-orange-400 px-6 py-2 text-lg rounded-md text-white cursor-pointer"
        >
          Search
        </motion.button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute max-h-72 bg-slate-100 left-0 right-0 rounded-lg">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="flex gap-8 cursor-pointer hover:bg-slate-50 p-4"
            >
              <img src={item?.iconImg} className="w-8 h-8 rounded-lg" />
              <p className="text-slate-700">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
