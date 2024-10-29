
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/Apexlogo.svg'
import Leftarrow from '../../assets/icon/Leftarrow.svg'
import PassSucessTick from '../../assets/icon/PassSucessTick.svg'
import CardImg from '../../assets/img/CardImg.svg'

const Passchange = () => {


    const navigate = useNavigate();

    return (
        <div className='bg-blue-primary flex h-[100vh]'>
            <section className=' pt-4 hidden md:block  pb-8 px-14 space-y-3 '>
                <img className=' w-36' src={ApexLogo} alt='ApexLogo' />
                <div className=' text-white'>
                    <h1 className=' text-[2.5rem] font-medium'>Your <b className=' font-extrabold'>Financial Future</b> Starts Here</h1>
                    <h3>Join our growing community of successful agents.</h3>
                    <img className=' absolute w-[32rem] left-0 bottom-20' src={CardImg} alt='CardImg' />
                </div>
            </section>

                <section className="w-[120vw] h-screen pt-10 md:pt-0 bg-white md:rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
                <div className="md:w-[45vw] w-[90vw] px-5 md:mr-28 space-y-14 md:space-y-7">

                    <div className=' flex items-baseline gap-3'>
                        <img className=' w-7' src={Leftarrow} alt='Leftarrow' />
                        <div>
                            <h2 className=" text-[#525252] text-4xl font-bold mb-2 ">Password changed</h2>
                        </div>
                    </div>
                    <div  className='space-y-7 '
                    style={{textAlign:"-webkit-center"}}>
                        <img src={PassSucessTick} alt='PassSucessTick'/>
                        <p className=' font-medium text-[#495057] text-base' >Your password has been changed successfully.</p>

                        <button
                        onClick={() => navigate('/login')}
                            className="w-full bg-blue-primary text-white py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Passchange
