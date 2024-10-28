import React, { useState } from 'react';
import Searchbar from './Searchbar';
import { useNavigate } from 'react-router-dom';

const ManageLeads = () => {
  const [activeFilter, setActiveFilter] = useState('All Leads');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleDropdownItemClick = (action) => {
    console.log(`You clicked ${action}`);
    setOpenDropdownIndex(null); 
  };

  const tableData = {
    AllLeads: [
      { id: 379, name: 'Janet Jackson', Contact: '9012345678', Email: 'janet.jackson@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 377, name: 'Johnnie Walker', Contact: '7890123456', Email: 'johnnie.walker@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 434, name: 'Johnny Walker', Contact: '5678901234', Email: 'johnny.walker@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 855, name: 'Jim Beam', Contact: '3456789012', Email: 'jim.beam@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 451, name: 'Rejected Lead', Contact: '1923456788', Email: 'rejected@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'In Process', approveStatus: false, amount: '10L' },
      { id: 555, name: 'Jane Doe', Contact: '2345678901', Email: 'jane.doe@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Approved', approveStatus: false, amount: '10L' },
      { id: 890, name: 'Jack Daniels', Contact: '4567890123', Email: 'jack.daniels@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Approved', approveStatus: false, amount: '10L' },
      { id: 376, name: 'Jane Smith', Contact: '6789012345', Email: 'jane.smith@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Approved', approveStatus: false, amount: '10L' },
      { id: 378, name: 'Jake Paul', Contact: '8901234567', Email: 'jake.paul@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Approved', approveStatus: false, amount: '10L' },
      { id: 10, name: 'Jane Austen', Contact: '1023456789', Email: 'jane.austen@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Rejected', approveStatus: false, amount: '10L' },
      { id: 114, name: 'Julius Caesar', Contact: '1123456780', Email: 'julius.caesar@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Rejected', approveStatus: false, amount: '10L' },
      { id: 134, name: 'Jane Eyre', Contact: '1323456782', Email: 'jane.eyre@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Rejected', approveStatus: false, amount: '10L' },
      { id: 152, name: 'Jasper Johns', Contact: '1523456784', Email: 'jasper.johns@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Rejected', approveStatus: false, amount: '10L' },
      { id: 134, name: 'Brand 1', Contact: '1623456785', Email: 'brand1@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 124, name: 'Fulfilled Lead', Contact: '1723456786', Email: 'fulfilled@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 301, name: 'John Doe', Contact: '1234567890', Email: 'john.doe@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 144, name: 'Jiminy Cricket', Contact: '1423456783', Email: 'jiminy.cricket@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
      { id: 221, name: 'Pending Lead', Contact: '1823456787', Email: 'pending@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'In Process', approveStatus: false, amount: '10L' },
      { id: 123, name: 'Jack Sparrow', Contact: '1223456781', Email: 'jack.sparrow@example.com', Bank_Chosen: 'SBI', Service: 'Home Loan', Status: 'Pending', approveStatus: true, amount: '10L' },
    ],
  };

  // Filtering function based on active filter
  const getFilteredData = (filter) => {
    switch (filter) {
      case 'Approved Leads':
        return tableData.AllLeads.filter((lead) => lead.Status === 'Approved');
      case 'Rejected Leads':
        return tableData.AllLeads.filter((lead) => lead.Status === 'Rejected');
      case 'Pending Leads':
        return tableData.AllLeads.filter((lead) => lead.Status === 'Pending');
      case 'In Process Leads':
        return tableData.AllLeads.filter((lead) => lead.Status === 'In Process');
      default:
        return tableData.AllLeads;
    }
  };


  // Calculate total pages based on filtered data
  const filteredData = getFilteredData(activeFilter);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  console.log(filteredData, totalPages, 'thisnsibd');
  // Get the current items for the table based on pagination
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className='w-[95%] m-auto my-5'>
      <div className='sm:hidden block w-full py-4 m-auto z-0'>
        <Searchbar />
      </div>

      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">All Leads</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="w-full sm:w-auto">
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['All Leads', 'Approved Leads', 'Rejected Leads', 'Pending Leads', 'In Process Leads'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-4 rounded-full ${activeFilter === filter ? 'bg-[#063E50] text-white' : 'border border-[#063E50] text-[#063E50]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <button className="py-2 px-3 mt-5 sm:mt-auto sm:border border-[#063E50] flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full">
          <svg className="w-6 h-6 text-[#063E50]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 14-4-4m4 4 4-4" />
          </svg>
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto sm:hidden">
        {/* Mobile Card Layout */}
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row) => (
            <div key={row.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">Name:</span>
                <span>{row.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Contact:</span>
                <span>{row.Contact}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Email:</span>
                <span>{row.Email}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Bank Chosen:</span>
                <span>{row.Bank_Chosen}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Service:</span>
                <span>{row.Service}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Status:</span>
                <span>{row.Status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        {/* Table layout for larger screens */}
        <table className="min-w-full bg-white text-left">
          <thead className='text-[#063E50] font-medium text-base border-b border-[#DEE2E6]'>
            <tr>
              <th className="px-4 py-2">Lead Id</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Bank Chosen</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='text-left text-base text-[#212529] font-normal'>
            {currentItems.map((row, index) => (
              <tr key={row.id} className=' text-sm' >
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.Contact}</td>
                <td className="px-4 py-2">{row.Email}</td>
                <td className="px-4 py-2">{row.Bank_Chosen}</td>
                <td className="px-4 py-2">{row.Service}</td>
                <td className="px-4 py-4">{row.amount}</td>
                <td>
                  <button
                    className={`px-4 py-1 rounded-full 
                    ${row.Status === 'Pending' ? 'bg-[#D3B6262E] text-[#D3B626]' : 'text-[#718EBF]'}
                    ${row.Status === 'Approved' ? 'bg-[#28A7452E] text-[#28A745]' : 'text-[#718EBF]'}
                    ${row.Status === 'Rejected' ? 'bg-[#DC35452E] text-[#DC3545]' : 'text-[#718EBF]'}
                    ${row.Status === 'In Process' ? 'bg-[#FBB34933] text-[#FBB349]' : 'text-[#718EBF]'}
                    `}>
                    {row.Status}
                  </button>
                </td>
                <td className="px-4 py-3 inline-flex relative">
                  <button
                    className={`px-4 py-1 rounded-full 
                ${row.approveStatus === true ? 'bg-[#063E50] text-[#FFFFFF]' : 'bg-[#ADB5BD] text-[#718EBF]'}
              `}
                  >
                    Approve
                  </button>

                  <svg
                    className='w-6 cursor-pointer'
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => toggleDropdown(index)} // Toggle dropdown for this row
                  >
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {openDropdownIndex === index && (
                    <div className="absolute left-0 mt-7 w-28 bg-[#ffffffec] shadow-lg rounded-md z-10">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer"
                          onClick={() => {
                            handleDropdownItemClick('View');
                            navigate('/ManageLeads/ViewLeadsDetails')

                          }}
                        >

                          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z" fill="#A726A7" />
                          </svg>

                          View
                        </li>
                        <li
                          className="px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer"
                          onClick={() => {
                            handleDropdownItemClick('Edit');
                            navigate('/ManageLeads/EditLeadsDetails');
                          }}
                        >
                          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9209 3.77306C15.0039 3.86439 15.05 3.98327 15.05 4.10724C15.05 4.23921 14.9977 4.36555 14.9045 4.45876L5.75986 13.6034C5.69075 13.6728 5.60264 13.72 5.50681 13.7393M14.9209 3.77306L5.49695 13.6902M14.9209 3.77306L14.921 3.77224L14.9047 3.75591L11.7439 0.595447C11.5497 0.401214 11.2352 0.401169 11.0412 0.595447L14.9209 3.77306ZM5.50681 13.7393L5.49695 13.6902M5.50681 13.7393L5.50686 13.7392L5.49695 13.6902M5.50681 13.7393L1.54589 14.54L1.53568 14.491M5.49695 13.6902L1.53568 14.491M1.53568 14.491L1.54559 14.5401L1.5458 14.54L1.53568 14.491ZM1.76054 9.99315C1.77983 9.89726 1.82715 9.80933 1.8963 9.74018L9.13102 2.50546C9.13312 2.50292 9.13536 2.50074 9.1376 2.49888L11.0411 0.595473L1.76054 9.99315ZM1.76054 9.99315L1.80956 10.003L1.76055 9.99311L1.76054 9.99315ZM9.13498 2.5015L9.135 2.50152L9.13407 2.50238C9.13402 2.50243 9.13397 2.50247 9.13392 2.50252M9.13498 2.5015L9.13239 2.50409C9.13295 2.50349 9.13346 2.50297 9.13392 2.50252M9.13498 2.5015C9.13468 2.50178 9.13433 2.50212 9.13392 2.50252M9.13498 2.5015L9.13287 2.50361C9.13325 2.5032 9.1336 2.50284 9.13392 2.50252M6.6725 11.2852L4.2147 8.82738L9.48549 3.55659L11.9433 6.01452L6.6725 11.2852ZM5.96972 11.9881L5.16292 12.7949L2.08233 13.4176L2.70486 10.3369L3.51191 9.52988L5.96972 11.9881ZM12.6462 5.31158L10.1884 2.85377L11.3926 1.64961L13.8505 4.10741L12.6462 5.31158Z" fill="#5DD326" stroke="#3D6AD6" stroke-width="0.1" />
                          </svg>

                          Edit
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-8 ">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 flex items-center font-medium ${currentPage === 1 ? ' text-gray-500 cursor-not-allowed' : ' text-[#063E50]'} rounded`}
        >

          <svg class="w-5 h-5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
          </svg>


          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`py-2 px-4 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-[#063E50] text-white' : ' text-[#063E50]'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 flex items-center font-medium ${currentPage === totalPages ? ' text-gray-500 cursor-not-allowed' : ' text-[#063E50]'} rounded`}
        >
          Next
          <svg class="w-5 h-5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ManageLeads;
