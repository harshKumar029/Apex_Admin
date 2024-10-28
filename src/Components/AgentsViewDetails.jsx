import React from 'react'
import { useNavigate } from 'react-router-dom'

const AgentsViewDetails = () => {
        const navigate = useNavigate()
    
        // Sample data that would typically come from an API or state
        const inputFields = [
            { label: 'Agent Name', placeholder: 'Rohit Sharma' },
            { label: 'Joining Date', placeholder: '3/5/2023' },
            { label: 'Agent Contact Number', placeholder: '9876543210' },
            { label: 'Leads brought in', placeholder: '120' },
            { label: 'Agent Email ID', placeholder: 'rohit.verma@gmail.com' },
            { label: 'Level', placeholder: 'Platinum' },
            { label: 'Date of Birth', placeholder: 'Sushila Devi' },
            { label: 'PAN Card', placeholder: 'CDPH678R' },
            { label: 'Mother Name', placeholder: 'Sushila Sharma' },
            { label: 'Aadhaar Card', placeholder: '52628309365362' },
            { label: 'Father Name', placeholder: 'Suraj Sharma' },
            { label: 'Address', placeholder: 'Shasti nagar' },
            { label: 'Pin Code', placeholder: '110034' },
            { label: 'Company Address', placeholder: 'Noida' },
            { label: 'Pin Code', placeholder: '110092' },
        ];
    
        return (
            <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
                <div className="flex items-center py-4 w-full">
                    <div className='flex gap-3'>
                        <div>
                            <svg onClick={() => navigate('/ManageAgents')} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z" fill="#495057" />
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
    
                {/* Displaying details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {inputFields.map((field, index) => (
                        <div key={index} className="  flex gap-4 items-center">
                            <h3 className=" text-base font-normal text-[#212529]">{field.label}</h3>
                            <p
                                className={`text-base  rounded-full 
                            ${field.placeholder === 'Diamond' ? 'bg-gradient-to-t from-[#44A08D] to-[#093637] text-[#FFFFFF] px-4' : 'text-[#718EBF]'}
                            ${field.placeholder === 'Copper' ? 'bg-gradient-to-t from-[#554023] to-[#C99846] text-[#FFFFFF] px-4' : 'text-[#718EBF]'}
                            ${field.placeholder === 'Platinum' ? 'bg-gradient-to-t from-[#403B4A] to-[#E7E9BB] text-[#3f3f3f] px-4' : 'text-[#718EBF]'}
                            ${field.placeholder === 'Gold' ? 'bg-gradient-to-t from-[#F2994A] to-[#F2C94C] text-[#282a2c] px-4' : 'text-[#718EBF]'}
                            ${field.placeholder === 'Silver' ? 'bg-gradient-to-t from-[#ABBAAB] to-[#FFFFFF] text-[#282a2c] px-4' : 'text-[#718EBF]'}
                        `}
                            >{field.placeholder}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


export default AgentsViewDetails
