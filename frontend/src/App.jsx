import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import AuthService from "./apis/AuthService.js";
import { useDispatch } from "react-redux";
import { login } from "./store/auth.slice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    AuthService.getCurrentUser()
      .then((res) => dispatch(login(res.data)))
      .finally(() => setIsLoading(false));
  }, []);
  if (isLoading) return <p>Loading</p>;
  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      <NavBar />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
