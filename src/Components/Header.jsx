// src/Components/Header.jsx

import React, { useRef, useEffect, useState } from 'react';
import placeholderImage from "../assets/icon/profile-img.svg";
import HeaderSearchbar from './HeaderSearchbar';
import { useSidebar } from '../ContextApi';
import { Link, useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Header = ({ title, showSearch = true, children }) => {
  const { isOpenProfile, setIsOpenProfile, setIsOpen } = useSidebar();
  const profileRef = useRef(null);

  // Retry logic state
  const [retryCount, setRetryCount] = useState(0);

  // Fetch user data with retryCount
  const { userData, loading, error } = useUserData(retryCount);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const navigate = useNavigate();

  // Retry logic: Retry fetching data after 3 seconds if there's an error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleDropdown = () => {
    // Prevent opening the dropdown if userData is not loaded
    if (loading || error || !userData) {
      return;
    }
    setIsOpenProfile(!isOpenProfile);
  };

  const handleCopyUID = () => {
    if (!userData || !userData.uniqueID) return;
    const uidText = userData.uniqueID;
    navigator.clipboard.writeText(uidText)
      .then(() => {
        alert('UID copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy UID:', err);
      });
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsOpenProfile(false);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const queryText = e.target.value;
    setSearchQuery(queryText);
    if (queryText.trim() !== '') {
      fetchLeads(queryText);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const fetchLeads = async (queryText) => {
    setIsLoadingSearch(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle unauthenticated user
        setIsLoadingSearch(false);
        return;
      }

      const leadsRef = collection(db, 'leads');
      // Get all leads of the user
      const leadsQuery = query(leadsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(leadsQuery);
      const leadsData = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Filter leads based on search query
      const lowercasedQuery = queryText.toLowerCase();
      const filteredLeads = leadsData.filter((lead) => {
        const customerName =
          lead.customerDetails?.fullname?.toLowerCase() || '';
        const serviceName =
          serviceNames[lead.serviceId]?.toLowerCase() ||
          lead.serviceId.toLowerCase();
        const bankName =
          bankNames[lead.bankId]?.toLowerCase() || lead.bankId.toLowerCase();
        const status = lead.status?.toLowerCase() || '';
        return (
          customerName.includes(lowercasedQuery) ||
          serviceName.includes(lowercasedQuery) ||
          bankName.includes(lowercasedQuery) ||
          status.includes(lowercasedQuery)
        );
      });

      setSearchResults(filteredLeads);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Mapping for service IDs to service names
  const serviceNames = {
    creditCard: 'Credit Card',
    personalLoan: 'Personal Loan',
    homeLoan: 'Home Loan',
    carLoan: 'Car Loan',
    magnetCard: 'Magnet Card',
    insurance: 'Insurance',
    loanAgainstProperty: 'Loan Against Property',
    businessLoan: 'Business Loan',
    bankAccount: 'Bank Account',
  };

  // Mapping for bank IDs to bank names
  const bankNames = {
    hdfcBank: 'HDFC Bank',
    idfcFirstBank: 'IDFC First Bank',
    yesBank: 'Yes Bank',
    indusBank: 'IndusInd Bank',
    sbiBank: 'State Bank Of India',
    standardChartered: 'Standard Chartered',
    auBank: 'AU Bank',
    americanExpress: 'American Express',
    iciciBank: 'ICICI Bank',
    hsbcBank: 'HSBC Bank',
    axisBank: 'AXIS Bank',
    kotakMahindraBank: 'Kotak Mahindra Bank',
    bobBank: 'BOB Bank',
    rblBank: 'RBL Bank',
  };

  const handleSuggestionClick = (leadId) => {
    // Navigate to lead details page
    navigate(`/ManageLeads/ViewLeadsDetails/${leadId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={profileRef}>
      <div className="flex items-center justify-between p-4 sm:px-8 bg-white border-b border-[#DEE2E6]">
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden"
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsOpenProfile(false);
          }}
        >
          <svg
            className='w-10'
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl text-[#343C6A] font-semibold">
          {title}
        </h1>

        {/* Right Section (Search, Earning Icon, Profile) */}
        <div className="flex items-center sm:space-x-10">
          {/* Search Input */}
          <div className='hidden sm:block relative'>
            {showSearch && (
              <>
                <HeaderSearchbar
                  searchQuery={searchQuery}
                  onChange={handleSearchChange}
                />
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleSuggestionClick(lead.id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {lead.customerDetails?.fullname || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Service: {serviceNames[lead.serviceId] || lead.serviceId}
                        </div>
                        <div className="text-xs text-gray-500">
                          Bank: {bankNames[lead.bankId] || lead.bankId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showSuggestions && searchResults.length === 0 && !isLoadingSearch && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No results found.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Earning Icon */}
          <Link to='/Setting'>
            <svg className="w-12 hidden sm:block cursor-pointer "  viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="25" fill="#F8FAFA" />
              <g clipPath="url(#clip0_54_1202)">
                <path d="M25.2845 37H23.7155C22.4465 37 21.414 35.9676 21.414 34.6986V34.1678C20.8745 33.9954 20.3503 33.7778 19.8468 33.5172L19.4706 33.8934C18.5595 34.8056 17.1001 34.7789 16.2155 33.8931L15.1065 32.7842C14.2204 31.899 14.1949 30.44 15.1068 29.5291L15.4827 29.1532C15.2221 28.6496 15.0046 28.1255 14.8322 27.5859H14.3014C13.0325 27.5859 12 26.5535 12 25.2845V23.7155C12 22.4465 13.0325 21.4141 14.3015 21.4141H14.8322C15.0046 20.8745 15.2222 20.3504 15.4828 19.8468L15.1066 19.4707C14.1952 18.5603 14.2203 17.1012 15.1069 16.2156L16.2159 15.1066C17.1026 14.2187 18.5617 14.1965 19.471 15.1069L19.8468 15.4827C20.3504 15.2222 20.8746 15.0046 21.4141 14.8322V14.3014C21.4141 13.0324 22.4465 12 23.7155 12H25.2845C26.5535 12 27.5859 13.0324 27.5859 14.3014V14.8322C28.1254 15.0046 28.6496 15.2222 29.1532 15.4828L29.5293 15.1066C30.4404 14.1944 31.8999 14.2211 32.7845 15.1069L33.8934 16.2158C34.7796 17.101 34.8051 18.56 33.8931 19.4709L33.5172 19.8468C33.7778 20.3504 33.9954 20.8745 34.1678 21.4141H34.6985C35.9675 21.4141 37 22.4465 37 23.7155V25.2845C37 26.5535 35.9675 27.5859 34.6985 27.5859H34.1678C33.9954 28.1255 33.7778 28.6496 33.5172 29.1532L33.8934 29.5293C34.8048 30.4398 34.7797 31.8989 33.8931 32.7845L32.7841 33.8935C31.8974 34.7813 30.4383 34.8035 29.529 33.8932L29.1532 33.5173C28.6496 33.7779 28.1254 33.9955 27.5859 34.1679V34.6987C27.5859 35.9676 26.5535 37 25.2845 37ZM20.0917 31.979C20.7912 32.3927 21.5441 32.7053 22.3295 32.908C22.6529 32.9914 22.8789 33.2831 22.8789 33.6171V34.6986C22.8789 35.1599 23.2542 35.5352 23.7155 35.5352H25.2845C25.7458 35.5352 26.1211 35.1599 26.1211 34.6986V33.6171C26.1211 33.2831 26.3471 32.9914 26.6706 32.908C27.4559 32.7053 28.2088 32.3927 28.9084 31.979C29.1962 31.8088 29.5627 31.8551 29.7992 32.0916L30.5652 32.8576C30.8955 33.1883 31.4258 33.1806 31.748 32.858L32.8577 31.7483C33.1791 31.4273 33.1898 30.8968 32.858 30.5654L32.0917 29.7991C31.8552 29.5626 31.8089 29.1961 31.9791 28.9083C32.3928 28.2088 32.7053 27.4559 32.908 26.6705C32.9915 26.3471 33.2832 26.1211 33.6172 26.1211H34.6986C35.1599 26.1211 35.5352 25.7458 35.5352 25.2846V23.7155C35.5352 23.2542 35.1599 22.879 34.6986 22.879H33.6172C33.2832 22.879 32.9915 22.653 32.908 22.3296C32.7053 21.5442 32.3928 20.7913 31.9791 20.0917C31.8089 19.804 31.8552 19.4375 32.0917 19.201L32.8577 18.435C33.1889 18.1042 33.1802 17.5739 32.858 17.2521L31.7484 16.1425C31.4268 15.8204 30.8963 15.811 30.5655 16.1422L29.7992 16.9085C29.5628 17.145 29.1962 17.1913 28.9084 17.0211C28.2089 16.6074 27.456 16.2948 26.6706 16.0921C26.3472 16.0087 26.1212 15.717 26.1212 15.383V14.3014C26.1212 13.8401 25.7458 13.4648 25.2846 13.4648H23.7156C23.2543 13.4648 22.879 13.8401 22.879 14.3014V15.3829C22.879 15.7169 22.653 16.0086 22.3295 16.092C21.5442 16.2947 20.7913 16.6073 20.0917 17.021C19.8038 17.1912 19.4374 17.1449 19.2009 16.9084L18.4349 16.1424C18.1046 15.8117 17.5742 15.8194 17.2521 16.142L16.1424 17.2517C15.821 17.5727 15.8103 18.1031 16.1421 18.4346L16.9084 19.2009C17.1449 19.4374 17.1912 19.8039 17.021 20.0917C16.6073 20.7912 16.2948 21.5441 16.0921 22.3295C16.0086 22.6529 15.7169 22.8789 15.3829 22.8789H14.3015C13.8402 22.8789 13.4648 23.2542 13.4648 23.7155V25.2845C13.4648 25.7458 13.8402 26.1211 14.3015 26.1211H15.3829C15.7169 26.1211 16.0085 26.3471 16.092 26.6705C16.2947 27.4559 16.6073 28.2088 17.0209 28.9083C17.1911 29.1961 17.1448 29.5626 16.9084 29.799L16.1423 30.5651C15.8112 30.8959 15.8198 31.4261 16.142 31.7479L17.2517 32.8576C17.5733 33.1796 18.1038 33.1891 18.4345 32.8579L19.2008 32.0915C19.375 31.9173 19.7375 31.7695 20.0917 31.979Z" fill="#063E50" />
                <path d="M24.5 29.9395C21.5006 29.9395 19.0605 27.4993 19.0605 24.5C19.0605 21.5007 21.5006 19.0605 24.5 19.0605C27.4994 19.0605 29.9395 21.5007 29.9395 24.5C29.9395 27.4993 27.4994 29.9395 24.5 29.9395ZM24.5 20.5254C22.3083 20.5254 20.5254 22.3084 20.5254 24.5C20.5254 26.6916 22.3084 28.4746 24.5 28.4746C26.6916 28.4746 28.4746 26.6916 28.4746 24.5C28.4746 22.3084 26.6917 20.5254 24.5 20.5254Z" fill="#063E50" />
              </g>
              <defs>
                <clipPath id="clip0_54_1202">
                  <rect width="25" height="25" fill="white" transform="translate(12 12)" />
                </clipPath>
              </defs>
            </svg>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <img
              src={userData?.profilePhotoURL || placeholderImage}
              alt="Profile"
              onClick={toggleDropdown}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
            {isOpenProfile && userData && !loading && !error && (
              <div className="absolute right-0 z-50 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul>
                  {/* Fullname and UID */}
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-start">
                    <svg
                      className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold">{userData?.fullname || ''}</span>
                      <p className="text-xs text-gray-600 flex items-center">
                        UID:
                        <span className="uid-text text-[#063E50] underline mx-1">
                          {userData?.uniqueID || ''}
                        </span>
                        {/* Copy button */}
                        <button
                          type="button"
                          className="text-sm text-blue-500 underline hover:text-gray-500 focus:outline-none"
                          onClick={handleCopyUID}
                        >
                          Copy
                        </button>
                      </p>
                    </div>
                  </li>

                  {/* Mobile Number */}
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                    {/* Phone Icon */}
                    <svg
                      className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{userData?.mobile || ''}</span>
                  </li>

                  {/* Go to Apex Dashboard */}
                  <Link
                    to='/'
                    onClick={() => setIsOpenProfile(false)}
                  >
                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                      {/* Dashboard Icon */}
                      <svg
                        className='w-5 h-5 text-gray-600 mr-3 flex-shrink-0'
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.41345 10.7445C2.81811 10.513 2.52043 10.3972 2.43353 10.2304C2.35819 10.0858 2.35809 9.91354 2.43326 9.76886C2.51997 9.60195 2.8175 9.48584 3.41258 9.25361L20.3003 2.66327C20.8375 2.45364 21.1061 2.34883 21.2777 2.40616C21.4268 2.45596 21.5437 2.57292 21.5935 2.72197C21.6509 2.8936 21.5461 3.16219 21.3364 3.69937L14.7461 20.5871C14.5139 21.1822 14.3977 21.4797 14.2308 21.5664C14.0862 21.6416 13.9139 21.6415 13.7693 21.5662C13.6025 21.4793 13.4867 21.1816 13.2552 20.5862L10.6271 13.8282C10.5801 13.7074 10.5566 13.647 10.5203 13.5961C10.4881 13.551 10.4487 13.5115 10.4036 13.4794C10.3527 13.4431 10.2923 13.4196 10.1715 13.3726L3.41345 10.7445Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Go to Apex Dashboard
                    </li>
                  </Link>

                  {/* Logged In As (No Icon) */}
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer bg-[#eaeaea]">
                    <div className="flex items-start overflow-hidden">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          Logged In as{' '}
                          <span
                            className="text-[#063E50] underline block truncate"
                            title={userData?.email || ''}
                          >
                            {userData?.email || ''}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
};

export default Header;