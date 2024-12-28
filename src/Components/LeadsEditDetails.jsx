import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

const EditDetails = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();

  // Local state for lead data
  const [leadData, setLeadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For showing success message
  const [showSuccess, setShowSuccess] = useState(false);

  // For "Saving..." animation
  const [isSaving, setIsSaving] = useState(false);

  // Lead fields
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [bankId, setBankId] = useState('');
  const [status, setStatus] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [earningAmount, setEarningAmount] = useState('');

  // Customer details fields
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [dob, setDob] = useState('');
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [panCardNumber, setPanCardNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [residenceLandmark, setResidenceLandmark] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyLandmark, setCompanyLandmark] = useState('');
  const [companyPincode, setCompanyPincode] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [netSalary, setNetSalary] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const leadDocRef = doc(db, 'leads', leadId);
        const leadDoc = await getDoc(leadDocRef);
        if (leadDoc.exists()) {
          const data = leadDoc.data();
          setLeadData(data);

          // Populate lead fields
          setUserId(data.userId || '');
          setServiceId(data.serviceId || '');
          setBankId(data.bankId || '');
          setStatus(data.status || '');
          setSubmissionDate(
            data.submissionDate?.toDate
              ? data.submissionDate.toDate().toISOString().substr(0, 10)
              : ''
          );
          setEarningAmount(data.earningAmount ?? '');

          // Populate customerDetails
          const cust = data.customerDetails || {};
          setFullname(cust.fullname || '');
          setEmail(cust.email || '');
          setMobile(cust.mobile || '');
          setAddress(cust.address || '');
          setCity(cust.city || '');
          setCountry(cust.country || '');
          setPostalCode(cust.postalCode || '');
          // If dob is a Firestore timestamp, convert to date string
          if (cust.dob && cust.dob.toDate) {
            setDob(cust.dob.toDate().toISOString().substr(0, 10));
          } else {
            setDob(cust.dob || ''); // might be string or empty
          }
          setOccupation(cust.occupation || '');
          setIncome(cust.income || '');
          setFatherName(cust.fatherName || '');
          setMotherName(cust.motherName || '');
          setPanCardNumber(cust.panCardNumber || '');
          setAadhaarNumber(cust.aadhaarNumber || '');
          setResidenceLandmark(cust.residenceLandmark || '');
          setEmploymentType(cust.employmentType || '');
          setCompanyName(cust.companyName || '');
          setDesignation(cust.designation || '');
          setCompanyAddress(cust.companyAddress || '');
          setCompanyLandmark(cust.companyLandmark || '');
          setCompanyPincode(cust.companyPincode || '');
          setOfficialEmail(cust.officialEmail || '');
          setNetSalary(cust.netSalary || '');
        } else {
          setError('Lead not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching lead details');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId]);

  const handleSave = async () => {
    try {
      if (!leadData) return;

      setIsSaving(true); // Start 'Saving...' animation
      setShowSuccess(false); // Hide any previous success message

      const leadDocRef = doc(db, 'leads', leadId);

      // If the user changed the date fields, convert them to Date or keep the existing
      let dobValue = leadData.customerDetails?.dob || '';
      if (dob) {
        // parse string to Date
        dobValue = new Date(dob);
      }
      let submissionDateValue = leadData.submissionDate || '';
      if (submissionDate) {
        submissionDateValue = new Date(submissionDate);
      }

      // Prepare updated data
      const updatedData = {
        userId,
        serviceId,
        bankId,
        status,
        submissionDate: submissionDateValue
          ? Timestamp.fromDate(submissionDateValue)
          : null,
        earningAmount: earningAmount ? Number(earningAmount) : null,
        customerDetails: {
          fullname,
          email,
          mobile,
          address,
          city,
          country,
          postalCode,
          dob: dobValue ? Timestamp.fromDate(dobValue) : null,
          occupation,
          income: income ? Number(income) : null,
          fatherName,
          motherName,
          panCardNumber,
          aadhaarNumber,
          residenceLandmark,
          employmentType,
          companyName,
          designation,
          companyAddress,
          companyLandmark,
          companyPincode,
          officialEmail,
          netSalary: netSalary ? Number(netSalary) : null,
        },
      };

      // Firestore update
      await updateDoc(leadDocRef, updatedData);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show success
      setShowSuccess(true);

      // Optionally, navigate back to ManageLeads or stay here
      // navigate('/ManageLeads');
    } catch (err) {
      console.error(err);
      setError('Error saving lead details');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className='w-[95%] m-auto my-5'>
      {/* Success message */}
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative transition-all">
          <strong className="font-bold">Success! </strong>
          <span>Your changes have been saved.</span>
        </div>
      )}

      <div className="flex items-center py-4 w-full">
        <div className='flex gap-3'>
          <div>
            {/* Back button */}
            <svg
              onClick={() => navigate(-1)}
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
            <h2 className="text-[#343C6A] font-medium text-2xl">Edit Lead Details</h2>
            <p className="text-[#495057] font-light text-base">
              Update any details and save changes
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lead Info Fields */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Service ID
          </label>
          <input
            type="text"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Bank ID
          </label>
          <input
            type="text"
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Status
          </label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Submission Date
          </label>
          <input
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Earning Amount
          </label>
          <input
            type="number"
            value={earningAmount}
            onChange={(e) => setEarningAmount(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Customer Details Fields */}
        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Full Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Mobile
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Occupation
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Father Name
          </label>
          <input
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Mother Name
          </label>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            PAN Card Number
          </label>
          <input
            type="text"
            value={panCardNumber}
            onChange={(e) => setPanCardNumber(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Aadhaar Card Number
          </label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Residence Landmark
          </label>
          <input
            type="text"
            value={residenceLandmark}
            onChange={(e) => setResidenceLandmark(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Employment Type
          </label>
          <input
            type="text"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Designation
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Company Address
          </label>
          <input
            type="text"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Company Landmark
          </label>
          <input
            type="text"
            value={companyLandmark}
            onChange={(e) => setCompanyLandmark(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Company Pincode
          </label>
          <input
            type="text"
            value={companyPincode}
            onChange={(e) => setCompanyPincode(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Official Email ID
          </label>
          <input
            type="email"
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-[#212529] font-normal text-sm">
            Net Salary
          </label>
          <input
            type="number"
            value={netSalary}
            onChange={(e) => setNetSalary(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-end mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-all"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditDetails;