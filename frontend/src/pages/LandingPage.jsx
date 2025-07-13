import { motion } from "motion/react";
import OuterContainer from "../components/OuterContainer";
import RightGrid from "../components/RightGrid";
import SearchBar from "../components/SearchBar";
import NewSection from "../components/NewSection";
import OfferingCard from "../components/OfferingCard";
import Categories from "../components/Categories";
import SectionHeader from "../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import techniciansGrp from "../assets/technicians.png";

const offeringList = [
  {
    themeColor: "bg-green-600",
    textColor: "text-white",
    imgUrl:
      "https://trustworthyhomeservices.in/wp-content/uploads/2023/05/trustworthy-blog17.jpg",
    heading: "Deep AC cleaning",
    subHeadin: "AC service and repair",
  },
  {
    themeColor: "bg-amber-800",
    textColor: "text-white",
    imgUrl:
      "https://img.freepik.com/premium-photo/portrait-young-latin-man-fixing-electricity-problem-with-cables-new-home-repair-renovation-home-concept_58466-13260.jpg",
    heading: "Qualified electrician",
    subHeadin: "Electric technicians",
  },
  {
    themeColor: "bg-blue-800",
    textColor: "text-white",
    imgUrl:
      "https://riyadhacrepairmaintenance.com/wp-content/uploads/2024/09/Plumbing-repair-in-Riyadh.webp",
    heading: "Experienced Plumbers",
    subHeadin: "Repairing",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <OuterContainer>
      <div className="py-10 lg:flex justify-between gap-10 lg:h-[95vh]">
        <div className="lg:w-1/2 flex flex-col gap-10 md:gap-20">
          <motion.div
            className="h-[35%]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-bold text-3xl md:text-5xl text-slate-800">
              Book Trusted Technicians in Minutes
            </h1>
            <h2 className="text-lg md:text-xl text-slate-500 mt-3 md:mt-6">
              From AC repair to plumbing, get pros at your doorstep fast. No
              hassle, no hidden fees.
            </h2>
          </motion.div>

          <motion.div
            className="h-[35%] rounded-xl bg-teal-600 p-4 px-8 shadow-xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h5 className="text-3xl font-bold text-white">
              Become a Service Provider
            </h5>
            <p className="text-xl text-white mt-1">
              Sign up to offer your services and grow your business
            </p>
            <motion.button
              onClick={() => navigate("/provider/register")}
              whileHover={{ scale: 1.1, animationDuration: 0.5 }}
              className="bg-orange-400 px-6 py-3 text-xl rounded-lg font-semibold text-white shadow-xl mt-5 cursor-pointer"
            >
              Get started
            </motion.button>
          </motion.div>
        </div>
        <div className="lg:w-1/2 h-full mt-10 md:mt-20 lg:mt-0">
          <RightGrid />
        </div>
      </div>

      <div>
        <SearchBar />
      </div>
      <NewSection>
        <div className="flex flex-wrap lg:gap-5 justify-between">
          {offeringList.map((item, index) => (
            <OfferingCard
              key={index}
              heading={item.heading}
              subHeading={item.subHeadin}
              themeColor={item.themeColor}
              textColor={item.textColor}
              imgUrl={item.imgUrl}
            />
          ))}
        </div>
      </NewSection>

      <NewSection>
        <SectionHeader heading="Most booked services" />
        <Categories />
      </NewSection>

      <NewSection>
        <div className="flex rounded-2xl overflow-hidden">
          <img
            src={techniciansGrp}
            className="w-[65%] h-[25rem] object-center object-cover"
          />
          <div className="w-[35%] bg-green-950 p-8">
            <h2 className="text-4xl text-white font-bold leading-14">
              Highly skilled Proffesionals
            </h2>
            <p className="text-white font-semibold text-xl mt-5">
              Get the technicians at you doorstepin single click
            </p>
            <button className="px-8 py-3 bg-white text-green-950 font-bold rounded-lg mt-8 cursor-pointer">
              Explore
            </button>
          </div>
        </div>
      </NewSection>

      <section className="my-32">
        <h1 className="text-5xl text-slate-300 font-bold">ClicknFix</h1>
        <p className="text-4xl text-slate-300 font-semibold mt-5">Get Technicians at doorsteps</p>
      </section>
    </OuterContainer>
  );
}

export default LandingPage;
