import React from "react";
import wie from "../../../public/chapters/wie.png";
import sight from "../../../public/chapters/sight.ico";
import cs from "../../../public/chapters/cs.png"
import ras from "../../../public/chapters/ras.png"
import Image from "next/image";
const Chapters = () => {
  const chapters = [
    {
      name: "Sight",
      imgSrc: sight,
      bgColor: "bg-white",
    },
    {
      name: "Computer For Society",
      imgSrc: cs,
      bgColor: "bg-[#c65503]",
    },
    {
      name: "RAS",
      imgSrc:ras,
      bgColor: "bg-[#d9e2e5]",
    },
    {
      name: "WIE",
      imgSrc: wie,
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-center gap-3">
        <h2 className="text-center text-4xl font-bold">Our Chapters</h2>
      </div>
      <div className="ggrid mx-auto mt-10 flex max-w-lg grid-cols-4 flex-wrap items-center justify-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {chapters.map((chapter, index) => (
          <div key={index} className="transition hover:scale-105">
              <Image
                className={`col-span-2 mx-auto h-36 w-64 rounded-2xl ${chapter.bgColor} object-contain p-6 shadow-md shadow-gray-200 transition dark:shadow-gray-800 lg:col-span-1`}
                src={chapter.imgSrc}
                alt={chapter.name}
                loading="lazy"
              />
              <h1 className="mt-4 text-center text-lg font-extrabold">
                {chapter.name}
              </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chapters;
