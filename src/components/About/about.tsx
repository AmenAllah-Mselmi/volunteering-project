import React from 'react';
import Image from 'next/image';
import { FaHandsHelping, FaChartLine, FaUsers, FaMobileAlt } from 'react-icons/fa';
import image from "../../../public/home/homeimage.jpg"
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="p-3 mb-4 bg-blue-100 rounded-full text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-blue-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <FaHandsHelping className="text-2xl" />,
      title: "Community Impact",
      description: "Join thousands making a difference in their local communities"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Track Progress",
      description: "Monitor your volunteer hours and achievements"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Build Connections",
      description: "Network with like-minded volunteers and organizations"
    },
    {
      icon: <FaMobileAlt className="text-2xl" />,
      title: "Mobile Access",
      description: "Manage your volunteering anytime, anywhere"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-blue-50 to-white mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            Our Mission
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Empowering Volunteers, <span className="text-blue-600">Transforming Communities</span>
          </h2>
          <div className="w-20 h-1 mx-auto bg-blue-400 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={image}
                alt="Team of volunteers working together"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                About Our Platform
              </h3>
              <p className="text-gray-600 mb-6">
                We connect passionate individuals with meaningful volunteer opportunities 
                that create real impact. Our platform makes it easy to find, track, and 
                manage your volunteer work all in one place.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                Join Our Community
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;