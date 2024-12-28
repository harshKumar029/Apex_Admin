import React from 'react';
import SideBar from './SideBar';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="fixed h-full z-[1000]">
                <SideBar />
            </div>
            
            <div className=" w-[100%] md:w-[83%] ml-auto"> 
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
