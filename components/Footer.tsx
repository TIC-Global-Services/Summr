import { SummrLogoBlue } from '@/assets';
import { FacebookIcon, InstaIcon, LinkedinIcon, MailIcon, PhoneIcon, SnapIcon, XIcon } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const socials = [
    {
      icon: FacebookIcon,
      link: '',
    },
    {
      icon: XIcon,
      link: '',
    },
    {
      icon: InstaIcon,
      link: '',
    },
    {
      icon: LinkedinIcon,
      link: '',
    },
    {
      icon: SnapIcon,
      link: '',
    },
  ];

  const contact = [
    {
      icon: MailIcon,
      text: 'hello@summr.com',
    },
    {
      icon: PhoneIcon,
      text: '+91 9876543210',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-20 md:py-10">
      <div className="w-full mx-auto">
        <Image
          src={SummrLogoBlue}
          alt="Summr Blue Logo"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between py-4 gap-6 md:gap-0">
        <div className="text-center md:text-left">
          <h1 className="uppercase text-sm sm:text-base md:text-base">
            Designed & developed by{' '}
            <Link href="https://theinternetcompany.one/" target="_blank" className="text-primary">
              TIC Global Services
            </Link>
          </h1>
        </div>
        <div className="flex text-lg sm:text-xl space-x-3 sm:space-x-4">
          {socials.map((item, index) => (
            <div key={index} className="text-primary">
              <Link href={item.link}>
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
          {contact.map((item, index) => (
            <div key={index} className="flex text-lg items-center gap-2">
              <item.icon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              <p className="text-sm sm:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;