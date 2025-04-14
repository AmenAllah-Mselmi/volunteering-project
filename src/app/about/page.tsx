import React from 'react';
import Image from 'next/image';
import Footer from '@/components/Home/footer';
import Navbar from '@/components/Home/navbar';
import About from '@/components/About/about';
const AboutSection = () => {
  return (
    <div>
        <Navbar/>
      <About/>
    <Footer/>
    </div>
  );
};

export default AboutSection;