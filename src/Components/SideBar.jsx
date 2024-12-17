import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase
import { auth } from '../firebase'; // Import your Firebase auth instance
import Dashboard from "../assets/icon/SidebarIcon/Dashboard.svg";
import Logout from "../assets/icon/SidebarIcon/Logout.svg";
import Mywebsite from "../assets/icon/SidebarIcon/MyWebsite.svg";
import ManageLeads from "../assets/icon/SidebarIcon/ManageLeads.svg";
import ManageAgents from "../assets/icon/SidebarIcon/ManageAgents.svg";
import WithdrawalRequest from "../assets/icon/SidebarIcon/WithdrawalRequest.svg";
import setting from "../assets/icon/SidebarIcon/setting.svg";
import ApexLogo from "../assets/icon/SidebarIcon/ApexLogo.svg";
import { useSidebar } from '../ContextApi';

const SideBar = () => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, setIsOpenProfile } = useSidebar();
  const sidebarRef = useRef(null);

  // Updated menu items: For 'My website' instead of a path, we'll store a URL field.
  const menuItems = [
    { icon: Dashboard, label: "Dashboard", path: "/" },
    { icon: ManageLeads, label: "Manage Leads", path: "/ManageLeads" },
    { icon: ManageAgents, label: "Manage Agents", path: "/ManageAgents" },
    { icon: WithdrawalRequest, label: "Withdrawal Request", path: "/WithdrawalRequest" },
    // Instead of a path within React Router, we now have a URL that should open in a new tab.
    { icon: Mywebsite, label: "My website", url: "https://apexin.in/" },
    { icon: setting, label: "Setting", path: "/setting" },
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    // If item has a 'url' property, open in a new tab
    if (item.url) {
      window.open(item.url, "_blank");
    } else {
      // Otherwise navigate to the given path
      navigate(item.path);
    }
    setIsOpen(false); // Close the sidebar when an item is clicked
  };

  return (
    <div className=' z-[1000]' onClick={() => setIsOpenProfile(false)}>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full md:w-[17%] w-64 bg-white border-r transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="border-r-[0.5px] border-[#DEE2E6] text-[#ADB5BD] h-full flex flex-col">
          <div className="w-fit mx-auto">
            <div className='flex justify-between ml-1 mt-4 '>
              <img className="w-16" src={ApexLogo} alt="ApexLogo" />
              {/* Toggle Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(false)}
              >
                <svg className='w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <ul className="menu-list max-w-fit mt-5">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="menu-item flex items-center py-[.6rem] hover:text-[#063E50] cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[1.125rem] mr-2"
                    />
                    <span className="font-medium text-base">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto">
            <hr className='border-t border-[#ADB5BD] mb-1' />
            <div className="w-fit mx-auto space-y-4 py-2">
              <button
                className="flex items-center rounded-lg px-2 gap-2"
                onClick={handleLogout} // Logout function called here
              >
                <img className="w-[1.125rem] mr-2" src={Logout} alt="Logout" />
                Logout
              </button>
              <p className="font-medium text-sm">Apex . All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;