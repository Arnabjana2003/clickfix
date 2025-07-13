import { motion } from "motion/react";

function OfferingCard({
  themeColor = "bg-green-400",
  imgUrl = "https://trustworthyhomeservices.in/wp-content/uploads/2023/05/trustworthy-blog17.jpg",
  heading,
  subHeading,
}) {
  return (
    <div className="w-full max-h-48 lg:w-[30%] rounded-lg bg-slate-200 overflow-hidden opacity-100 hover:opacity-80 shadow flex">
      <div className={`w-[58%] h-full p-5 text-white ${themeColor}`}>
        <h3 className="text-2xl font-semibold">{heading}</h3>
        <p className="text-lg mt-2 text-white">{subHeading}</p>
        <motion.button
          whileHover={{ scale: 1.1, animationDuration: 0.5 }}
          className="mt-5 px-5 py-2 bg-white text-slate-700 rounded-lg cursor-pointer font-bold"
        >
          Book now
        </motion.button>
      </div>
      <div className="w-[42%]">
        <img
          src={imgUrl}
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}

export default OfferingCard;
