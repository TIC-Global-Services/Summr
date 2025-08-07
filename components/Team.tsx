import React from 'react';
import { DeepikaImg } from '@/assets';
import Image from 'next/image';

const Team = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row border-b">
      {/* Left Section: Image */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative ">
        <Image
          src={DeepikaImg}
          alt="Deepika"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Section: Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-10 md:py-4">
        <div className="max-w-lg px-6 space-y-6 py-6">
          <h1 className="text-3xl md:text-5xl uppercase font-medium text-primary">
            Meet the Mind <br />
            Behind <span className="font-rofane italic">Summr</span>
          </h1>
          <div className="space-y-2">
            <h2 className="font-rofane font-medium text-3xl">Deepika Manjunath</h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Driven by the need for a deodorant that’s clean, skin-friendly, and actually works in the Indian climate, Summr was born from equal parts frustration and obsession. As a skincare enthusiast with a nose for ingredients, Deepika couldn’t find a roll-on that felt good, smelled fresh, and kept up with real life—so she made one. Summr blends nature-backed formulas with zero B.S., giving your underarms the care they’ve always deserved (and probably never got).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;