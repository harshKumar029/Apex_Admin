import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Firestore imports
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AgentsViewDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // Main user document
  const [userData, setUserData] = useState(null);

  // Sub-collections
  const [profileDetails, setProfileDetails] = useState(null);
  const [bankDetails, setBankDetails]       = useState(null);
  const [docImages, setDocImages]           = useState(null); // <-- For Documents sub-doc

  // ---------------------------------
  // Fetch user data & sub-collections
  // ---------------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 1) Fetch main user doc
        const userDocRef = doc(db, 'users', userId);
        const userSnap   = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          setError('User not found!');
          setLoading(false);
          return;
        }
        const mainUserData = userSnap.data();

        // 2) Fetch ProfileDetails sub-doc
        const profileDocRef = doc(
          db,
          'users',
          userId,
          'Details&Documents',
          'ProfileDetails'
        );
        const profileSnap = await getDoc(profileDocRef);
        let profileData   = null;
        if (profileSnap.exists()) {
          profileData = profileSnap.data();
        }

        // 3) Fetch Bankdetails sub-doc
        const bankDocRef = doc(
          db,
          'users',
          userId,
          'Details&Documents',
          'Bankdetails'
        );
        const bankSnap = await getDoc(bankDocRef);
        let bankData   = null;
        if (bankSnap.exists()) {
          bankData = bankSnap.data();
        }

        // 4) Fetch Documents sub-doc
        const documentsDocRef = doc(
          db,
          'users',
          userId,
          'Details&Documents',
          'Documents'
        );
        const documentsSnap = await getDoc(documentsDocRef);
        let documentsData   = null;
        if (documentsSnap.exists()) {
          documentsData = documentsSnap.data();
        }

        // Store them in state
        setUserData(mainUserData);
        setProfileDetails(profileData);
        setBankDetails(bankData);
        setDocImages(documentsData); // <--- store Documents data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError('No userId provided in route params.');
      setLoading(false);
    }
  }, [userId]);

  // ---------------------------------
  // Loading & Error states
  // ---------------------------------
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

  if (error) {
    return (
      <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
        <p className='text-center text-red-500'>{error}</p>
      </div>
    );
  }

  // ---------------------------------
  // Helper & Data Formatting
  // ---------------------------------
  const displayValue = (val) => (val ? val : 'N/A');

  // Convert Firestore timestamp to a readable date if needed
  const joiningDate = userData?.createdAt?.toDate
    ? userData.createdAt.toDate().toLocaleDateString()
    : 'N/A';

  // ---------------------------------
  // Field Arrays for easy mapping
  // ---------------------------------
  const userFields = [
    { label: 'Agent Name',        value: displayValue(userData?.fullname) },
    { label: 'Agent ID',          value: displayValue(userData?.uniqueID) },
    { label: 'Contact Number',    value: displayValue(userData?.mobile) },
    { label: 'Email ID',          value: displayValue(userData?.email) },
    { label: 'Joining Date',      value: joiningDate },
    { label: 'Role',              value: displayValue(userData?.role) },
    { label: 'Earnings (₹)',      value: displayValue(userData?.earnings) },
  ];

  const profileFields = [
    { label: 'Date of Birth',     value: displayValue(profileDetails?.dob) },
    { label: 'Occupation',        value: displayValue(profileDetails?.occupation) },
    { label: 'Address',           value: displayValue(profileDetails?.address) },
    { label: 'City',              value: displayValue(profileDetails?.city) },
    { label: 'Country',           value: displayValue(profileDetails?.country) },
    { label: 'Pin Code',          value: displayValue(profileDetails?.postalCode) },
    { label: 'Work Experience',   value: displayValue(profileDetails?.workExperience) },
  ];

  const bankFields = [
    { label: 'Account Number',    value: displayValue(bankDetails?.accountNumber) },
    { label: 'Bank Name',         value: displayValue(bankDetails?.bankName) },
    { label: 'IFSC Code',         value: displayValue(bankDetails?.ifscCode) },
    { label: 'PAN',               value: displayValue(bankDetails?.pan) },
  ];

  // For Documents sub-doc (aadhaar/pan/etc.)
  // We'll store both the 'Name' and 'URL' so we can show a clickable link
  const documentsFields = [
    {
      label: 'Aadhaar Front',
      nameKey: 'aadhaarFrontName',
      urlKey: 'aadhaarFront',
    },
    {
      label: 'Aadhaar Back',
      nameKey: 'aadhaarBackName',
      urlKey: 'aadhaarBack',
    },
    {
      label: 'Passport Photo',
      nameKey: 'passportPhotoName',
      urlKey: 'passportPhoto',
    },
  ];

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      {/* Header */}
      <div className="flex items-center py-4 w-full">
        <div className='flex gap-3'>
          <div>
            {/* Back to Agents list */}
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
            <h2 className="text-[#343C6A] font-medium text-2xl">View Details</h2>
            <p className="text-[#495057] font-light text-base">
              Please go through the details
            </p>
          </div>
        </div>
      </div>

      {/* Main user fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {userFields.map((field, index) => (
          <div key={index} className="flex gap-4 items-center">
            <h3 className="text-base font-normal text-[#212529] w-40 sm:w-52">
              {field.label}
            </h3>
            <p className="text-base text-[#495057]">{field.value}</p>
          </div>
        ))}
      </div>

      {/* ProfileDetails fields */}
      {profileDetails && (
        <>
          <h3 className="text-xl font-semibold text-[#343C6A] mt-8 mb-3">
            Additional Profile Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileFields.map((field, index) => (
              <div key={index} className="flex gap-4 items-center">
                <h3 className="text-base font-normal text-[#212529] w-40 sm:w-52">
                  {field.label}
                </h3>
                <p className="text-base text-[#495057]">{field.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BankDetails fields */}
      {bankDetails && (
        <>
          <h3 className="text-xl font-semibold text-[#343C6A] mt-8 mb-3">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bankFields.map((field, index) => (
              <div key={index} className="flex gap-4 items-center">
                <h3 className="text-base font-normal text-[#212529] w-40 sm:w-52">
                  {field.label}
                </h3>
                <p className="text-base text-[#495057]">{field.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Documents fields (Aadhaar, Passport, etc.) */}
      {docImages && (
        <>
          <h3 className="text-xl font-semibold text-[#343C6A] mt-8 mb-3">
            Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentsFields.map((field, index) => {
              const docName = docImages[field.nameKey];
              const docUrl  = docImages[field.urlKey];

              return (
                <div key={index} className="flex gap-4 items-center">
                  <h3 className="text-base font-normal text-[#212529] w-40 sm:w-52">
                    {field.label}
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-base text-[#495057]">
                      {docName ? docName : 'N/A'}
                    </span>
                    {docUrl && (
                      <a
                        className="text-blue-600 underline text-sm"
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentsViewDetails;