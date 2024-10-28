// import React from 'react'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/Apexlogo.svg'
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg'
import Google from '../../assets/icon/Google.svg'
import Facebook from '../../assets/icon/Facebook.svg'
import CardImg from '../../assets/img/CardImg.svg'

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        mobile: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form Data Submitted:', formData);
    };
    return (
        <div className='md:bg-blue-primary bg-white flex h-[100vh]'>
            <section className=' pt-4 hidden md:block  pb-8 px-14 space-y-3 '>
                <img className=' w-36' src={ApexLogo} alt='ApexLogo' />
                <div className=' text-white'>
                    <h1 className=' text-[2.5rem] font-medium'>Your <b className=' font-extrabold'>Financial Future</b> Starts Here</h1>
                    <h3>Join our growing community of successful agents.</h3>
                    <img className=' absolute w-[32rem] left-0 bottom-20' src={CardImg} alt='CardImg' />
                </div>
            </section>
            <section className="w-[120vw] h-screen mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
                <div className="md:w-[45vw] w-[90vw] px-5 md:mr-28 space-y-14 md:space-y-7">

                    <div className=' flex justify-between'>
                        <h2 className=" self-end md:self-auto text-[#525252] text-4xl font-bold mb-6 ">LogIn to your Account  </h2>
                        <img className=' md:hidden block  w-36' src={Apexlogoblue} alt='ApexLogo' />
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-7'>

                        <div className="mb-6">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className=' flex justify-end'>
                            <p onClick={() => navigate('/password/reset')} className=' cursor-pointer font-medium text-[#063E50]'>Forgot Password?</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 text-lg md:text-base font-semibold rounded-lg hover:bg-[#053748] transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <div className=' flex justify-center mt-6'>
                        <p className=' text-[#ADB5BD] font-medium'>- OR -</p>
                    </div>

                    <div className="mt-6 flex">
                        <button className="w-full flex justify-center gap-3 font-semibold items-center text-[#A1A1A1] rounded-lg ">
                            <img src={Google} alt='Google' />
                            Continue with Google
                        </button>
                        <button className="w-full flex justify-center gap-3 font-semibold items-center text-[#A1A1A1] rounded-lg">
                            <img src={Facebook} alt='Facebook' />
                            Continue with Facebook
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1] flex justify-center">
                            Already have an account?{' '}
                            <p onClick={() => navigate('/Signup')} className="text-[#063E50] cursor-pointer hover:underline">
                                Signup
                            </p>
                        </p>
                    </div>
                </div>
            </section>
        </div>


    )
}

export default Login
