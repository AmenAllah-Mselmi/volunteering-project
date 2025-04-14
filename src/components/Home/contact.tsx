// src/components/ContactForm.jsx
"use client"
import  { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(e:any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if (!Object.values(form).every((value) => value !== "")) {
      toast.error("Please fill all the fields", {
        position: "bottom-center",
      });
      return;
    }
    setLoading(true);
    console.log("form submitted", form);
    setTimeout(() => {
      toast.success("Message Sent! Thank You.", {
        position: "bottom-center",
      });
      setLoading(false);
    }, 1000);
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <div id="contact" className="mt-24  ">
      <ToastContainer />
      <div className="container mx-auto p-4 w-11/12">
        <div className="title text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-blue-700">Contact Us</h1>
          <p className="text-lg text-gray-700">Let us know what you need and we will get back to you in no time.</p>
        </div>
        <div className="form grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="firstname">
            <label htmlFor="firstname" className="block text-blue-700 font-medium mb-2">First name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="John"
              onChange={handleChange}
              value={form.firstname}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-700 focus:outline-none"
            />
          </div>
          <div className="lastname">
            <label htmlFor="lastname" className="block text-blue-700 font-medium mb-2">Last name</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Doe"
              onChange={handleChange}
              value={form.lastname}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-700 focus:outline-none"
            />
          </div>
          <div className="email col-span-2">
            <label htmlFor="email" className="block text-blue-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john.doe@example.com"
              onChange={handleChange}
              value={form.email}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-700 focus:outline-none"
            />
          </div>
          <div className="subject col-span-2">
            <label htmlFor="subject" className="block text-blue-700 font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              placeholder="Subject Name"
              onChange={handleChange}
              value={form.subject}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-700 focus:outline-none"
            />
          </div>
          <div className="message col-span-2">
            <label htmlFor="message" className="block text-blue-700 font-medium mb-2">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Your message..."
              onChange={handleChange}
              value={form.message}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-700 focus:outline-none resize-none"
            ></textarea>
          </div>
          <div className="submit col-span-2 flex items-center gap-4">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-blue-700 text-white py-3 px-6 rounded-md focus:outline-none"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {loading && (
              <div className="loading w-6 h-6 border-4 border-blue-800 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
