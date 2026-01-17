import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchHouses from "../pages/SearchHouses";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/ForgotPassword";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerProfile from "../profile/OwnerProfile";
import AddHouse from "../pages/AddHouse";
import HouseDetail from "../pages/HouseDetail";
import EditHouse from "../pages/EditHouse";




function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchHouses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/add-house"
          element={
            <ProtectedRoute>
              <AddHouse />
            </ProtectedRoute>
          }
        />

        <Route path="/house/:id" element={<HouseDetail />} />

        <Route
          path="/house/:id/edit"
          element={
            <ProtectedRoute role="owner">
              <EditHouse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
