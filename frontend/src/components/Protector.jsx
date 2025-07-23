import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function Protector({ authentication = true, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.userData);

  useEffect(() => {
    // console.log(userData);
    const redirectPath = location.state?.from || "/";

    if (
      location.pathname == "/provider/register" &&
      userData?.role == "service_provider"
    ) {
      navigate("/provider/dashboard", { replace: true });
    } else if (
      location.pathname.startsWith("/provider") &&
      location.pathname != "/provider/register" &&
      userData?.role != "service_provider"
    ) {
      navigate(redirectPath, { replace: true });
    } else if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    } else if (!authentication && authStatus) {
      navigate(redirectPath, { replace: true });
    }
  }, [authStatus, userData, authentication]);
  return <>{children}</>;
}

export default Protector;
