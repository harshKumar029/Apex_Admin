import React, { useState } from 'react';
import Searchbar from './Searchbar';


const ManageLeads = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to show per page

  const tableData = {
    All: [
        { id: 1, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 2, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 3, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 4, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 5, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 6, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 7, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 8, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 9, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 10, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 11, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 12, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 13, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
        { id: 14, name: 'John Doe', service: 'Web Hosting', bank: 'Bank of America', date: '2024-09-25', amount: '$200', receipt: 'Yes' },
        { id: 15, name: 'Jane Doe', service: 'Domain Purchase', bank: 'Chase', date: '2024-09-23', amount: '$150', receipt: 'No' },
      ],
      Brand: [
        { id: 1, name: 'Brand 1', service: 'Brand Service', bank: 'Citi', date: '2024-09-25', amount: '$300', receipt: 'Yes' },
      ],
      Fulfill: [
        { id: 1, name: 'Fulfilled Lead', service: 'Hosting', bank: 'Wells Fargo', date: '2024-09-26', amount: '$100', receipt: 'Yes' },
      ],
      Pending: [
        { id: 1, name: 'Pending Lead', service: 'SSL Certificate', bank: 'HSBC', date: '2024-09-22', amount: '$50', receipt: 'No' },
      ],
      Rejected: [
        { id: 1, name: 'Rejected Lead', service: 'Email Hosting', bank: 'Barclays', date: '2024-09-20', amount: '$80', receipt: 'No' },
      ],
      Expire: [
        { id: 1, name: 'Expired Lead', service: 'Cloud Storage', bank: 'Capital One', date: '2024-09-19', amount: '$70', receipt: 'Yes' },
      ],
    };
  
    // Calculate total pages
    const totalPages = Math.ceil(tableData[activeFilter].length / itemsPerPage);
  
    // Get the current items for the table
    const currentItems = tableData[activeFilter].slice(
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
<div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className='sm:hidden block w-full py-4 m-auto z-0'>
        <Searchbar />
      </div>
      {/* Header */}
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">All Leads</h1>

      {/* Buttons for filtering the table */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* <div className="space-x-4"> */}
        <div className="w-full sm:w-auto"> {/* Parent Container */}
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['All', 'Brand', 'Fulfill', 'Pending', 'Rejected', 'Expire'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-4 rounded-full ${activeFilter === filter ? 'bg-[#063E50] text-white' : ' border border-[#063E50] text-[#063E50]'}`}
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
        {/* Card layout for mobile */}
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row) => (
            <div key={row.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">Name:</span>
                <span>{row.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Service:</span>
                <span>{row.service}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Bank Chosen:</span>
                <span>{row.bank}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Date:</span>
                <span>{row.date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Amount:</span>
                <span>{row.amount}</span>
              </div>
              <div className="flex justify-center">
                <button className='px-4 py-2 text-[#063E50] border border-[#063E50] rounded-full'>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <table className="min-w-full bg-white text-left">
          <thead className='text-[#063E50] font-medium text-base border-b border-[#DEE2E6]'>
            <tr>
              <th className="px-4 py-2">Sl No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Bank Chosen</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className='text-left text-base text-[#212529] font-normal'>
            {currentItems.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.service}</td>
                <td className="px-4 py-2">{row.bank}</td>
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.amount}</td>
                <td className="px-4 py-2 font-medium text-center cursor-pointer">
                  <button className='px-4 py-2 text-[#063E50] border border-[#063E50] rounded-full'>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center ">
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
  )
}

export default ManageLeads
