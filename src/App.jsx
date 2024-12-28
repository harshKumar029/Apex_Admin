import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import AuthLayout from './Components/AuthLayout';
import Signup from './Components/Login&Signup/Signup';
import Forgetpass from './Components/Login&Signup/Forgetpass';
import Login from './Components/Login&Signup/Login';
import Otp from './Components/Login&Signup/Otp';
import Passchange from './Components/Login&Signup/Passchange';
import Header from './Components/Header';
import ScrollToTop from './Components/ScrollToTop';
import Dashboard from './Components/Dashboard';
import Setting from './Components/Setting';
import ManageLeads from './Components/ManageLeads';
import ManageAgents from './Components/ManageAgents';
import WithdrawalRequest from './Components/WithdrawalRequest';
import Mywebsite from './Components/Mywebsite';
import ViewDetails from './Components/LeadsViewDetails';
import EditDetails from './Components/LeadsEditDetails';
import AgentsViewDetails from './Components/AgentsViewDetails';
import AgentsEditDetails from './Components/AgentsEditDetails';
import AgentWithdrawHistory from './Components/AgentWithdrawHistory';

// Import ProtectedRoute
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-light-dashboard-gray h-screen flex justify-center items-center">
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password/reset" element={<Forgetpass />} />
        <Route path="/password/reset/Otp" element={<Otp />} />
        <Route path="/password/reset/Passchange" element={<Passchange />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header showSearch="false" title="Dashboard">
                  <Dashboard />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageLeads"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Leads">
                  <ManageLeads />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageAgents"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Agents">
                  <ManageAgents />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/WithdrawalRequest"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Withdrawal Request">
                  <WithdrawalRequest />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Mywebsite"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="My Website">
                  <Mywebsite />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Setting"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Setting">
                  <Setting />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Dynamic routes for leads */}
        <Route
          path="/ManageLeads/ViewLeadsDetails/:leadId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Leads">
                  <ViewDetails />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageLeads/EditLeadsDetails/:leadId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Leads">
                  <EditDetails />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Dynamic routes for agents */}
        <Route
          path="/ManageAgents/ViewManageAgents/:userId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Agents">
                  <AgentsViewDetails />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageAgents/EditManageAgents/:userId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Agents">
                  <AgentsEditDetails />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageAgents/AgentWithdrawHistory/:userId"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Header title="Manage Agents">
                  <AgentWithdrawHistory />
                </Header>
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;