import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Firestore imports
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

// For CSV generation
const generateCSV = (data) => {
  const headers = [
    'WithdrawRequestID',
    'UserID',
    'UserName',
    'UserEmail',
    'UserMobile',
    'Amount',
    'Status',
    'Date',
  ];

  const rows = data.map((req) => {
    const dateStr = req.date?.toDate
      ? req.date.toDate().toLocaleString()
      : '';
    return [
      req.id,
      req.userId,
      req.userName,
      req.userEmail,
      req.userMobile,
      req.amount,
      req.status,
      dateStr,
    ];
  });

  const csvContent = [
    headers.join(','), // header row
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};

import Searchbar from './Searchbar';

const WithdrawalRequest = () => {
  const navigate = useNavigate();

  // Search, Filter, and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Approved', 'Pending', 'Rejected'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Firestore data
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dropdown
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Success/Fail message
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Approve Modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);

  // Bank details for Approve Modal
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    pan: '',
  });

  // ---------------------------------
  // Fetch withdraw requests + user data
  // ---------------------------------
  useEffect(() => {
    const qy = query(
      collection(db, 'withdrawRequest'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(qy, async (snapshot) => {
      const temp = [];
      for (const docSnap of snapshot.docs) {
        const wrData = docSnap.data();
        const userId = wrData.userId || '';

        let userName = '';
        let userEmail = '';
        let userMobile = '';

        // Fetch user doc for name, email, mobile
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            userName = userData.fullname || 'N/A';
            userEmail = userData.email || 'N/A';
            userMobile = userData.mobile || 'N/A';
          }
        }

        temp.push({
          id: docSnap.id,
          amount: wrData.amount || 0,
          status: wrData.status || 'pending',
          date: wrData.date,
          userId,
          userName,
          userEmail,
          userMobile,
          earningIds: wrData.earningIds || [],
        });
      }
      setWithdrawRequests(temp);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------------------------------
  // Filtering + Searching
  // ---------------------------------
  const getFilteredData = () => {
    if (activeFilter === 'All') return withdrawRequests;
    // Compare DB "approved" / "pending" / "rejected"
    return withdrawRequests.filter(
      (req) => req.status === activeFilter.toLowerCase()
    );
  };

  const filterBySearch = (data) => {
    if (!searchQuery.trim()) return data;
    const qLower = searchQuery.toLowerCase();
    return data.filter((req) => {
      const name = (req.userName || '').toLowerCase();
      const email = (req.userEmail || '').toLowerCase();
      const mobile = (req.userMobile || '').toLowerCase();
      const status = (req.status || '').toLowerCase();
      return (
        name.includes(qLower) ||
        email.includes(qLower) ||
        mobile.includes(qLower) ||
        status.includes(qLower)
      );
    });
  };

  const filtered = filterBySearch(getFilteredData());

  // ---------------------------------
  // Pagination
  // ---------------------------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // ---------------------------------
  // Dropdown
  // ---------------------------------
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // ---------------------------------
  // DELETE logic
  // ---------------------------------
  const handleDeleteConfirm = (reqId) => {
    setRequestToDelete(reqId);
    setShowDeleteModal(true);
    setOpenDropdownIndex(null);
  };
  const handleDelete = async () => {
    if (!requestToDelete) return;
    try {
      await deleteDoc(doc(db, 'withdrawRequest', requestToDelete));
      setMessage('Withdraw request deleted successfully!');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete withdraw request.');
      setMessageType('error');
    } finally {
      setShowDeleteModal(false);
      setRequestToDelete(null);
    }
  };

  // ---------------------------------
  // APPROVE logic
  // ---------------------------------
  const handleShowApproveModal = async (row) => {
    try {
      setRequestToApprove(row);

      // fetch user bank details
      const bankDocRef = doc(db, 'users', row.userId, 'Details&Documents', 'Bankdetails');
      const bankDocSnap = await getDoc(bankDocRef);
      let fetchedBank = { accountNumber: '', bankName: '', ifscCode: '', pan: '' };
      if (bankDocSnap.exists()) {
        fetchedBank = bankDocSnap.data();
      }
      setBankDetails({
        accountNumber: fetchedBank.accountNumber || '',
        bankName: fetchedBank.bankName || '',
        ifscCode: fetchedBank.ifscCode || '',
        pan: fetchedBank.pan || '',
      });

      setShowApproveModal(true);
      setOpenDropdownIndex(null);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch bank details.');
      setMessageType('error');
    }
  };

  const handleApproveConfirm = async () => {
    if (!requestToApprove) return;

    const { id, userId, earningIds, amount } = requestToApprove;
    try {
      // 1) update the doc => status = 'approved'
      await updateDoc(doc(db, 'withdrawRequest', id), {
        status: 'approved',
      });

      // 2) set each earning doc in user's earningsHistory => status='paid', paidAt=now
      const userEarningsRef = collection(db, 'users', userId, 'earningsHistory');
      const nowTs = Timestamp.now();
      const eSnap = await getDocs(userEarningsRef);
      eSnap.forEach(async (docSnap) => {
        if (earningIds.includes(docSnap.id)) {
          await updateDoc(docSnap.ref, {
            status: 'paid',
            paidAt: nowTs,
          });
        }
      });

      // 3) add doc to paidHistory
      const userPaidRef = collection(db, 'users', userId, 'paidHistory');
      await addDoc(userPaidRef, {
        amount: amount,
        date: nowTs,
      });

      // 4) increment the user’s "earnings" field in the main user doc
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const oldEarnings = userDocSnap.data().earnings || 0;
        const newEarnings = oldEarnings + amount;
        await updateDoc(userDocRef, { earnings: newEarnings });
      }

      setMessage('Withdrawal Approved Successfully!');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to approve withdrawal request.');
      setMessageType('error');
    } finally {
      setShowApproveModal(false);
      setRequestToApprove(null);
    }
  };

  // ---------------------------------
  // REJECT logic
  // ---------------------------------
  const handleReject = async (row) => {
    try {
      await updateDoc(doc(db, 'withdrawRequest', row.id), {
        status: 'rejected',
      });
      setMessage('Withdrawal Rejected.');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to reject withdrawal request.');
      setMessageType('error');
    } finally {
      setOpenDropdownIndex(null);
    }
  };

  // ---------------------------------
  // Download CSV
  // ---------------------------------
  const handleDownloadCSV = async () => {
    try {
      const csvContent = generateCSV(withdrawRequests);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `withdraw_requests_${Date.now()}.csv`;

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
      setMessage('Failed to generate CSV file.');
      setMessageType('error');
    }
  };

  // ---------------------------------
  // Loading
  // ---------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          src="/loading.gif" // Replace with your path to the loading GIF
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    );
  }

  // ---------------------------------
  // RENDER
  // ---------------------------------
  return (
    <div className="w-[95%] m-auto my-5">

      {/* Success / Error message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Mobile-only Searchbar */}
      <div className="sm:hidden block w-full py-4 m-auto z-0">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">
        All Withdrawal Requests
      </h1>

      {/* Filter Buttons & Download */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="w-full sm:w-auto">
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['All', 'Approved', 'Pending', 'Rejected'].map((filter) => (
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

        <button
          onClick={handleDownloadCSV}
          className="py-2 px-3 mt-5 sm:mt-auto sm:border border-[#063E50] flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full"
        >
          <svg
            className="w-6 h-6 text-[#063E50]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
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

      {/* MOBILE Layout */}
      <div className="overflow-x-auto sm:hidden">
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row, idx) => {
            const siNo = (currentPage - 1) * itemsPerPage + (idx + 1);
            const isFinalStatus = row.status === 'approved' || row.status === 'rejected';

            return (
              <div key={row.id} className="bg-white shadow-md rounded-lg">
                <div className="p-4">
                  <div className="flex justify-between">
                    <section className="flex gap-3">
                      <section>
                        <p className="h-12 w-12 rounded-full font-normal text-white text-sm bg-[#063E50] flex items-center justify-center">
                          {row.userName
                            ? row.userName.substring(0, 2).toUpperCase()
                            : 'NA'}
                        </p>
                      </section>
                      <section className="space-y-1">
                        <p className="text-[#8B7010] font-medium text-sm">
                          SI NO: {siNo}
                        </p>
                        <p className="font-medium text-xl text-[#063E50]">
                          {row.userName}
                        </p>
                        <p className="text-[#212529]">+91 {row.userMobile}</p>
                        <p className="text-[#212529]">{row.userEmail}</p>
                        <p className="text-[#8B7010]">
                          Amount: ₹{row.amount}
                        </p>
                      </section>
                    </section>
                  </div>
                  <div className="flex justify-between my-4">
                    <p className="inline-flex items-center gap-3">
                      <span className="text-xl text-[#495057] font-normal">Status</span>
                      <button
                        className={`px-4 py-1 rounded-full
                          ${
                            row.status === 'pending'
                              ? 'bg-[#D3B6262E] text-[#D3B626]'
                              : row.status === 'approved'
                              ? 'bg-[#28A7452E] text-[#28A745]'
                              : row.status === 'rejected'
                              ? 'bg-[#DC35452E] text-[#DC3545]'
                              : ''
                          }
                        `}
                      >
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </button>
                    </p>
                    <p className="inline-flex items-center gap-3">
                      <span className="text-xl text-[#495057] font-normal">
                        Action
                      </span>
                      <div className="relative">
                        <button
                          className={`px-3 py-[2px] rounded-full ${
                            isFinalStatus
                              ? 'bg-[#ADB5BD] text-[#718EBF] cursor-not-allowed'
                              : 'bg-[#063E50] text-[#FFFFFF]'
                          }`}
                          onClick={() => {
                            if (!isFinalStatus) toggleDropdown(idx);
                          }}
                          disabled={isFinalStatus}
                        >
                          Choose
                        </button>
                        {openDropdownIndex === idx && !isFinalStatus && (
                          <div
                            className="absolute right-0 mt-2 w-36 bg-[#ffffffec] shadow-lg rounded-md z-10"
                          >
                            <ul className="py-1">
                              <li
                                className="px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer"
                                onClick={() => handleShowApproveModal(row)}
                              >
                                Approve
                              </li>
                              <li
                                className="px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer"
                                onClick={() => handleReject(row)}
                              >
                                Reject
                              </li>
                              <li
                                className="px-4 py-2 m-1 inline-flex gap-3 items-center cursor-pointer"
                                onClick={() => handleDeleteConfirm(row.id)}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP layout */}
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
                Amount Requested
              </th>
              <th style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                Status
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-left text-base text-[#212529] font-normal">
            {currentItems.map((row, idx) => {
              const siNo = (currentPage - 1) * itemsPerPage + (idx + 1);
              const isFinalStatus =
                row.status === 'approved' || row.status === 'rejected';

              return (
                <tr key={row.id}>
                  <td className="px-4 py-2">{siNo}</td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.userName}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.userMobile}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    {row.userEmail}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    ₹{row.amount}
                  </td>
                  <td style={{ textAlign: '-webkit-center' }} className="px-4 py-2">
                    <button
                      className={`px-4 py-1 rounded-full
                        ${
                          row.status === 'pending'
                            ? 'bg-[#D3B6262E] text-[#D3B626]'
                            : row.status === 'approved'
                            ? 'bg-[#28A7452E] text-[#28A745]'
                            : row.status === 'rejected'
                            ? 'bg-[#DC35452E] text-[#DC3545]'
                            : ''
                        }
                      `}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-4 py-3 inline-flex relative items-center gap-2">
                    <div className="relative">
                      <button
                        className={`px-4 py-1 rounded-full ${
                          isFinalStatus
                            ? 'bg-[#ADB5BD] text-[#718EBF] cursor-not-allowed'
                            : 'bg-[#063E50] text-white'
                        }`}
                        onClick={() => {
                          if (!isFinalStatus) toggleDropdown(idx);
                        }}
                        disabled={isFinalStatus}
                      >
                        Choose
                      </button>

                      {/* if final (approved/rejected), no dropdown */}
                      {openDropdownIndex === idx && !isFinalStatus && (
                        <div className="absolute left-0 mt-7 w-28 bg-[#FFFFFF] shadow-lg rounded-md z-10">
                          <ul className="py-1">
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => handleShowApproveModal(row)}
                            >
                              Approve
                            </li>
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => handleReject(row)}
                            >
                              Reject
                            </li>
                            <li
                              className="px-4 py-2 m-1 items-center cursor-pointer"
                              onClick={() => handleDeleteConfirm(row.id)}
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

      {/* Pagination */}
      <div className="flex justify-end mt-8 items-center">
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
            className="w-5 h-5 mr-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
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
            className="w-5 h-5 ml-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete this withdraw request?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE MODAL */}
      {showApproveModal && requestToApprove && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-2">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-[#063E50]">
              Approve Withdraw Request
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              You're about to approve withdrawal for:
            </p>
            <div className="bg-gray-100 p-3 rounded mb-4">
              <p>
                <strong>Name:</strong> {requestToApprove.userName}
              </p>
              <p>
                <strong>Mobile:</strong> +91 {requestToApprove.userMobile}
              </p>
              <p>
                <strong>Email:</strong> {requestToApprove.userEmail}
              </p>
              <p>
                <strong>Amount:</strong> ₹{requestToApprove.amount}
              </p>
              <hr className="my-2" />
              <p>
                <strong>Account Number:</strong> {bankDetails.accountNumber}
              </p>
              <p>
                <strong>Bank Name:</strong> {bankDetails.bankName}
              </p>
              <p>
                <strong>IFSC Code:</strong> {bankDetails.ifscCode}
              </p>
              <p>
                <strong>PAN:</strong> {bankDetails.pan}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowApproveModal(false);
                  setRequestToApprove(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#063E50] text-white rounded"
                onClick={handleApproveConfirm}
              >
                Final Approve
              </button>
            </div>
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowApproveModal(false);
                setRequestToApprove(null);
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
    </div>
  );
};

export default WithdrawalRequest;