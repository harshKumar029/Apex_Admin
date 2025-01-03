import React, { useRef, useState, useEffect } from 'react';
import Searchbar from './Searchbar'; // Import the Searchbar
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';

// CSV Utils
import { generateCSV } from '../utils/csvUtils';

// The file containing the approval logic
import { handleLeadApproval } from '../utils/leadApprovalLogic';

// Import SVG icons
import AMRECIANEXPRES from '../assets/icon/DashboardIcon/BankIcon/AMRECIANEXPRES.svg';
import AUBank from '../assets/icon/DashboardIcon/BankIcon/AUBank.svg';
import AXISBANK from '../assets/icon/DashboardIcon/BankIcon/AXISBANK.svg';
import BOB from '../assets/icon/DashboardIcon/BankIcon/BOB.svg';
import HDFC from '../assets/icon/DashboardIcon/BankIcon/HDFC.svg';
import hsbc from '../assets/icon/DashboardIcon/BankIcon/hsbc.svg';
import ICICI from '../assets/icon/DashboardIcon/BankIcon/ICICI.svg';
import IDFCBANK from '../assets/icon/DashboardIcon/BankIcon/IDFCBANK.svg';
import INDBANK from '../assets/icon/DashboardIcon/BankIcon/INDBANK.svg';
import kotakmahindrabank from '../assets/icon/DashboardIcon/BankIcon/kotakmahindrabank.svg';
import RBL from '../assets/icon/DashboardIcon/BankIcon/RBL.svg';
import SBIBANK from '../assets/icon/DashboardIcon/BankIcon/SBIBANK.svg';
import STANDARDCHARTERED from '../assets/icon/DashboardIcon/BankIcon/STANDARDCHARTERED.svg';
import YESBANK from '../assets/icon/DashboardIcon/BankIcon/YESBANK.svg';

// Map of bank IDs to icon imports
const bankIcons = {
  hdfcBank: HDFC,
  iciciBank: ICICI,
  sbiBank: SBIBANK,
  yesBank: YESBANK,
  hsbcBank: hsbc,
  indusBank: INDBANK,
  idfcFirstBank: IDFCBANK,
  axisBank: AXISBANK,
  auBank: AUBank,
  bobBank: BOB,
  kotakMahindraBank: kotakmahindrabank,
  rblBank: RBL,
  standardChartered: STANDARDCHARTERED,
  americanExpress: AMRECIANEXPRES,
};

const ManageLeads = () => {
  const navigate = useNavigate();

  // ----------- Loading state -----------
  const [loading, setLoading] = useState(true);

  // ----------- Search State -----------
  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Data arrays
  const [leads, setLeads] = useState([]);
  const [banksData, setBanksData] = useState({});
  const [servicesData, setServicesData] = useState({});

  const itemsPerPage = 15;
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Delete confirmation
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // For success message
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatusMessage, setShowStatusMessage] = useState(false);

  // Approve popup
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveAmount, setApproveAmount] = useState('');
  const [leadToApprove, setLeadToApprove] = useState(null);

  // Dropdown ref
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // ------------- Fetch leads -------------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'leads'),
      (snapshot) => {
        const fetchedLeads = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        // Sort leads by newest first
        fetchedLeads.sort((a, b) => b.submissionDate.seconds - a.submissionDate.seconds);
        setLeads(fetchedLeads);

        // Once leads are fetched for the first time, set loading = false
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching leads:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ------------- Fetch Banks data -------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'banks'), (snapshot) => {
      const banks = {};
      snapshot.forEach((docSnap) => {
        banks[docSnap.id] = docSnap.data().name;
      });
      setBanksData(banks);
    });
    return () => unsub();
  }, []);

  // ------------- Fetch Services data -------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snapshot) => {
      const services = {};
      snapshot.forEach((docSnap) => {
        services[docSnap.id] = docSnap.data().name;
      });
      setServicesData(services);
    });
    return () => unsub();
  }, []);

  // Helper: toggle the action dropdown
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Helper: Check if lead is expired => pending > 2 months
  const isExpired = (lead) => {
    if (lead.status !== 'pending') return false;
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const submissionDate = lead.submissionDate?.toDate
      ? lead.submissionDate.toDate()
      : new Date(lead.submissionDate);
    return submissionDate < twoMonthsAgo;
  };

  // Filter logic (status-based)
  const getFilteredData = (filter) => {
    switch (filter) {
      case 'All':
        return leads;
      case 'New':
        return leads.filter((lead) => lead.status === 'new');
      case 'Approved':
        return leads.filter((lead) => lead.status === 'approved');
      case 'Pending':
        return leads.filter((lead) => lead.status === 'pending' && !isExpired(lead));
      case 'In Processing':
        return leads.filter((lead) => lead.status === 'processing');
      case 'No Answering':
        return leads.filter((lead) => lead.status === 'noAnswering');
      case 'Declined':
        return leads.filter((lead) => lead.status === 'decline');
      case 'Expired':
        return leads.filter((lead) => isExpired(lead));
      default:
        return leads;
    }
  };

  // Additional search logic
  const getSearchFilteredData = (data) => {
    if (!searchQuery.trim()) return data; // If no search query, return all

    const lowercasedQuery = searchQuery.toLowerCase();

    return data.filter((lead) => {
      const name = lead.customerDetails?.fullname?.toLowerCase() || '';
      const mobile = lead.customerDetails?.mobile?.toLowerCase() || '';
      const email = lead.customerDetails?.email?.toLowerCase() || '';
      const status = lead.status?.toLowerCase() || '';
      const bankId = lead.bankId?.toLowerCase() || '';
      const serviceId = lead.serviceId?.toLowerCase() || '';

      return (
        name.includes(lowercasedQuery) ||
        mobile.includes(lowercasedQuery) ||
        email.includes(lowercasedQuery) ||
        status.includes(lowercasedQuery) ||
        bankId.includes(lowercasedQuery) ||
        serviceId.includes(lowercasedQuery)
      );
    });
  };

  // Combine both filter & search
  const filteredData = getFilteredData(activeFilter);
  const searchFilteredData = getSearchFilteredData(filteredData);

  // Pagination
  const totalPages = Math.ceil(searchFilteredData.length / itemsPerPage);
  const currentItems = searchFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Show success message for 3 seconds
  const showSuccessMessage = (msg) => {
    setStatusMessage(msg);
    setShowStatusMessage(true);
    setTimeout(() => {
      setShowStatusMessage(false);
      setStatusMessage('');
    }, 3000);
  };

  // Delete lead
  const confirmDeleteLead = (leadId) => {
    setLeadToDelete(leadId);
    setShowDeleteConfirmModal(true);
  };
  const handleDeleteLead = async (leadId) => {
    await deleteDoc(doc(db, 'leads', leadId));
  };

  // Approve lead => show popup
  const handleShowApproveModal = (lead) => {
    const defaultAmount = lead.earningAmount ?? 0;
    setApproveAmount(String(defaultAmount));
    setLeadToApprove(lead);
    setShowApproveModal(true);
  };

  // On confirm in Approve popup => finalize the approval
  const handleApproveConfirm = async () => {
    if (!leadToApprove) return;

    try {
      // 1) Call our separate approval logic
      await handleLeadApproval(leadToApprove, approveAmount);

      // 2) Show success message
      showSuccessMessage('Lead approved successfully!');
    } catch (error) {
      console.error('Error approving lead:', error);
      showSuccessMessage('Failed to approve lead.');
    } finally {
      // 3) Close the modal
      setShowApproveModal(false);
      setLeadToApprove(null);
    }
  };

  // Helper for changing other statuses (decline, processing, noAnswering)
  const handleStatusChange = async (lead, newStatus) => {
    // If lead is already "approved", do nothing
    if (lead.status === 'approved') return;

    if (newStatus === 'approved') {
      // Show the Approve popup to set amount
      handleShowApproveModal(lead);
      setOpenDropdownIndex(null);
      return;
    }

    // Otherwise (decline, processing, noAnswering)
    try {
      await updateDoc(doc(db, 'leads', lead.id), { status: newStatus });
      showSuccessMessage(`Lead status changed to ${newStatus}!`);
    } catch (err) {
      console.error('Error updating lead status:', err);
      showSuccessMessage('Failed to change lead status.');
    }
    setOpenDropdownIndex(null);
  };

  const getBankIcon = (bankId) => bankIcons[bankId] || SBIBANK; // default SBI

  // Handler for CSV download
  const handleDownloadCSV = () => {
    try {
      const csvContent = generateCSV(leads);

      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `all_leads_${Date.now()}.csv`;

      // Create a link & trigger the download
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

  // -------------------------
  // RENDER LOGIC
  // -------------------------
  // 1) If loading => show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        {/* Adjust path to your actual loading GIF */}
        <img
          src="/loading.gif"
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    );
  }

  // 2) Otherwise, show the main content
  return (
    <div className="w-[95%] m-auto my-5">
      {/* Success Message */}
      {showStatusMessage && statusMessage && (
        <div className="bg-green-50 text-green-800 border border-green-200 px-4 py-3 rounded mb-4 transition-all">
          <p className="font-medium">{statusMessage}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-medium mb-4">
              Are you sure you want to delete this lead?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={async () => {
                  await handleDeleteLead(leadToDelete);
                  setShowDeleteConfirmModal(false);
                  setLeadToDelete(null);
                  showSuccessMessage('Lead deleted successfully!');
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && leadToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-[#063E50]">
              Approve Lead
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              You're about to approve lead <strong>{leadToApprove.id}</strong>.
            </p>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Earning Amount
            </label>
            <input
              type="number"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowApproveModal(false);
                  setLeadToApprove(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#063E50] text-white rounded"
                onClick={handleApproveConfirm}
              >
                Confirm
              </button>
            </div>
            {/* Close btn */}
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowApproveModal(false);
                setLeadToApprove(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile-only Searchbar */}
      <div className="sm:hidden block w-full py-4 m-auto z-0">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">All Leads</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Filter buttons */}
        <div className="w-full sm:w-auto">
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {[
              'All',
              'New',
              'Approved',
              'Pending',
              'In Processing',
              'No Answering',
              'Declined',
              'Expired',
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
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

        {/* Download CSV button */}
        <button
          onClick={handleDownloadCSV}
          className="py-2 px-3 mt-5 sm:mt-auto sm:border border-[#063E50] flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full"
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

      {/* MOBILE LAYOUT */}
      <div className="overflow-x-auto sm:hidden">
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row, idx) => {
            const submissionDate = row.submissionDate?.toDate
              ? row.submissionDate.toDate()
              : new Date(row.submissionDate);

            const bankName = banksData[row.bankId] || row.bankId;
            const serviceName = servicesData[row.serviceId] || row.serviceId;

            // Display status logic
            const rawStatus = row.status?.toLowerCase() || '';
            let displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
            if (rawStatus === 'decline') displayStatus = 'Declined';
            if (rawStatus === 'processing') displayStatus = 'In Processing';
            if (rawStatus === 'noanswering') displayStatus = 'No Answering';
            if (isExpired(row) && row.status === 'pending') {
              displayStatus = 'Expired';
            }

            const BankIcon = getBankIcon(row.bankId);
            const isApproved = row.status === 'approved';

            return (
              <div key={row.id} className="bg-white shadow-md rounded-lg">
                <div className="p-4">
                  <div className="flex justify-between">
                    <section className="flex gap-3">
                      <section>
                        <p className="h-12 w-12 rounded-full font-normal text-white text-sm bg-[#063E50] flex items-center justify-center">
                          {row.customerDetails?.fullname
                            ? row.customerDetails.fullname
                                .slice(0, 2)
                                .toUpperCase()
                            : 'NA'}
                        </p>
                      </section>
                      <section className="space-y-1">
                        <p className="font-medium text-2xl text-[#063E50]">
                          {row.customerDetails?.fullname || 'N/A'}
                        </p>
                        <p className="text-[#212529]">
                          +91 {row.customerDetails?.mobile || 'N/A'}
                        </p>
                        <p className="text-[#212529]">Lead ID: {row.id}</p>
                        <p className="text-[#212529]">Service Chosen: {serviceName}</p>
                      </section>
                    </section>
                    <section className="flex flex-col items-center">
                      {BankIcon && (
                        <img className="w-16 mb-1" src={BankIcon} alt="bank-logo" />
                      )}
                      <p className="text-center text-sm text-[#212529]">{bankName}</p>
                    </section>
                  </div>

                  <div className="flex justify-between my-4">
                    <p className="inline-flex items-center gap-3">
                      <span className="text-xl text-[#495057] font-normal">Status</span>
                      <button
                        className={`px-4 py-1 rounded-full 
                          ${row.status === 'pending' ? 'bg-[#D3B6262E] text-[#D3B626]' : ''}
                          ${row.status === 'approved' ? 'bg-[#28A7452E] text-[#28A745]' : ''}
                          ${row.status === 'decline' ? 'bg-[#DC35452E] text-[#DC3545]' : ''}
                          ${row.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${row.status === 'noAnswering' ? 'bg-purple-100 text-purple-800' : ''}
                          ${row.status === 'new' ? 'bg-[#D3B6262E] text-[#D3B626]' : ''}
                          ${isExpired(row) ? 'bg-[#FBB34933] text-[#FBB349]' : ''}
                        `}
                      >
                        {displayStatus}
                      </button>
                    </p>

                    <p className="inline-flex items-center gap-3">
                      <span className="text-xl text-[#495057] font-normal">Action</span>
                      {/* Choose button on mobile */}
                      <div className="relative">
                        <button
                          className="px-3 py-[2px] rounded-full bg-[#063E50] text-[#FFFFFF]"
                          onClick={() => toggleDropdown(idx)}
                        >
                          Choose
                        </button>
                        {openDropdownIndex === idx && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-36 bg-[#ffffffec] shadow-lg rounded-md z-10"
                          >
                            <ul className="py-1">
                              <li
                                className={`px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer
                                  ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                onClick={() => {
                                  if (!isApproved) handleStatusChange(row, 'approved');
                                }}
                              >
                                Approve
                              </li>
                              <li
                                className={`px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer
                                  ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                onClick={() => {
                                  if (!isApproved) handleStatusChange(row, 'decline');
                                }}
                              >
                                Decline
                              </li>
                              <li
                                className={`px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer
                                  ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                onClick={() => {
                                  if (!isApproved) handleStatusChange(row, 'processing');
                                }}
                              >
                                Processing
                              </li>
                              <li
                                className={`px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer
                                  ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                onClick={() => {
                                  if (!isApproved) handleStatusChange(row, 'noAnswering');
                                }}
                              >
                                No Answering
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </p>
                  </div>
                </div>

                <div>
                  <ul className="grid grid-cols-3 border-t border-[#DEE2E6]">
                    <li
                      className="px-4 py-2 inline-flex gap-3 items-center font-medium text-lg text-[#212529] cursor-pointer"
                      onClick={() => {
                        navigate(`/ManageLeads/ViewLeadsDetails/${row.id}`);
                      }}
                    >
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
                      View
                    </li>
                    <li
                      className="px-4 py-2 inline-flex gap-3 items-center font-medium text-lg border-x border-[#DEE2E6] text-[#212529] cursor-pointer"
                      onClick={() => {
                        navigate(`/ManageLeads/EditLeadsDetails/${row.id}`);
                      }}
                    >
                      {/* Edit */}
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
                      className="px-4 py-2 inline-flex gap-3 items-center font-medium text-lg text-[#212529] cursor-pointer"
                      onClick={() => confirmDeleteLead(row.id)}
                    >
                      {/* Delete */}
                      <svg
                        width="15"
                        height="17"
                        viewBox="0 0 15 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.523225 3.70354H1.9186V14.1687C1.9186 14.7701 2.15743 15.3467 2.58264 15.772C3.00785 16.1972 3.58468 16.4361 4.18605 16.4361H11.1628C11.7641 16.4361 12.3409 16.1972 12.7661 15.772C13.1913 15.3468 13.4301 14.7701 13.4301 14.1687V3.70354H14.4767C14.6637 3.70354 14.8364 3.60378 14.9299 3.44196C15.0234 3.28003 15.0234 3.08051 14.9299 2.91868C14.8364 2.75674 14.6637 2.65698 14.4767 2.65698H10.8139V2.48251V2.48263C10.8139 1.9737 10.6118 1.4857 10.2521 1.12594C9.89218 0.766166 9.40418 0.563965 8.89538 0.563965H6.45346C5.94465 0.563965 5.45665 0.766172 5.09689 1.12594C4.73699 1.4857 4.53491 1.9737 4.53491 2.48263V2.6571L0.523287 2.65698C0.336288 2.65698 0.163642 2.75674 0.0700789 2.91868C-0.0233596 3.08049 -0.0233596 3.28004 0.0700789 3.44196C0.163639 3.60378 0.336282 3.70354 0.523287 3.70354H0.523225ZM12.3837 14.1687C12.3837 14.4925 12.2551 14.803 12.0261 15.032C11.7972 15.261 11.4866 15.3896 11.1628 15.3896H4.18605C3.86219 15.3896 3.55169 15.261 3.32271 15.032C3.09373 14.803 2.96502 14.4925 2.96502 14.1687V3.70354H12.3836L12.3837 14.1687ZM5.58136 2.48261H5.58124C5.58124 2.25133 5.67322 2.02953 5.83674 1.86589C6.00025 1.70237 6.22205 1.61051 6.45334 1.61051H8.89526C9.12655 1.61051 9.34834 1.70237 9.51186 1.86589C9.6755 2.02953 9.76736 2.25132 9.76736 2.48261V2.65708L5.58131 2.65696L5.58136 2.48261Z"
                          fill="#F47A7A"
                        />
                        <path
                          d="M7.67563 6.67276C7.53681 6.67276 7.40371 6.72787 7.30552 6.82606C7.20746 6.92412 7.15234 7.05722 7.15234 7.19604V13.4751C7.15234 13.662 7.25211 13.8348 7.41392 13.9282C7.57586 14.0216 7.77528 14.0216 7.93721 13.9282C8.09914 13.8348 8.19879 13.662 8.19879 13.4751V7.19604C8.19879 7.05723 8.14367 6.92412 8.04561 6.82606C7.94743 6.72788 7.81433 6.67276 7.67563 6.67276Z"
                          fill="#F47A7A"
                        />
                        <path
                          d="M9.58984 7.19605V13.4751C9.58984 13.662 9.68961 13.8348 9.85154 13.9282C10.0134 14.0216 10.2129 14.0216 10.3747 13.9282C10.5366 13.8348 10.6364 13.662 10.6364 13.4751V7.19605C10.6364 7.00905 10.5366 6.8364 10.3747 6.74284C10.2129 6.6494 10.0133 6.6494 9.85154 6.74284C9.68961 6.8364 9.58984 7.00904 9.58984 7.19605Z"
                          fill="#F47A7A"
                        />
                        <path
                          d="M5.23422 6.67276C5.09552 6.67276 4.96242 6.72787 4.86424 6.82606C4.76618 6.92412 4.71094 7.05722 4.71094 7.19604V13.4751C4.71094 13.662 4.8107 13.8348 4.97264 13.9282C5.13445 14.0216 5.33399 14.0216 5.49592 13.9282C5.65774 13.8348 5.7575 13.662 5.7575 13.4751V7.19604C5.7575 7.05723 5.70239 6.92412 5.6042 6.82606C5.50614 6.72788 5.37304 6.67276 5.23422 6.67276Z"
                          fill="#F47A7A"
                        />
                      </svg>
                      Delete
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden sm:block">
        <table className="min-w-full bg-white text-left">
          <thead className="text-[#063E50] font-medium text-base border-b border-[#DEE2E6]">
            <tr>
              <th className="py-2">SI NO</th>
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
                Bank Chosen
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Service
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Date of Submission
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Status
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-left text-base text-[#212529] font-normal">
            {currentItems.map((row, index) => {
              const siNo = (currentPage - 1) * itemsPerPage + (index + 1);
              const submissionDate = row.submissionDate?.toDate
                ? row.submissionDate.toDate()
                : new Date(row.submissionDate);
              const bankName = banksData[row.bankId] || row.bankId;
              const serviceName = servicesData[row.serviceId] || row.serviceId;

              const rawStatus = row.status?.toLowerCase() || '';
              let displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
              if (rawStatus === 'decline') displayStatus = 'Declined';
              if (rawStatus === 'processing') displayStatus = 'In Processing';
              if (rawStatus === 'noanswering') displayStatus = 'No Answering';
              if (isExpired(row) && row.status === 'pending') {
                displayStatus = 'Expired';
              }

              const isApproved = row.status === 'approved';

              return (
                <tr key={row.id} className="text-sm">
                  <td className="px-4 py-2">{siNo}</td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.customerDetails?.fullname || 'N/A'}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.customerDetails?.mobile || 'N/A'}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.customerDetails?.email || 'N/A'}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {bankName}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {serviceName}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-4">
                    {format(submissionDate, 'dd/MM/yyyy')}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }}>
                    <button
                      className={`px-4 py-1 rounded-full 
                        ${row.status === 'pending' ? 'bg-[#D3B6262E] text-[#D3B626]' : ''}
                        ${row.status === 'approved' ? 'bg-[#28A7452E] text-[#28A745]' : ''}
                        ${row.status === 'decline' ? 'bg-[#DC35452E] text-[#DC3545]' : ''}
                        ${row.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${row.status === 'noAnswering' ? 'bg-purple-100 text-purple-800' : ''}
                        ${row.status === 'new' ? 'bg-[#D3B6262E] text-[#D3B626]' : ''}
                        ${isExpired(row) ? 'bg-[#FBB34933] text-[#FBB349]' : ''}
                      `}
                    >
                      {displayStatus}
                    </button>
                  </td>
                  <td className="px-4 py-3 inline-flex relative items-center gap-2">
                    <div className="relative">
                      <button
                        className="px-4 py-1 rounded-full bg-[#063E50] text-[#FFFFFF]"
                        onClick={() => toggleDropdown(index)}
                      >
                        Choose
                      </button>

                      {openDropdownIndex === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-36 bg-[#FFFFFF] shadow-lg rounded-md z-10"
                        >
                          <ul className="py-1">
                            <li
                              className={`px-4 py-2 m-1 items-center cursor-pointer
                                ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onClick={() => {
                                if (!isApproved) handleStatusChange(row, 'approved');
                              }}
                            >
                              Approve
                            </li>
                            <li
                              className={`px-4 py-2 m-1 items-center cursor-pointer
                                ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onClick={() => {
                                if (!isApproved) handleStatusChange(row, 'decline');
                              }}
                            >
                              Decline
                            </li>
                            <li
                              className={`px-4 py-2 m-1 items-center cursor-pointer
                                ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onClick={() => {
                                if (!isApproved) handleStatusChange(row, 'processing');
                              }}
                            >
                              Processing
                            </li>
                            <li
                              className={`px-4 py-2 m-1 items-center cursor-pointer
                                ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onClick={() => {
                                if (!isApproved) handleStatusChange(row, 'noAnswering');
                              }}
                            >
                              No Answering
                            </li>
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => {
                                navigate(`/ManageLeads/ViewLeadsDetails/${row.id}`);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              View
                            </li>
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => {
                                navigate(`/ManageLeads/EditLeadsDetails/${row.id}`);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => {
                                confirmDeleteLead(row.id);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 flex items-center font-medium ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-[#063E50]'
          } rounded`}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`py-2 px-4 mx-1 rounded-lg ${
              currentPage === i + 1
                ? 'bg-[#063E50] text-white'
                : 'text-[#063E50]'
            }`}
          >
            {i + 1}
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
            width="24"
            height="24"
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

export default ManageLeads;