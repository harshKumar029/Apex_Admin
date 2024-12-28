import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path to your firebase config

const AgentsEditDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Page-level states
  const [loading, setLoading] = useState(true);    // Page loading (data fetching)
  const [saving, setSaving]   = useState(false);   // Saving state (on Save button)
  const [successMsg, setSuccessMsg] = useState(''); // Success message after save
  const topRef = useRef(null); // For scrolling to top on save

  // Firestore data states
  // Main user fields
  const [fullname, setFullname]     = useState('');
  const [email, setEmail]           = useState('');
  const [mobile, setMobile]         = useState('');
  const [role, setRole]             = useState('');

  // Bankdetails sub-doc
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName]           = useState('');
  const [ifscCode, setIfscCode]           = useState('');
  const [pan, setPan]                     = useState('');

  // --------------------------
  // Fetch user & bank details
  // --------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Fetch main user doc
        const userDocRef = doc(db, 'users', userId);
        const userSnap    = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          throw new Error('User not found');
        }

        const userData = userSnap.data() || {};

        // Populate main user fields
        setFullname(userData.fullname || '');
        setEmail(userData.email || '');
        setMobile(userData.mobile || '');
        setRole(userData.role || '');

        // 2) Fetch bank details sub-doc
        const bankDocRef = doc(db, 'users', userId, 'Details&Documents', 'Bankdetails');
        const bankSnap   = await getDoc(bankDocRef);

        if (bankSnap.exists()) {
          const bankData = bankSnap.data();
          setAccountNumber(bankData.accountNumber || '');
          setBankName(bankData.bankName || '');
          setIfscCode(bankData.ifscCode || '');
          setPan(bankData.pan || '');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // --------------------------------
  // Save / Update Firestore Documents
  // --------------------------------
  const handleSave = async () => {
    try {
      // Indicate saving
      setSaving(true);
      setSuccessMsg('');

      // 1) Update the main user doc
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        fullname,
        email,
        mobile,
        role,
      });

      // 2) Update the Bankdetails sub-doc
      const bankDocRef = doc(db, 'users', userId, 'Details&Documents', 'Bankdetails');
      await updateDoc(bankDocRef, {
        accountNumber,
        bankName,
        ifscCode,
        pan,
      });

      // Done saving
      setSaving(false);

      // Scroll to top
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      // Show success message
      setSuccessMsg('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving user details:', error);
      setSaving(false);
      // Optionally show an error message
      setSuccessMsg('Failed to save. Please try again.');
    }
  };

  // If page is loading data, show the loading GIF
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          src="/loading.gif" // Adjust path to your loading GIF
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="w-[95%] m-auto mt-5 mb-28 sm:my-5">

      {/* Back + Header */}
      <div className="flex sm:items-center flex-col sm:flex-row justify-between py-4 w-full">
        <div className="flex gap-3">
          {/* Back Button */}
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
            <h2 className="text-[#343C6A] font-medium text-2xl">Edit Details</h2>
            <p className="text-[#495057] font-light text-base">
              Please go through the details
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMsg}</p>
        </div>
      )}

      {/* User Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Bank: Account Number */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Bank: Bank Name */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Bank: IFSC Code */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

        {/* Bank: PAN */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            PAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
          />
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-end mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full flex items-center justify-center ${
            saving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {saving ? (
            // Saving animation (spinner or text)
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Saving...
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentsEditDetails;