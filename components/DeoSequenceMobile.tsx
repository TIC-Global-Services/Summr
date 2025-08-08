import { DeodorantMobile } from "@/assets";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mobile3D from "./Mobile3D";


gsap.registerPlugin(ScrollTrigger);

export const DeoSequenceMobile = () => {


  return (
    <div className="relative">
      <div >
        <div className="mt-20 flex flex-col justify-center px-4 z-10 text-center">

          <h1 className='text-4xl md:text-6xl font-medium'>
            Tested & Proven: <br />
            Fresher, Cleaner, <br />
            Better.
          </h1>


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

        <div className="pt-8 pb-20">
          <div className="text-center px-4">
            <h2 className=' text-lg md:text-base font-medium tracking-tighter'>
              Summr keeps you fresh like any roll-on— <br />just cleaner, safer, and kinder to the <br />planet.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row px-6 mt-6">
            <div className="w-full md:w-1/2 flex px-4">
              <div className="space-y-3 max-w-sm">
                <h1 className=' text-lg  tracking-tight list-item'>
                  96% natural ingredients
                </h1>
                <h1 className='text-lg  tracking-tight list-item'>
                  Plant-powered, no nasties, all-day fresh.
                </h1>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center items-start pt-6 md:pt-8">
              <div className=' max-w-md text-base text-start'>
                <p>The life cycle assessment of Summr was conducted by leading sustainability experts at Anthesis. The report was third-party reviewed and completed in accordance with ISO 14040 and 14044 standards.</p>
              </div>
            </div>
          </div>
        </div>

        <Mobile3D />
      </div>
    </div>
  );
};