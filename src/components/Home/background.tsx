
import Image from 'next/image';
import backgroundImage from '../../../public/home/homeimage.jpg'; // Engineering/tech background
import logo from "../../../public/logo-eps.png"; // Your EPS SB logo

const WelcomeSection = () => {
  return (
    <div 
      id='home' 
      className="w-full md:h-[100vh] h-[100svh] relative mt-24 bg-gray-900 "
      style={{
        backgroundImage: `linear-gradient(href bothrefm, rgba(0,48,141,0.8), rgba(0,44,63,0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header with logo */}
      <div className="flex flex-row justify-between items-center px-6 py-4 absolute w-full">
        <Image 
          src={logo} 
          alt="IEEE EPS SB" 
          className="h-16 w-auhref object-contain" 
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-8 items-center justify-center h-full px-4 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            IEEE <span className="text-blue-400">EPS</span> Student Branch
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-blue-200">
            Advancing Electronics & Power Systems
          </h2>
          
          <div className="w-32 h-1 bg-blue-400 my-6"></div>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Empowering future engineers through technical excellence, 
            innovation, and professional development in electronics 
            and power systems.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/about"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            About Us
          </a>
          <a
            href="https://eps.ieee.tn"
            className="px-8 py-3 border-2 border-blue-400 text-blue-100 hover:bg-blue-900/30 font-medium rounded-lg transition-colors"
          >
            Join EPS
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;