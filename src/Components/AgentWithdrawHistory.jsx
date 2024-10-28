import React from 'react'
import { useNavigate } from 'react-router-dom'

const AgentWithdrawHistory = () => {
    const navigate = useNavigate()

    const PaymentHistory = [
        {
            "id": 1,
            "amount": 8000,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 2,
            "amount": 22100,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 3,
            "amount": 2600,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 4,
            "amount": 1800,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 5,
            "amount": 19000,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 6,
            "amount": 17000,
            "date": "24 June 2024",
            "status": "success"
        },
        {
            "id": 7,
            "amount": 63000,
            "date": "24 June 2024",
            "status": "success"
        }
    ]
    return (
        <div className="w-[95%] m-auto my-5">
            <div>
                <div className="flex items-center justify-between py-4 w-full">
                    <div className="flex gap-3">
                        <div>
                            <svg onClick={() => navigate('/ManageAgents')} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z" fill="#495057" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-[#343C6A] font-medium text-2xl">Money withdraw History</h2>
                            <p className="text-[#495057] font-light text-base">
                                Please go through the details
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className=' flex flex-col sm:flex-row justify-between'>
                        <div className=' inline-flex gap-4'>
                            <h3 className=' text-base font-normal text-[#212529]'>Agent name</h3>
                            <p className=' text-[#718EBF] text-base'>Rohit Sharma</p>
                        </div>
                        <div className=' inline-flex gap-4'>
                            <h3 className=' text-base font-normal text-[#212529]'>Agent Contect Number</h3>
                            <p className=' text-[#718EBF] text-base'>82873692073</p>
                        </div>
                    </div>
                </div>
                <div className=' p-4 border mt-7  border-[#DEE2E6] rounded-2xl'>
                    <h2 className=' font-medium text-xl text-[#343C6A]'>Withdrawal History</h2>
                    {PaymentHistory.map((field) => (
                        <div key={field.id} className="flex py-2 justify-between">
                            <div className="flex items-center gap-3">
                                <p className="h-11 w-11 rounded-full text-white font-medium text-sm bg-[#063E50] flex items-center justify-center">
                                    JUN
                                </p>
                                <h3 className="font-medium text-xl text-[#343C6A]">{field.date}</h3>
                            </div>
                            <p className=' text-[#5DD326] font-medium text-xl'>₹ {field.amount}</p>
                        </div>
                    ))}

                </div>
            </div>
        </div >
    )
}

export default AgentWithdrawHistory
