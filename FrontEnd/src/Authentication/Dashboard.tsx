import { useAuth } from "./AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>
          Welcome to your personal dashboard, {user?.fullName || user?.username}
          !
        </p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            {user?.fullName && (
              <div className="info-item">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{user.fullName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Account Actions</h3>
          <div className="dashboard-actions">
            <button className="action-button">Edit Profile</button>
            <button className="action-button">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
