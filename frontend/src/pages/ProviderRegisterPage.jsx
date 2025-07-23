import React, { useState } from "react";
import OuterContainer from "../components/OuterContainer";
import regPic from "../assets/reg-technicians.png";
import toast from "react-hot-toast";
import ServiceApis from "../apis/ServicesApis";
import { useNavigate } from "react-router-dom";
import { getCurrentLocationCoords } from "../utils/services/locationServices";
import { useDispatch } from "react-redux";
import { upgradeUser } from "../store/auth.slice";

function ProviderRegisterPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const hanldeSubmit = async () => {
    setIsLoading(true);
    let location;
    try {
      location = await getCurrentLocationCoords();
    } catch (error) {
      toast.error(String(error?.message || error));
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await ServiceApis.upgradeToServiceProvider({
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      dispatch(upgradeUser({ newRole: "service_provider", roleData: data }));
      toast.success("You are upgraded to Service Provider");
    } catch (error) {
      console.log(error);
      toast.error(String(error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-slate-100 min-h-[85vh] w-full">
      <OuterContainer>
        <div className="flex gap-10 justify-between h-[60vh] pt-10">
          <div className="w-1/2">
            <img src={regPic} />
            <h1 className="text-center text-5xl font-bold text-cyan-950 mt-2">
              ClicknFix
            </h1>
          </div>
          <div className="w-1/2">
            <h1 className="text-5xl font-bold text-slate-800">
              Earn More. Earn Respect. Safety Ensured.
            </h1>
            <p className="text-2xl text-stone-600 mt-5">
              Join 1,000+ service professionals* across India
            </p>
            <p className="mt-8 text-xl font-semibold text-slate-800">
              Want to provide services ? Upgrade you account to Service provider
            </p>
            <button
              onClick={hanldeSubmit}
              className="w-full py-3 text-center bg-orange-500 rounded-lg text-xl font-semibold text-white mt-10 cursor-pointer"
            >
              {isLoading ? "Upgrading..." : "Upgrade Free"}
            </button>
            <p className="mt-3 ">
              *You can use this account as both consumer and provider
            </p>
          </div>
        </div>
      </OuterContainer>
    </div>
  );
}

export default ProviderRegisterPage;
