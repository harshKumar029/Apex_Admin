import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Import the CSV utility (assuming you have a helper that generates CSV)
import { generateUserCSV } from '../utils/agentCsv.js';

const ManageAgents = () => {
  const [activeFilter, setActiveFilter] = useState('All Agents');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // after filter + search
  const [searchQuery, setSearchQuery] = useState('');     // for search bar

  const [loading, setLoading] = useState(true);           // Loading state

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  // --- Fetch users from Firestore ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,       // Firestore doc ID
          ...doc.data(),
        }));
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- Filter logic ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const recentJoinedUsers = users.filter((user) => {
    if (!user.createdAt) return false;
    const createdDate = user.createdAt.toDate();
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  });

  const getFilteredDataByStatus = () => {
    if (activeFilter === 'All Agents') {
      return users;
    } else if (activeFilter === 'Recent Joined Agent') {
      return recentJoinedUsers;
    }
    return users; // fallback
  };

  // --- Search logic ---
  const filterBySearch = (data, query) => {
    if (!query.trim()) return data;
    const lowerQ = query.toLowerCase();

    return data.filter((user) => {
      const name = (user.fullname || '').toLowerCase();
      const mobile = (user.mobile || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const uniqueID = (user.uniqueID || '').toLowerCase();
      // Check if any field includes the search text
      return (
        name.includes(lowerQ) ||
        mobile.includes(lowerQ) ||
        email.includes(lowerQ) ||
        uniqueID.includes(lowerQ)
      );
    });
  };

  // Whenever users, activeFilter, or searchQuery changes, recalc `filteredUsers`
  useEffect(() => {
    const dataByStatus = getFilteredDataByStatus();
    const finalFiltered = filterBySearch(dataByStatus, searchQuery);
    setFilteredUsers(finalFiltered);
    setCurrentPage(1); // reset to first page when filter/search changes
  }, [users, activeFilter, searchQuery]);

  // --- Pagination logic ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- CSV Download ---
  const handleDownloadCSV = () => {
    try {
      const csvContent = generateUserCSV(users); // or filteredUsers if you only want filtered
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `all_agents_${Date.now()}.csv`;

      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Failed to generate CSV file.');
    }
  };

  // If loading, show the loading spinner or gif
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
    <div className='w-[95%] m-auto my-5'>
      {/* Mobile-only Searchbar */}
      <div className='sm:hidden block w-full py-4 m-auto z-0'>
        <Searchbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">All Agents</h1>

      {/* Filters + Download Report */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="w-full sm:w-auto">
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['All Agents', 'Recent Joined Agent'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-2 px-4 rounded-full ${
                  activeFilter === filter
                    ? 'bg-[#063E50] text-white'
                    : 'border border-[#063E50] text-[#063E50]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <button
          className="py-2 px-3 mt-5 sm:mt-auto sm:border border-[#063E50] flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full"
          onClick={handleDownloadCSV}
        >
          <svg
            className="w-6 h-6 text-[#063E50]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>
          Download Report
        </button>
      </div>

      {/* Mobile Card Layout */}
      <div className="overflow-x-auto sm:hidden">
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row) => (
            <div key={row.id} className="bg-white shadow-md rounded-lg">
              <div className="p-4">
                <div className="flex justify-between top-0">
                  <section className="flex gap-3">
                    <section>
                      {/* Show name initials or fallback */}
                      <p className="h-12 w-12 rounded-full font-normal text-white text-sm bg-[#063E50] flex items-center justify-center">
                        {row.fullname
                          ? row.fullname
                              .split(' ')
                              .map((namePart) => namePart[0]?.toUpperCase())
                              .join('')
                          : 'NA'}
                      </p>
                    </section>
                    <section className="space-y-1">
                      <p className="font-medium text-2xl text-[#063E50]">
                        {row.fullname || 'No Name'}
                      </p>
                      <p className="text-[#212529]">
                        +91 {row.mobile || 'N/A'}
                      </p>
                      <p className="text-[#212529]">
                        Agent ID: {row.uniqueID || 'N/A'}
                      </p>
                    </section>
                  </section>
                </div>
              </div>

              {/* Actions at bottom */}
              <div>
                <ul className="flex justify-between border-t border-[#DEE2E6]">
                  <li
                    className="px-4 py-2 inline-flex gap-2 items-center font-medium text-base text-[#212529] cursor-pointer"
                    // Pass user id to View page
                    onClick={() => navigate(`/ManageAgents/ViewManageAgents/${row.id}`)}
                  >
                    <svg
                        width='16'
                        height='17'
                        viewBox='0 0 16 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z'
                          fill='#A726A7'
                        />
                      </svg>
                    View
                  </li>

                  <li
                    className="px-4 py-2 inline-flex gap-2 items-center font-medium text-base border-x border-[#DEE2E6] text-[#212529] cursor-pointer"
                    // Pass user id to Edit page
                    onClick={() => navigate(`/ManageAgents/EditManageAgents/${row.id}`)}
                  >
                    <svg
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.9209 3.77306C15.0039 3.86439 15.05 3.98327 15.05 4.10724C15.05 4.23921 14.9977 4.36555 14.9045 4.45876L5.75986 13.6034C5.69075 13.6728 5.60264 13.72 5.50681 13.7393M14.9209 3.77306L5.49695 13.6902M14.9209 3.77306L14.921 3.77224L14.9047 3.75591L11.7439 0.595447C11.5497 0.401214 11.2352 0.401169 11.0412 0.595447L14.9209 3.77306ZM5.50681 13.7393L5.49695 13.6902M5.50681 13.7393L5.50686 13.7392L5.49695 13.6902M5.50681 13.7393L1.54589 14.54L1.53568 14.491M5.49695 13.6902L1.53568 14.491M1.53568 14.491L1.54559 14.5401L1.5458 14.54L1.53568 14.491ZM1.76054 9.99315C1.77983 9.89726 1.82715 9.80933 1.8963 9.74018L9.13102 2.50546C9.13312 2.50292 9.13536 2.50074 9.1376 2.49888L11.0411 0.595473L1.76054 9.99315ZM1.76054 9.99315L1.80956 10.003L1.76055 9.99311L1.76054 9.99315ZM9.13498 2.5015L9.135 2.50152L9.13407 2.50238C9.13402 2.50243 9.13397 2.50247 9.13392 2.50252M9.13498 2.5015L9.13239 2.50409C9.13295 2.50349 9.13346 2.50297 9.13392 2.50252M9.13498 2.5015C9.13468 2.50178 9.13433 2.50212 9.13392 2.50252M9.13498 2.5015L9.13287 2.50361C9.13325 2.5032 9.1336 2.50284 9.13392 2.50252M6.6725 11.2852L4.2147 8.82738L9.48549 3.55659L11.9433 6.01452L6.6725 11.2852ZM5.96972 11.9881L5.16292 12.7949L2.08233 13.4176L2.70486 10.3369L3.51191 9.52988L5.96972 11.9881ZM12.6462 5.31158L10.1884 2.85377L11.3926 1.64961L13.8505 4.10741L12.6462 5.31158Z"
                        fill="#5DD326"
                        stroke="#3D6AD6"
                        strokeWidth="0.1"
                      />
                    </svg>
                    Edit
                  </li>

                  <li
                    className="px-4 py-2 inline-flex gap-2 items-center font-medium text-base text-[#212529] cursor-pointer"
                    // Pass user id to Pay History page
                    onClick={() => navigate(`/ManageAgents/AgentWithdrawHistory/${row.id}`)}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.96968 16C7.18515 16 5.6294 15.4196 4.30243 14.2587C2.97604 13.0985 2.20857 11.6372 2 9.875H2.88846C3.12749 11.38 3.81617 12.6313 4.95449 13.6288C6.09282 14.6263 7.43121 15.125 8.96968 15.125C10.6833 15.125 12.1368 14.5309 13.3302 13.3426C14.5236 12.1544 15.1206 10.7068 15.1212 9C15.1218 7.29317 14.5248 5.84563 13.3302 4.65738C12.1357 3.46913 10.6821 2.875 8.96968 2.875C8.05984 2.875 7.20507 3.06633 6.40537 3.449C5.60567 3.83108 4.89971 4.35754 4.28749 5.02837H6.46777V5.90338H2.81815V2.27038H3.69694V4.35987C4.37654 3.61729 5.17272 3.03862 6.08549 2.62387C6.99826 2.20912 7.95966 2.00117 8.96968 2C9.94397 2 10.8573 2.18258 11.7097 2.54775C12.5622 2.91292 13.3068 3.41283 13.9436 4.0475C14.5805 4.68217 15.0825 5.42358 15.4499 6.27175C15.8172 7.11992 16.0006 8.02933 16 9C15.9994 9.97067 15.816 10.8801 15.4499 11.7283C15.0837 12.5764 14.5816 13.3178 13.9436 13.9525C13.3056 14.5872 12.561 15.0871 11.7097 15.4523C10.8585 15.8174 9.94514 16 8.96968 16ZM11.7853 12.3722L8.58038 9.182V4.625H9.45917V8.818L12.4066 11.7528L11.7853 12.3722Z"
                        fill="#2651A7"
                      />
                    </svg>
                    Pay History
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table layout for larger screens */}
      <div className="hidden sm:block">
        <table className="min-w-full bg-white text-left">
          <thead className="text-[#063E50] font-medium text-base border-b border-[#DEE2E6]">
            <tr>
              <th className="px-4 py-2">Agent ID</th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Name
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Contact
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Email
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-left text-base text-[#212529] font-normal">
            {currentItems.map((row, index) => (
              <tr key={row.id} className="text-sm">
                <td className="p-4 py-2">{row.uniqueID || 'N/A'}</td>
                <td
                  style={{ textAlign: '-webkit-center' }}
                  className="px-4 py-2"
                >
                  {row.fullname || 'No Name'}
                </td>
                <td
                  style={{ textAlign: '-webkit-center' }}
                  className="px-4 py-2"
                >
                  {row.mobile || 'N/A'}
                </td>
                <td
                  style={{ textAlign: '-webkit-center' }}
                  className="px-4 py-2"
                >
                  {row.email || 'N/A'}
                </td>
                <td
                  className="px-4 py-2"
                  style={{ textAlign: '-webkit-center' }}
                >
                  <div className="flex gap-4 items-center justify-center">
                    {/* View */}
                    <svg
                        width='16'
                        height='17'
                        viewBox='0 0 16 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z'
                          fill='#A726A7'
                        />
                      </svg>

                    {/* Edit */}
                    <svg
                      className="w-5 h-5 text-[#343C6A] cursor-pointer"
                      onClick={() => navigate(`/ManageAgents/EditManageAgents/${row.id}`)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 15"
                    >
                      <path
                        d="M14.9209 3.77306C15.0039 3.86439 15.05 3.98327 15.05 4.10724C15.05 4.23921 14.9977 4.36555 14.9045 4.45876L5.75986 13.6034C5.69075 13.6728 5.60264 13.72 5.50681 13.7393M14.9209 3.77306L5.49695 13.6902M14.9209 3.77306L14.921 3.77224L14.9047 3.75591L11.7439 0.595447C11.5497 0.401214 11.2352 0.401169 11.0412 0.595447L14.9209 3.77306ZM5.50681 13.7393L5.49695 13.6902M5.50681 13.7393L5.50686 13.7392L5.49695 13.6902M5.50681 13.7393L1.54589 14.54L1.53568 14.491M5.49695 13.6902L1.53568 14.491M1.53568 14.491L1.54559 14.5401L1.5458 14.54L1.53568 14.491ZM1.76054 9.99315C1.77983 9.89726 1.82715 9.80933 1.8963 9.74018L9.13102 2.50546C9.13312 2.50292 9.13536 2.50074 9.1376 2.49888L11.0411 0.595473L1.76054 9.99315ZM1.76054 9.99315L1.80956 10.003L1.76055 9.99311L1.76054 9.99315ZM9.13498 2.5015L9.135 2.50152L9.13407 2.50238C9.13402 2.50243 9.13397 2.50247 9.13392 2.50252M9.13498 2.5015L9.13239 2.50409C9.13295 2.50349 9.13346 2.50297 9.13392 2.50252M9.13498 2.5015C9.13468 2.50178 9.13433 2.50212 9.13392 2.50252M9.13498 2.5015L9.13287 2.50361C9.13325 2.5032 9.1336 2.50284 9.13392 2.50252M6.6725 11.2852L4.2147 8.82738L9.48549 3.55659L11.9433 6.01452L6.6725 11.2852ZM5.96972 11.9881L5.16292 12.7949L2.08233 13.4176L2.70486 10.3369L3.51191 9.52988L5.96972 11.9881ZM12.6462 5.31158L10.1884 2.85377L11.3926 1.64961L13.8505 4.10741L12.6462 5.31158Z"
                        fill="#5DD326"
                        stroke="#3D6AD6"
                        strokeWidth="0.1"
                      />
                    </svg>

                    {/* Pay history */}
                    <svg
                      className="w-5 h-5 text-[#343C6A] cursor-pointer"
                      onClick={() => navigate(`/ManageAgents/AgentWithdrawHistory/${row.id}`)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 17 17"
                    >
                      <path
                        d="M8.96968 16C7.18515 16 5.6294 15.4196 4.30243 14.2587C2.97604 13.0985 2.20857 11.6372 2 9.875H2.88846C3.12749 11.38 3.81617 12.6313 4.95449 13.6288C6.09282 14.6263 7.43121 15.125 8.96968 15.125C10.6833 15.125 12.1368 14.5309 13.3302 13.3426C14.5236 12.1544 15.1206 10.7068 15.1212 9C15.1218 7.29317 14.5248 5.84563 13.3302 4.65738C12.1357 3.46913 10.6821 2.875 8.96968 2.875C8.05984 2.875 7.20507 3.06633 6.40537 3.449C5.60567 3.83108 4.89971 4.35754 4.28749 5.02837H6.46777V5.90338H2.81815V2.27038H3.69694V4.35987C4.37654 3.61729 5.17272 3.03862 6.08549 2.62387C6.99826 2.20912 7.95966 2.00117 8.96968 2C9.94397 2 10.8573 2.18258 11.7097 2.54775C12.5622 2.91292 13.3068 3.41283 13.9436 4.0475C14.5805 4.68217 15.0825 5.42358 15.4499 6.27175C15.8172 7.11992 16.0006 8.02933 16 9C15.9994 9.97067 15.816 10.8801 15.4499 11.7283C15.0837 12.5764 14.5816 13.3178 13.9436 13.9525C13.3056 14.5872 12.561 15.0871 11.7097 15.4523C10.8585 15.8174 9.94514 16 8.96968 16ZM11.7853 12.3722L8.58038 9.182V4.625H9.45917V8.818L12.4066 11.7528L11.7853 12.3722Z"
                        fill="#2651A7"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 flex items-centers font-medium ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-[#063E50]'
          } rounded`}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`py-2 px-4 mx-1 rounded-lg ${
              currentPage === index + 1
                ? 'bg-[#063E50] text-white'
                : 'text-[#063E50]'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 flex items-center font-medium ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-[#063E50]'
          } rounded`}
        >
          Next
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9 5 7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ManageAgents;