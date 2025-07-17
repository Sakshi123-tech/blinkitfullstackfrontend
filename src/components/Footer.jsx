import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t bg-gray-100'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row items-center justify-between gap-2 text-sm'>
        
        <p className='text-gray-600'>© All Rights Reserved 2025</p>

        <div className='flex items-center gap-2 text-gray-600'>
          <span className='flex items-center gap-1'>
            Made with <span className='text-red-500 text-base'>♥</span> by Anwesha Bhatt
          </span>
          
          <a href='https://github.com/Sakshi123-tech' target='_blank' rel='noreferrer'>
            <FaGithub className='hover:text-black transition duration-200' />
          </a>
          <a href='https://www.linkedin.com/in/sakshi-agnihotri-64613a263' target='_blank' rel='noreferrer'>
            <FaLinkedin className='hover:text-blue-600 transition duration-200' />
          </a>
          {/* <a href='https://instagram.com/your-instagram' target='_blank' rel='noreferrer'>
            <FaInstagram className='hover:text-pink-500 transition duration-200' />
          </a>
          <a href='https://facebook.com/your-facebook' target='_blank' rel='noreferrer'>
            <FaFacebook className='hover:text-blue-500 transition duration-200' />
          </a> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
