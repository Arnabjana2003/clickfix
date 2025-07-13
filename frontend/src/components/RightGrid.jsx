import { motion } from "motion/react";
import img1 from "./../assets/ac_worker.png";
import img2 from "./../assets/ele.png";
import img3 from "./../assets/plumber.png";
import img4 from "./../assets/electrician.png";

const services = [
  { title: "AC Repair", icon: "🛠️", image: img1 },
  { title: "Home Cleaning", icon: "🧹", image: img2 },
  { title: "Electrician", icon: "💡", image: img4 },
  { title: "Plumbing", icon: "🔧", image: img3 },
];

export default function RightGrid() {
  return (
    <aside className="w-full h-full flex gap-4 rounded-2xl overflow-hidden">
      <motion.div
        className="w-1/2 flex flex-col gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="h-[60%] cursor-pointer"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.8 },
          }}
        >
          <img
            src={img4}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <motion.div
          className="h-[40%] cursor-pointer"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.8 },
          }}
        >
          <img
            src={img2}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="w-1/2 flex flex-col gap-4"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="h-[40%] cursor-pointer"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.8 },
          }}
        >
          <img
            src={img3}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <motion.div
          className="h-[60%] cursor-pointer"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.8 },
          }}
        >
          <img
            src={img1}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </motion.div>
    </aside>
  );
}
