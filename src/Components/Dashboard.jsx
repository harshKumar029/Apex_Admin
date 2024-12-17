import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure this path is correct based on your project structure
import ApprovedLeads from '../assets/icon/DashboardIcon/ApprovedLeads.svg';
import NewLeads from '../assets/icon/DashboardIcon/NewLeads.svg';
import RejectedLeads from '../assets/icon/DashboardIcon/RejectedLeads.svg';
import TotalAgents from '../assets/icon/DashboardIcon/TotalAgents.svg';
import DashboardSuccessImg from '../assets/img/DashboardSucessimg.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [dashboardData, setDashboardData] = useState({
    newLeads: 0,
    approvedLeads: 0,
    rejectedLeads: 0,
    totalAgents: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Start loading

        // Get current user's name
        const user = auth.currentUser;
        if (!user) {
          // If user is not authenticated, redirect to login
          navigate('/login');
          return;
        }

        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserName(userData.fullname);
        }

        // Fetch leads data
        const leadsQuery = collection(db, 'leads');
        const leadsSnapshot = await getDocs(leadsQuery);
        const now = new Date();
        const past48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        let newLeadsCount = 0;
        let approvedLeadsCount = 0;
        let rejectedLeadsCount = 0;

        leadsSnapshot.forEach((doc) => {
          const leadData = doc.data();
          const submissionDate = leadData.submissionDate?.toDate(); // Ensure it's a Date object

          if (leadData.status === 'pending' && submissionDate && submissionDate >= past48Hours) {
            newLeadsCount++;
          }
          if (leadData.status === 'approved') {
            approvedLeadsCount++;
          }
          if (leadData.status === 'rejected') {
            rejectedLeadsCount++;
          }
        });

        // Fetch total agents (users without role: admin)
        const agentsQuery = query(collection(db, 'users'), where('role', '!=', 'admin'));
        const agentsSnapshot = await getDocs(agentsQuery);
        const totalAgentsCount = agentsSnapshot.size;

        // Update state with fetched data
        setDashboardData({
          newLeads: newLeadsCount,
          approvedLeads: approvedLeadsCount,
          rejectedLeads: rejectedLeadsCount,
          totalAgents: totalAgentsCount,
        });

        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const cardData = [
    {
      id: 1,
      title: 'New Leads',
      data: dashboardData.newLeads,
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
      title: 'Rejected Leads',
      data: dashboardData.rejectedLeads,
      icon: RejectedLeads,
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
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  return (
    <div className="w-[95%] m-auto my-5">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
          <div>
            <h2 className="text-[#232323] font-semibold text-3xl">
              Welcome {userName || 'User'}!
            </h2>
            <p className="text-[#ADB5BD] font-normal text-xl">
              Explore all features and services.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center py-2 rounded-lg text-sm mb-2 bg-red-100 text-red-600">
          {error}
        </p>
      )}

      {/* Services Section */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={card.onClick}
            >
              <div className="flex items-center p-4">
                <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-[#063E50] font-normal text-base">{card.title}</h2>
                  <p className="text-[#212529] font-semibold text-xl">{card.data}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message Section */}
      <div className="flex flex-col items-center space-y-5 mt-5">
        <img className="w-72" src={DashboardSuccessImg} alt="Success Illustration" />
        <p className="text-[#ADB5BD] font-normal text-xl">
          Navigate through other tabs to enjoy their features.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;