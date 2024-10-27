import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import LeadsEditDetails from './Components/LeadsEditDetails';
import AgentsEditDetails from './Components/AgentsEditDetails';
import AgentWithdrawHistory from './Components/AgentWithdrawHistory';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password/reset" element={<Forgetpass />} />
        <Route path="/password/reset/Otp" element={<Otp />} />
        <Route path="/password/reset/Passchange" element={<Passchange />} />

        {/* Protected Route */}
        {/* Dashboard */}
        <Route path="/" element={<AuthLayout><Header title="Dashboard"><Dashboard /></Header></AuthLayout>} />
        <Route path="/ManageLeads" element={<AuthLayout><Header title="Manage Leads"><ManageLeads /></Header></AuthLayout>} />
        <Route path="/ManageAgents" element={<AuthLayout><Header title="Manage Agents"><ManageAgents /></Header></AuthLayout>} />
        <Route path="/WithdrawalRequest" element={<AuthLayout><Header title="Withdrawal Request"><WithdrawalRequest /></Header></AuthLayout>} />
        <Route path="/Mywebsite" element={<AuthLayout><Header title="My website"><Mywebsite /></Header></AuthLayout>} />
        <Route path="/Setting" element={<AuthLayout><Header title="Setting"><Setting /></Header></AuthLayout>} />

        <Route path="/ManageLeads/ViewLeadsDetails" element={<AuthLayout><Header title="Manage Leads"><ViewDetails /></Header></AuthLayout>} />
        <Route path="/ManageLeads/EditLeadsDetails" element={<AuthLayout><Header title="Manage Leads"><EditDetails /></Header></AuthLayout>} />
        <Route path="/ManageAgents/ViewManageAgents" element={<AuthLayout><Header title="Manage Agents"><AgentsViewDetails /></Header></AuthLayout>} />
        <Route path="/ManageAgents/EditManageAgents" element={<AuthLayout><Header title="Manage Agents">< AgentsEditDetails/></Header></AuthLayout>} />
        <Route path="/ManageAgents/AgentWithdrawHistory" element={<AuthLayout><Header title="Manage Agents">< AgentWithdrawHistory/></Header></AuthLayout>} />
      </Routes>
    </Router>
  )}

export default App;
