import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure this path is correct based on your project structure

// Icons
import ApprovedLeads from '../assets/icon/DashboardIcon/ApprovedLeads.svg';
import NewLeads from '../assets/icon/DashboardIcon/NewLeads.svg';
import RejectedLeads from '../assets/icon/DashboardIcon/RejectedLeads.svg';
import TotalAgents from '../assets/icon/DashboardIcon/TotalAgents.svg';
import DashboardSuccessImg from '../assets/img/DashboardSucessimg.svg';
import DashboardSuccessImg from '../assets/img/DashboardSucessimg.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [dashboardData, setDashboardData] = useState({
    newLeads: 0,          // Now refers to "Pending leads this month"
    approvedLeads: 0,
    declinedLeads: 0,     // changed from "rejectedLeads" to "declinedLeads"
    totalAgents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Check user auth
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user's name
        const userQ = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQ);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserName(userData.fullname);
        }

        // Prepare date for "this month" logic
        const now = new Date();
        // Start of this month (e.g., 1st 00:00)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // leads collection
        const leadsSnapshot = await getDocs(collection(db, 'leads'));

        let newLeadsCount = 0;
        let approvedLeadsCount = 0;
        let declinedLeadsCount = 0;

        leadsSnapshot.forEach((doc) => {
          const leadData = doc.data();
          const submissionDate = leadData.submissionDate?.toDate?.() || null;

          // 1) If the lead is pending AND it was submitted after the start of the month
          if (leadData.status === 'pending' && submissionDate && submissionDate >= startOfMonth) {
            newLeadsCount++;
          }
          // 2) Approved leads (no date constraint)
          if (leadData.status === 'approved') {
            approvedLeadsCount++;
          }
          // 3) Declined leads
          if (leadData.status === 'decline') {
            declinedLeadsCount++;
          }
        });

        // Agents query (users not admin)
        const agentsQ = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const agentsSnapshot = await getDocs(agentsQ);
        const totalAgentsCount = agentsSnapshot.size;

        setDashboardData({
          newLeads: newLeadsCount,
          approvedLeads: approvedLeadsCount,
          declinedLeads: declinedLeadsCount,
          totalAgents: totalAgentsCount,
        });

        setError('');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Updated card data
  const cardData = [
    {
      id: 1,
      title: 'New Leads',
      data: dashboardData.newLeads,    // Pending leads from this month
      icon: NewLeads,
      onClick: () => navigate('/ManageLeads'),
    },
    {
      id: 2,
      title: 'Approved Leads',
      data: dashboardData.approvedLeads,
      icon: ApprovedLeads,
      onClick: () => navigate('/ManageLeads'),
    },
    {
      id: 3,
      title: 'Declined Leads',        // Updated text
      data: dashboardData.declinedLeads, // leads with status='decline'
      icon: RejectedLeads,               // can keep the same icon if you want
      onClick: () => navigate('/ManageLeads'),
    },
    {
      id: 4,
      title: 'Total Agents',
      data: dashboardData.totalAgents,
      icon: TotalAgents,
      onClick: () => navigate('/ManageAgents'),
    },
  ];

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img
          src="/loading.gif"
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    );
  }

  return (
    <div className="w-[95%] m-auto my-5">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
          <h2 className="text-[#232323] font-semibold text-3xl">
            Welcome {userName || 'User'}!
          </h2>
          <p className="text-[#ADB5BD] font-normal text-xl">
            Explore all features and services.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center py-2 rounded-lg text-sm mb-2 bg-red-100 text-red-600">
          {error}
        </p>
      )}

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={card.onClick}
          >
            <div className="flex items-center p-4">
              <img
                src={card.icon}
                alt={`${card.title} Icon`}
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-[#063E50] font-normal text-base">
                  {card.title}
                </h2>
                <p className="text-[#212529] font-semibold text-xl">
                  {card.data}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Message Section */}
      <div className="flex flex-col items-center space-y-5 mt-5">
        <img
          className="w-72"
          src={DashboardSuccessImg}
          alt="Success Illustration"
        />
        <p className="text-[#ADB5BD] font-normal text-xl">
          Navigate through other tabs to enjoy their features.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;