// src/Components/Searchbar.jsx

import React from 'react';
import Search from '../assets/icon/Search.svg';

const HeaderSearchbar = ({ searchQuery, onChange }) => {
  return (
    <div className='relative'>
      <input
        type='text'
        value={searchQuery}
        onChange={onChange}
        placeholder='Search for Leads'
        className='placeholder:font-normal placeholder:text-[13px] bg-white_custom sm:placeholder:text-[16px] placeholder:text-[#ADB5BD] bg-[#F8FAFA] rounded-3xl px-16 py-4 sm:py-1.5 outline-none w-full'
      />
      <img
        src={Search}
        alt='Search'
        className='absolute left-3 top-1/2 transform -translate-y-1/2 w-6 sm:w-4  text-gray-400'
      />
    </div>
  );
};

export default HeaderSearchbar;