

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApprovedLeads from '../assets/icon/DashboardIcon/ApprovedLeads.svg';
import NewLeads from '../assets/icon/DashboardIcon/NewLeads.svg';
import RejectedLeads from '../assets/icon/DashboardIcon/RejectedLeads.svg';
import TotalAgents from '../assets/icon/DashboardIcon/TotalAgents.svg';
import DashboardSucessimg from '../assets/img/DashboardSucessimg.svg';

const Dashboard = () => {
  const navigate = useNavigate();



  const cardData = [
    { id: 1, title: 'New Leads', data: '435', icon: NewLeads },
    { id: 2, title: 'Approved Leads', data: '137', icon: ApprovedLeads },
    { id: 3, title: 'Rejected Leads', data: '24', icon: RejectedLeads },
    { id: 4, title: 'Total Agents', data: '674', icon: TotalAgents },
  ];


  return (
    <div className='w-[95%] m-auto my-5'>

        {/* Row of Cards */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
          {/* Card 1 - Full width on mobile, flex-grow to prevent excess space on desktop */}
          <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-3xl">Welcome Shreya Verma!</h2>
              <p className="text-[#ADB5BD] font-normal text-xl">Explore our all features and services.</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {cardData.map((card) => (
              <div key={card.id} className='border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200'>
                <div className="flex items-center p-4">
                  <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16 mr-4" />
                  <div>
                    <h2 className="text-[#063E50] font-normal text-base">{card.title}</h2>
                    <p className="text-[#212529] cursor-pointer font-semibold text-xl">{card.data}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: '-webkit-center' }} className=' space-y-5 mt-5'>
          <img className=' w-72' src={DashboardSucessimg} alt='' />
          <p className='text-[#ADB5BD] font-normal text-xl'>Navigate through other tabs to enjoy it’s features.</p>
        </div>
      </div>
  );
};

export default Dashboard;