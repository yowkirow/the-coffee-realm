import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MobileLayout from "./layouts/MobileLayout";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerRewards from "./pages/customer/Rewards";
import RewardCode from "./pages/customer/Code";
import Profile from "./pages/customer/Profile"; // Shared profile for now
import StaffScanner from "./pages/staff/Scanner";
import BaristaHome from "./pages/staff/BaristaHome";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={<MobileLayout />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="rewards" element={<CustomerRewards />} />
          <Route path="code" element={<RewardCode />} />
          <Route path="orders" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Your Orders</h1><p className="text-gray-500 mt-2">Coming soon!</p></div>} />
          <Route path="locations" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Our Locations</h1><p className="text-gray-500 mt-2">Find us across the realm!</p></div>} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff">
          <Route index element={<Navigate to="/staff/home" replace />} />
          <Route path="home" element={<BaristaHome />} />
          <Route element={<MobileLayout />}>
            <Route path="scanner" element={<StaffScanner />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
