import ContactForm from '@/components/Home/contact';
import Footer from '@/components/Home/footer';
import Navbar from '@/components/Home/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
    <Navbar/>
    <ContactForm/>
    <Footer/>
    </div>
  )
}

export default page;