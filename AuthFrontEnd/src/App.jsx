import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";

const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MyProfile = lazy(() => import("./pages/Profile/MyProfile"));
const LoginLogs = lazy(() => import("./pages/Logs/LoginLogs"));
const LoginHistory = lazy(() => import("./pages/History/LoginHistory"));
const FailedWebhookLogs = lazy(() => import("./pages/admin/FailedWebhookLogs"));

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/logs"
              element={
                <PrivateRoute>
                  <LoginLogs />
                </PrivateRoute>
              }
            />
            <Route
              path="/login-history"
              element={
                <PrivateRoute>
                  <LoginHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/failed-webhooks"
              element={
                <PrivateRoute>
                  <FailedWebhookLogs />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
