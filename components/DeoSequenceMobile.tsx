import {  DeodorantMobile } from "@/assets";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productDetail } from "./DeoSequence";
import Mobile3D from "./Mobile3D";

gsap.registerPlugin(ScrollTrigger);

export const DeoSequenceMobile = () => {


  return (
    <div className="relative">
      <div >
        <div className="mt-20 flex flex-col justify-center px-4 z-10 text-center">
          <h1 className="text-4xl font-medium uppercase text-primary">
            Feel <span className="font-rofane italic">Fresh .</span> <br />
            <span className="font-rofane italic">Live</span> Free
          </h1>
          <p className="text-lg mt-4">
            Introducing Summr—a clean, skin-loving roll-on deodorant made for
            everyday freshness, naturally.
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <Image
            src={DeodorantMobile}
            alt="Deodorant"
            width={400}
            height={600}
            className="object-contain w-2/3"
            priority
          />
        </div>

        <div className="py-8">
          <div className="text-center px-4">
            <h2 className="text-2xl font-medium text-primary tracking-wider">
              MEET YOUR <span className="italic font-rofane">UNDERARMS</span> NEW
              BFF
            </h2>
          </div>

          <div className="flex flex-col md:flex-row px-6 mt-6">
            <div className="w-full md:w-1/2 flex ">
              <div className="space-y-3 max-w-sm">
                {productDetail.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-base leading-tight">
                      {detail.text}
                    </span>
                    <Image
                      src={detail.icon}
                      alt={detail.text}
                      width={24}
                      height={24}
                      className="flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center items-start pt-6 md:pt-8">
              <div className="max-w-sm">
                <p className="text-sm leading-relaxed">
                  A clean, plant-powered roll-on that keeps odor in check—without
                  aluminum, parabens, or the stickiness. Lightly scented,
                  ultra-smooth, and quick-drying, it&apos;s designed for all-day
                  comfort even on the hottest days.
                </p>
              </div>
            </div>
          </div>
        </div>

       <Mobile3D />
      </div>
    </div>
  );
};