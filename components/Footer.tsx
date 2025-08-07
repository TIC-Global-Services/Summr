import { SummrLogoBlue } from '@/assets'
import { FacebookIcon, InstaIcon, LinkedinIcon, MailIcon, PhoneIcon, SnapIcon, XIcon } from '@/assets/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {

    const socials = [
        {
            icon: FacebookIcon,
            link: ''
        },
        {
            icon: XIcon,
            link: ''
        },
        {
            icon: InstaIcon,
            link: ''
        },
        {
            icon: LinkedinIcon,
            link: ''
        },
        {
            icon: SnapIcon,
            link: ''
        },
    ]

    const contact = [
        {
            icon: MailIcon,
            text: 'hello@summr.com'
        },
        {
            icon: PhoneIcon,
            text: '+91 9876543210'
        },
    ]

    return (
        <div className=' px-20 py-10'>
            <div className=' w-full'>
                <Image src={SummrLogoBlue} alt='Summr Blue Logo' width={500} height={500} className=' w-full' />
            </div>
            <div className=' flex items-center justify-between py-4'>
                <div>
                    <h1 className=' uppercase text-base'>Designed & developed by <Link href={'https://theinternetcompany.one/'} target='_blank' className=' text-primary'>TIC Global Services</Link></h1>
                </div>
                <div className=' flex text-xl space-x-4'>
                    {socials.map((item, index) => (
                        <div className=' text-primary'>
                            <Link href={item.link}><item.icon /></Link>
                        </div>
                    ))}
                </div>
                <div className=' flex space-x-4'>
                    {contact.map((item, index) => (
                        <div className=' flex text-xl items-center gap-2'>
                            <item.icon className=' text-primary' />
                            <p className=' text-base'>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Footer
