import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Protector from "./components/Protector.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import ProviderRegisterPage from "./pages/ProviderRegisterPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/register",
        element: (
          <Protector type="customer" authentication={false}>
            <UserSignup />
          </Protector>
        ),
      },
      {
        path: "/provider/register",
        element: (
          <Protector type="provider" authentication={false}>
            <ProviderRegisterPage />
          </Protector>
        ),
      },
      {
        path: "/login",
        element: (
          <Protector type="customer" authentication={false}>
            <UserLogin />
          </Protector>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
