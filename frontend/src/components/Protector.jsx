import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function Protector({ authentication = true, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state?.auth?.status);

  useEffect(() => {
    console.log(authStatus);
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    } else if (!authentication && authStatus) {
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    }
  }, [authStatus, authentication]);
  return <>{children}</>;
}

export default Protector;
