import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RewardsProvider } from './context/RewardsContext'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import CustomerDashboard from './pages/CustomerDashboard'
import BaristaScanner from './pages/BaristaScanner'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <RewardsProvider>
        <div className="min-h-screen bg-coffee-950 text-coffee-50 font-sans">
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            } />
            <Route path="/scanner" element={
              <PrivateRoute>
                <BaristaScanner />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </RewardsProvider>
    </AuthProvider>
  )
}

export default App
