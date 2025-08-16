import { CgProfile } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import { MdPayment, MdOutlineHomeRepairService } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { VscFeedback } from "react-icons/vsc";
import Booking from "../components/providerDashboard/Booking";
import { useState } from "react";
import Profile from "../components/providerDashboard/Profile";
import PendingRequests from "../components/providerDashboard/PendingRequests";
import Feedbacks from "../components/providerDashboard/Feedbacks";
import Transactions from "../components/providerDashboard/Transactions";
import DashboardAnalytics from "../components/providerDashboard/DashboardAnalytics";
import Services from "../components/providerDashboard/Services";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <LuLayoutDashboard size={22} color="#314158" />,
  },
  {
    key: "booking",
    label: "Bookings",
    icon: <FaTasks size={22} color="#314158" />,
  },
  {
    key: "service",
    label: "Services",
    icon: <MdOutlineHomeRepairService size={22} color="#314158" />,
  },
  {
    key: "payment",
    label: "Payments",
    icon: <MdPayment size={22} color="#314158" />,
  },
  {
    key: "feedback",
    label: "Feedbacks",
    icon: <VscFeedback size={22} color="#314158" />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <CgProfile size={22} color="#314158" />,
  },
];

const renderActiveComp = (activeTab) => {
  switch (activeTab) {
    case "dashboard":
      return <DashboardAnalytics />;
    case "profile":
      return <Profile />;
    case "booking":
      return <Booking />;
    case "pending_jobs":
      return <PendingRequests />;
    case "service":
      return <Services />;
    case "payment":
      return <Transactions />;
    case "feedback":
      return <Feedbacks />;
  }
};

function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="min-h-[84vh] flex">
      <div className="w-[18vw]">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex gap-4 items-center mt-4 px-5 py-3 hover:bg-slate-50 cursor-pointer ${
              activeTab == item.key ? "bg-orange-100" : null
            }`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.icon}
            <p
              className={`text-lg text-slate-700 ${
                activeTab == item.key ? "font-bold" : "font-medium"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <div className="w-[82vw] p-6 bg-gradient-to-tr from-slate-200 to-white">
        {renderActiveComp(activeTab)}
      </div>
    </div>
  );
}

export default ProviderDashboard;
