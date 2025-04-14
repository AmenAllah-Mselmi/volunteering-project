
import Image from 'next/image';
import { IoCodeSlash, IoLogoLinkedin } from 'react-icons/io5';

export default function TeamCard({ infos }) {
  const { name, position, image, linkedin, portfolio } = infos;
  
  return (
    <div data-aos="fade-up" className="flex flex-col justify-around p-4 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 h-[500px] ">
      <div className="relative overflow-hidden rounded-lg  h-4/5">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="w-full  object-cover h-full"
        />
        
      </div>
      <div className="  flex gap-3 items-center p-2 h-1/5">
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-800">{name}</div>
          <div className="text-sm text-gray-500">{position}</div>
        </div>
        <div className="flex flex-col gap-1">
          {linkedin && (
            <a href={linkedin} target="_blank" className="text-gray-600 text-xl hover:text-gray-800 ">
              <IoLogoLinkedin  className='w-7 h-7'/>
            </a>
          )}
          {portfolio && (
            <a href={portfolio} className="text-gray-600 text-xl hover:text-gray-800">
              <IoCodeSlash />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
