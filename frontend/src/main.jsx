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
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import ReactModal from "react-modal";
import UserBookingDetails from "./pages/UserBookingDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ExploreCategories from "./pages/ExploreCategories.jsx";
import CategoryServices from "./pages/CategoryServices.jsx";
import Booking from "./pages/Booking.jsx";
import PaymentComponent from "./components/PaymentComponent.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";

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
          <Protector authentication={false}>
            <UserSignup />
          </Protector>
        ),
      },
      {
        path: "/provider/register",
        element: (
          <Protector authentication={true}>
            <ProviderRegisterPage />
          </Protector>
        ),
      },
      {
        path: "/provider/dashboard",
        element: (
          <Protector authentication={true}>
            <ProviderDashboard />
          </Protector>
        ),
      },
      {
        path: "/login",
        element: (
          <Protector authentication={false}>
            <UserLogin />
          </Protector>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protector authentication={true}>
            <UserProfile />
          </Protector>
        ),
      },
      {
        path: "/bookings",
        element: (
          <Protector authentication={true}>
            <UserBookingDetails />
          </Protector>
        ),
      },
      {
        path: "/services",
        element: (
          <Protector authentication={true}>
            <ExploreCategories />
          </Protector>
        ),
      },
      {
        path: "/services/:categoryId",
        element: (
          <Protector authentication={true}>
            <CategoryServices />
          </Protector>
        ),
      },
      {
        path: "/services/:categoryId/:subCategoryId",
        element: (
          <Protector authentication={true}>
            <Booking />
          </Protector>
        ),
      },
      {
        path: "/book/:subCategoryId",
        element: (
          <Protector authentication={true}>
            <Booking />
          </Protector>
        ),
      },
      {
        path: "/payment/success",
        element: (
          <Protector authentication={true}>
            <PaymentSuccess/>
          </Protector>
        ),
      },
      {
        path: "/payment/cancel",
        element: (
          <Protector authentication={true}>
            <PaymentCancel/>
          </Protector>
        ),
      },
    ],
  },
]);

ReactModal.setAppElement('#root');

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
