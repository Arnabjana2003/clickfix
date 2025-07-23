import { motion } from "motion/react";
import appLogo from "../assets/clicknfix_roundlogo.png";
import OuterContainer from "./OuterContainer";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AuthService from "../apis/authService";
import toast from "react-hot-toast";
import { logout } from "../store/auth.slice";

const Profile = ({ name }) => {
  const [showPopup,setShowPopup] = useState(false)
  return (
    <div className="flex gap-3 items-center cursor-pointer relative" onMouseEnter={()=>setShowPopup(prev=>!prev)} onMouseLeave={()=>setShowPopup(prev=>!prev)} onClick={()=>setShowPopup(prev=>!prev)}>
      <CgProfile className="w-6 h-6 text-white" />
      <h3 className="text-white font-semibold">
        {name || "Hi there"}
      </h3>
      {showPopup && <div className="absolute min-w-full top-full">
        <div className="bg-white mt-2 rounded shadow-2xl overflow-hidden px-6 pb-4">
          <p className="mt-3"><Link to={"/profile"}>Profile</Link></p>
          <p className="mt-3"><Link to={"/bookings"}>Bookings</Link></p>
        </div>
        </div>}
    </div>
  );
};

function NavBar() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state?.auth?.status);
  const authData = useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      toast.error(String(err?.message || err));
    }
  };
  return (
    <nav className=" w-[100vw]  bg-slate-800 py-5 md:py-2 shadow">
      <OuterContainer>
        <div className="flex justify-between items-center h-14 md:h-20">
          <motion.div
            onClick={() => navigate("/")}
            className="h-full shadow flex gap-2 md:gap-4 items-center cursor-pointer"
            initial={{
              opacity: 0,
              rotate: -10,
              x: -30,
            }}
            animate={{
              opacity: 1,
              rotate: 0,
              x: 0,
              transition: { duration: 1 },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.9 }}
          >
            <img src={appLogo} className="h-[70%]" />
            <h1 className="font-bold text-xl md:text-3xl text-white">
              ClicknFix
            </h1>
          </motion.div>

          {!authStatus && (
            <div className="hidden md:flex gap-4">
              <motion.button
                onClick={() => navigate("/login")}
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { duration: 1 } }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-2 rounded-lg bg-orange-400 text-white hover:bg-orange-300 cursor-pointer font-bold text-lg"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate("/register")}
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { duration: 1 } }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg hover:bg-slate-50/10 text-white  cursor-pointer font-bold text-lg"
              >
                Sign Up
              </motion.button>
            </div>
          )}
          {authStatus && (
            <div className="flex gap-5 items-center">
              <Profile name={authData?.name} />
              <motion.button
                onClick={handleLogout}
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { duration: 1 } }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg hover:bg-slate-50/10 text-white  cursor-pointer font-bold text-lg"
              >
                Logout
              </motion.button>
            </div>
          )}
          <CgProfile className="md:hidden" color="white" size={30} />
        </div>
      </OuterContainer>
    </nav>
  );
}

export default NavBar;
