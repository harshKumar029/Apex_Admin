import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Firestore imports
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AgentWithdrawHistory = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Store user data (fullname, mobile, etc.)
  const [userData, setUserData] = useState(null);

  // Store payment history from `paidHistory` subcollection
  const [paymentHistory, setPaymentHistory] = useState([]);

  // ---------------------------------
  // Fetch user doc & paidHistory subcollection
  // ---------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Fetch main user document
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error('User not found');
        }
        const mainUser = userSnap.data();

        // 2) Fetch paidHistory subcollection
        const paidHistoryRef = collection(db, 'users', userId, 'paidHistory');
        const paidSnap = await getDocs(paidHistoryRef);
        const history = paidSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            amount: data.amount,
            // If your `date` is a Firestore timestamp, convert it:
            date: data.date?.toDate ? data.date.toDate() : data.date,
          };
        });

        setUserData(mainUser);
        setPaymentHistory(history);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load user/payment data.');
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // ---------------------------------
  // Loading & Error
  // ---------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          src="/loading.gif"  // <-- Adjust path to your spinner/gif
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[95%] m-auto my-5">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  // Format date if needed. Example: toLocaleDateString()
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    // If it's a JS date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }
    // Otherwise, if it was stored as a string:
    return dateValue;
  };

  return (
    <div className="w-[95%] m-auto my-5">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between py-4 w-full">
          <div className="flex gap-3">
            <div>
              <svg
                onClick={() => navigate('/ManageAgents')}
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <path
                  d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z"
                  fill="#495057"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-[#343C6A] font-medium text-2xl">Money Withdraw History</h2>
              <p className="text-[#495057] font-light text-base">
                Please go through the details
              </p>
            </div>
          </div>
        </div>

        {/* Basic user info: Name, Mobile */}
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="inline-flex gap-4">
            <h3 className="text-base font-normal text-[#212529]">Agent Name</h3>
            <p className="text-[#718EBF] text-base">
              {userData?.fullname || 'N/A'}
            </p>
          </div>
          <div className="inline-flex gap-4">
            <h3 className="text-base font-normal text-[#212529]">Contact Number</h3>
            <p className="text-[#718EBF] text-base">
              {userData?.mobile || 'N/A'}
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="p-4 border mt-7 border-[#DEE2E6] rounded-2xl">
          <h2 className="font-medium text-xl text-[#343C6A]">Withdrawal History</h2>
          {paymentHistory.length === 0 ? (
            <p className="text-gray-500 mt-3">No withdrawal records found.</p>
          ) : (
            paymentHistory.map((field) => (
              <div key={field.id} className="flex py-2 justify-between">
                <div className="flex items-center gap-3">
                  <p className="h-11 w-11 rounded-full text-white font-medium text-sm bg-[#063E50] flex items-center justify-center">
                    {/* Example: Show first 3 letters of the month 
                        If you want a simpler approach, just show "DAY" or something. */}
                    {field.date instanceof Date
                      ? field.date.toLocaleString('default', { month: 'short' }).toUpperCase()
                      : '---'}
                  </p>
                  <h3 className="font-medium text-xl text-[#343C6A]">
                    {formatDate(field.date)}
                  </h3>
                </div>
                <p className="text-[#5DD326] font-medium text-xl">
                  ₹ {field.amount}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentWithdrawHistory;