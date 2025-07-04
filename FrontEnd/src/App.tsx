import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authentication/AuthContext";
import Navbar from "./Authentication/Navbar";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import Dashboard from "./Authentication/Dashboard";
import ProtectedRoute from "./Authentication/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import SidebarToggle from "./components/SidebarToggle";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <SidebarToggle toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add more protected routes here */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Simple Home component
const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to My Web App</h1>
      <p>This is a demo application with user authentication.</p>
      <div className="features">
        <div className="feature-card">
          <h3>User Authentication</h3>
          <p>Secure login and signup system with JWT tokens.</p>
        </div>
        <div className="feature-card">
          <h3>Protected Routes</h3>
          <p>Access control for authenticated users only.</p>
        </div>
        <div className="feature-card">
          <h3>User Dashboard</h3>
          <p>Personal space for each user with their information.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
