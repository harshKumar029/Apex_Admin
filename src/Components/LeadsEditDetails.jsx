import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditDetails = () => {
    const navigate = useNavigate();
const Status = 'Pending';
   
    const inputFields = [
        { label: 'Customer Name', placeholder: 'Rohit Sharma' },
        { label: 'Bank Chosen', placeholder: 'SBI' },
        { label: 'Date of Birth', placeholder: '02/12/1997' },
        { label: 'Service Chosen', placeholder: 'Home Loan' },
        { label: 'Email ID', placeholder: 'rohit.verma@gmail.com' },
        { label: 'Company Name', placeholder: 'Infosys' },
        { label: 'Mother Name', placeholder: 'Sushila Sharma' },
        { label: 'Company Address', placeholder: 'Noida' },
        { label: 'Father Name', placeholder: 'Suraj Sharma' },
        { label: 'Designation', placeholder: 'Engineer' },
        { label: 'Address', placeholder: 'Delhi, Shastri Park, U Block' },
        { label: 'Official Email ID', placeholder: 'rohit@infosys.com' },
        { label: 'Pin Code', placeholder: '110092' },
        { label: 'Amount', placeholder: '10 Lakh' },
        { label: 'PAN Card Number', placeholder: 'CDPH678R' },
        { label: 'Start Date', placeholder: '3/5/2023' },
        { label: 'Aadhaar Card Number', placeholder: '52628309365362' },
        { label: 'Contact Number', placeholder: '9876543210' }, // contact no nahi tha
    ];

    return (
        <div className='w-[95%] m-auto my-5'>
            <div className="flex sm:items-center flex-col gap-3 sm:flex-row justify-between py-4 w-full">
                <div className='flex gap-3'>
                    <div>
                        <svg onClick={() => navigate('/ManageLeads')} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z" fill="#495057" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-[#343C6A] font-medium text-2xl">Edit Details</h2>
                        <p className="text-[#495057] font-light text-base">
                            Please go through the details
                        </p>
                    </div>
                </div>
                <div className=' flex gap-6 items-center justify-between sm:justify-normal'>
                    <div className=' flex gap-3 items-center'>
                    <h4 className=' font-medium text-2xl text-[#343C6A]'>Status</h4>
                    <p
                           className={` text-sm px-4  rounded-full 
                            ${Status === 'Pending' ? 'bg-[#D3B6262E] text-[#D3B626]' : ''}
                            ${Status === 'Approved' ? 'bg-[#28A7452E] text-[#28A745]' : ''}
                            ${Status === 'Rejected' ? 'bg-[#DC35452E] text-[#DC3545]' : ''}
                            ${Status === 'In Process' ? 'bg-[#FBB34933] text-[#FBB349]' : ''}
                          `}
                    > {Status}</p>
                    </div>
                    <button className=' px-6 py-1 bg-[#063E50] rounded-3xl text-white font-medium'>Approve</button>
                </div>
            </div>

            {/* Form Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inputFields.map((field) => (
                    <div key={field.label} className="flex flex-col">
                        <label className="block text-[#212529] font-normal text-sm">
                            {field.label}
                            <span className="text-red-500"> *</span>
                        </label>
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
                        />
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end mt-8">
                <button onClick={() => navigate('/Dashboard/selectbank/Leaddetails/confirmation')} className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full">
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditDetails;
