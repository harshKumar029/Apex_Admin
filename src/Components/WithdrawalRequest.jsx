import React, { useState } from 'react';
import Searchbar from './Searchbar';
import { useNavigate } from 'react-router-dom';

const WithdrawalRequest = () => {
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
      { id: 379, name: 'Janet Jackon', Contact: '9012345678', Email: 'janet.jackson@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1500' },
      { id: 377, name: 'Johnnie Walker', Contact: '7890123456', Email: 'johnnie.walker@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '2500' },
      { id: 434, name: 'Johnny Walker', Contact: '5678901234', Email: 'johnny.walker@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1800' },
      { id: 855, name: 'Jim Beam', Contact: '3456789012', Email: 'jim.beam@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '2200' },
      { id: 451, name: 'Rejected Lead', Contact: '1923456788', Email: 'rejected@example.com', Status: 'In Process', approveStatus: false, AmountRequested: '1300' },
      { id: 555, name: 'Jane Doe', Contact: '2345678901', Email: 'jane.doe@example.com', Status: 'Approved', approveStatus: false, AmountRequested: '3000' },
      { id: 890, name: 'Jack Daniels', Contact: '4567890123', Email: 'jack.daniels@example.com', Status: 'Approved', approveStatus: false, AmountRequested: '2100' },
      { id: 376, name: 'Jane Smith', Contact: '6789012345', Email: 'jane.smith@example.com', Status: 'Approved', approveStatus: false, AmountRequested: '1600' },
      { id: 378, name: 'Jake Paul', Contact: '8901234567', Email: 'jake.paul@example.com', Status: 'Approved', approveStatus: false, AmountRequested: '2400' },
      { id: 10, name: 'Jane Austen', Contact: '1023456789', Email: 'jane.austen@example.com', Status: 'Rejected', approveStatus: false, AmountRequested: '1100' },
      { id: 114, name: 'Julius Caesar', Contact: '1123456780', Email: 'julius.caesar@example.com', Status: 'Rejected', approveStatus: false, AmountRequested: '1900' },
      { id: 134, name: 'Jane Eyre', Contact: '1323456782', Email: 'jane.eyre@example.com', Status: 'Rejected', approveStatus: false, AmountRequested: '1400' },
      { id: 152, name: 'Jasper Johns', Contact: '1523456784', Email: 'jasper.johns@example.com', Status: 'Rejected', approveStatus: false, AmountRequested: '2300' },
      { id: 134, name: 'Brand 1', Contact: '1623456785', Email: 'brand1@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1750' },
      { id: 124, name: 'Fulfilled Lead', Contact: '1723456786', Email: 'fulfilled@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1550' },
      { id: 301, name: 'John Doe', Contact: '1234567890', Email: 'john.doe@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1650' },
      { id: 144, name: 'Jiminy Cricket', Contact: '1423456783', Email: 'jiminy.cricket@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1200' },
      { id: 221, name: 'Pending Lead', Contact: '1823456787', Email: 'pending@example.com', Status: 'In Process', approveStatus: false, AmountRequested: '1000' },
      { id: 123, name: 'Jack Sparrow', Contact: '1223456781', Email: 'jack.sparrow@example.com', Status: 'Pending', approveStatus: true, AmountRequested: '1350' },
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
            <div key={row.id} className="bg-white shadow-md rounded-lg ">
            <div className=' p-4'>
            <div className=' flex justify-between top-0 '>
              <section className=' flex gap-3'>
                <section>
                  <p className="h-12 w-12 rounded-full font-normal text-white text-sm bg-[#063E50] flex items-center justify-center">
                    RV
                  </p>
                </section>
                <section className=' space-y-1'>
                  <p className=' font-medium text-2xl text-[#063E50]'>{row.name}</p>
                  <p className='text-[#212529]'>+91 {row.Contact}</p>
                  <p className='text-[#212529]'>Lead ID: {row.id}</p>
                  <p className='text-[#8B7010]'>Request Amount: ₹{row.AmountRequestedn}</p>
                </section>
              </section>
            </div>
            <div className=' flex justify-between my-4'>
              <p className=' inline-flex items-center gap-3'>
                <p className=' text-xl text-[#495057] font-normal'>Status</p>
                <button
                  className={`px-4 py-1 rounded-full 
                  ${row.Status === 'Pending' ? 'bg-[#D3B6262E] text-[#D3B626]' : 'text-[#718EBF]'}
                  ${row.Status === 'Approved' ? 'bg-[#28A7452E] text-[#28A745]' : 'text-[#718EBF]'}
                  ${row.Status === 'Rejected' ? 'bg-[#DC35452E] text-[#DC3545]' : 'text-[#718EBF]'}
                  ${row.Status === 'In Process' ? 'bg-[#FBB34933] text-[#FBB349]' : 'text-[#718EBF]'}
                  `}>
                  {row.Status}
                </button>
              </p>
              <p className=' inline-flex items-center gap-3'>
                <p className=' text-xl text-[#495057] font-normal'>Action</p>
                <button
                  className={`px-3 py-[2px] rounded-full 
              ${row.approveStatus === true ? 'bg-[#063E50] text-[#FFFFFF]' : 'bg-[#ADB5BD] text-[#718EBF]'}
            `}
                >
                  Approve
                </button>
              </p>
            </div>
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
              <th className=" py-2">Lead Id</th>
              <th style={{textAlign:'-webkit-center'}} className="px-4 py-2">Name</th>
              <th style={{textAlign:'-webkit-center'}} className="px-4 py-2">Contact</th>
              <th style={{textAlign:'-webkit-center'}} className="px-4 py-2">Email</th>
              <th style={{textAlign:'-webkit-center'}} className="px-4 py-2">Amount Requested</th>
              <th style={{textAlign:'-webkit-center'}} className="px-4 py-2">Status</th>
              <th  className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='text-left text-base text-[#212529] font-normal'>
            {currentItems.map((row, index) => (
              <tr key={row.id} className=' text-sm'>
                <td className="px-4 py-2">{row.id}</td>
                <td style={{textAlign:'-webkit-center'}} className="px-4 py-2">{row.name}</td>
                <td style={{textAlign:'-webkit-center'}} className="px-4 py-2">{row.Contact}</td>
                <td style={{textAlign:'-webkit-center'}} className="px-4 py-2">{row.Email}</td>
                <td style={{textAlign:'-webkit-center'}} className="px-4 py-4">₹{row.AmountRequested}</td>
                <td style={{textAlign:'-webkit-center'}}>
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
                <td className="px-4 py-3">
                  <button
                    className={`px-4 py-1 rounded-full 
                ${row.approveStatus === true ? 'bg-[#063E50] text-[#FFFFFF]' : 'bg-[#ADB5BD] text-[#718EBF]'}
              `}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-8 items-center ">
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

export default WithdrawalRequest
