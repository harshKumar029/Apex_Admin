import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ViewDetails = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [leadData, setLeadData] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        if (!leadId) {
          setError('Invalid lead ID');
          setLoading(false);
          return;
        }

        const leadDocRef = doc(db, 'leads', leadId);
        const leadDoc = await getDoc(leadDocRef);

        if (leadDoc.exists()) {
          const data = leadDoc.data();
          setLeadData(data);

          if (data.userId) {
            const userDocRef = doc(db, 'users', data.userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setAgentData(userDoc.data());
            }
          }

        } else {
          setError('Lead not found');
        }
      } catch (err) {
        console.error('Error fetching lead details:', err);
        setError(`Failed to load lead details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-red-500'>No lead data available.</p>
      </div>
    );
  }

  const lead = leadData;
  const customer = lead.customerDetails || {};

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    } else if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    } else {
      return dateValue;
    }
  };

  const getValueOrNA = (val) => (val ? val : 'N/A');

  let inputFields = [
    { label: 'Lead ID', value: getValueOrNA(lead.id) },
    { label: 'Customer Name', value: getValueOrNA(customer.fullname) },
    {
      label: 'Bank Chosen',
      value: getValueOrNA(bankNames[lead.bankId] || lead.bankId),
    },
    {
      label: 'Service Chosen',
      value: getValueOrNA(serviceNames[lead.serviceId] || lead.serviceId),
    },
    {
      label: 'Submission Date',
      value: getValueOrNA(formatDate(lead.submissionDate)),
    },
    { label: 'Status', value: getValueOrNA(lead.status) },
    { label: 'Mobile Number', value: getValueOrNA(customer.mobile) },
    { label: 'Email ID', value: getValueOrNA(customer.email) },
    { label: 'Father Name', value: getValueOrNA(customer.fatherName) },
    { label: 'Mother Name', value: getValueOrNA(customer.motherName) },
    { label: 'PAN Card Number', value: getValueOrNA(customer.panCardNumber) },
    {
      label: 'Date of Birth',
      value: getValueOrNA(formatDate(customer.dob)),
    },
    {
      label: 'Aadhaar Card Number',
      value: getValueOrNA(customer.aadhaarNumber),
    },
    { label: 'Address', value: getValueOrNA(customer.address) },
    {
      label: 'RESIDENCE LANDMARK',
      value: getValueOrNA(customer.residenceLandmark),
    },
    { label: 'Pin Code', value: getValueOrNA(customer.postalCode) },
    {
      label: 'SALARIED/SELF EMPLOYED',
      value: getValueOrNA(customer.employmentType),
    },
    { label: 'Company Name', value: getValueOrNA(customer.companyName) },
    { label: 'Designation', value: getValueOrNA(customer.designation) },
    {
      label: 'Company Address',
      value: getValueOrNA(customer.companyAddress),
    },
    {
      label: 'COMPANY LANDMARK',
      value: getValueOrNA(customer.companyLandmark),
    },
    {
      label: 'COMPANY PINCODE',
      value: getValueOrNA(customer.companyPincode),
    },
    {
      label: 'Official Email ID',
      value: getValueOrNA(customer.officialEmail),
    },
    { label: 'NET SALARY', value: getValueOrNA(customer.netSalary) },
  ];

  if (lead.earningAmount !== undefined && lead.earningAmount !== null) {
    inputFields.push({ label: 'Earning Amount', value: getValueOrNA(lead.earningAmount) });
  }

  if (agentData) {
    inputFields.push({ label: 'Agent Name', value: getValueOrNA(agentData.fullname) });
    inputFields.push({ label: 'Agent Unique ID', value: getValueOrNA(agentData.uniqueID) });
  }

  // Filter out fields with 'N/A' if desired:
  inputFields = inputFields.filter(field => field.value !== 'N/A');

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      {/* Top Bar with Back Button, Title, and Agent Info on Right */}
      <div className='flex items-center justify-between py-4 w-full'>
        {/* Left side: Back button and title */}
        <div className='flex gap-3 items-center'>
          <svg
            onClick={() => navigate(-1)}
            width='28'
            height='28'
            viewBox='0 0 28 28'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='cursor-pointer'
          >
            <path
              d='M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z'
              fill='#495057'
            />
          </svg>
          <div>
            <h2 className='text-[#343C6A] font-medium text-2xl'>View Details</h2>
            <p className='text-[#495057] font-light text-base'>
              Please go through the details
            </p>
          </div>
        </div>

        {/* Right side: Agent Info if available */}
        {agentData && (
          <div className='bg-[#F0F4F8] rounded-md p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-[#063E50]'>Agent: {agentData.fullname}</h3>
              <p className='text-sm text-[#495057]'>ID: {agentData.uniqueID}</p>
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6'>
        {inputFields.map((field, index) => {
          let fieldValue = field.value;
          if (field.label === 'Email ID' && typeof fieldValue === 'string' && fieldValue.length > 20) {
            fieldValue = (
              <>
                {fieldValue.slice(0, 20)}
                <br />
                {fieldValue.slice(20)}
              </>
            );
          }

          return (
            <div key={index} className='gap-3 flex items-center'>
              <h3 className='text-base font-normal text-[#212529] w-1/2'>
                {field.label}
              </h3>
              <p
                className={`text-base rounded-full w-1/2 ${
                  field.label === 'Status' && typeof fieldValue === 'string'
                    ? fieldValue.toLowerCase() === 'pending'
                      ? 'bg-[#D3B6262E] text-[#D3B626] px-4'
                      : fieldValue.toLowerCase() === 'approved'
                      ? 'bg-[#28A7452E] text-[#28A745] px-4'
                      : fieldValue.toLowerCase() === 'rejected'
                      ? 'bg-[#DC35452E] text-[#DC3545] px-4'
                      : fieldValue.toLowerCase() === 'expired'
                      ? 'bg-[#FBB34933] text-[#FBB349] px-4'
                      : 'text-[#718EBF]'
                    : 'text-[#718EBF]'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {fieldValue}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewDetails;