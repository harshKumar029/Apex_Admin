import React, { useState } from 'react';

const Setting = () => {
    const [activeTab, setActiveTab] = useState('editProfile');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='w-[95%] m-auto my-5'>
            {/* Tabs */}
            <div className="flex justify-start space-x-4 mb-5">
                <button
                    onClick={() => handleTabChange('editProfile')}
                    className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'editProfile' ? 'border-b-2 border-[#063E50] text-[#063E50]' : 'text-[#718EBF]'}`}
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => handleTabChange('security')}
                    className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'security' ? 'border-b-2 border-[#063E50] text-[#063E50]' : 'text-[#718EBF]'}`}
                >
                    Security
                </button>
            </div>

            {/* Content for Edit Profile Tab */}
            {activeTab === 'editProfile' && (
                <div>
                    <div className="flex flex-col md:flex-row space-y-6">
                        <div className="flex mb-4 justify-center sm:justify-start">
                            {/* User Profile Photo */}
                            <img
                                src="path/to/profile-photo.jpg"
                                alt="Profile"
                                className="w-24 h-24 m-5 rounded-full border border-[#DEE2E6] object-cover"
                            />
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            style={{ width: '-webkit-fill-available' }}
                        >
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Charlene Reed"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="charlenereed@gmail.com"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="dob">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    className="border placeholder-[#718EBF] border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="**********"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="San Jose, California, USA"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    placeholder="San Jose"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    placeholder="45962"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    placeholder="USA"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="occupation">Occupation</label>
                                <input
                                    type="text"
                                    id="occupation"
                                    placeholder="Sales Person"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-[#212529]" htmlFor="workExperience">Work Experience</label>
                                <input
                                    type="text"
                                    id="workExperience"
                                    placeholder="2 years"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-center sm:justify-end mt-8">
                        <button className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full">
                            Save
                        </button>

                    </div>
                </div>
            )}

            {/* Content for Security Tab */}

            {activeTab === 'security' && (
                <div>
                    <div className="flex flex-col space-y-4">
                        {/* Two-Factor Authentication Section */}
                        <h2 className="text-lg font-bold text-[#063E50]">Two-factor Authentication</h2>

                        {/* Toggle Button */}
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-[#d2d2d2] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#063E50]"></div>
                            <span className="ms-3 text-base font-normal text-[#212529]">Enable or disable two-factor authentication</span>
                        </label>

                        {/* Change Password Section */}
                        <h2 className="text-base font-medium text-[#063E50]">Change Password</h2>

                        {/* Password Inputs */}
                        <div className="flex flex-col md:flex-col md:w-1/3 space-y-4">
                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    placeholder="**********"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    placeholder="**********"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-center sm:justify-end mt-8">
                        <button className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full">
                            Save
                        </button>

                    </div>
                </div>
            )}

        </div>

    );
};

export default Setting;
