import React from 'react'

export default function Neural() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
            </defs>
            <path d="M0,200 Q200,100 400,300 T800,200 T1200,400" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
            <path d="M0,400 Q300,500 500,300 T900,400 T1400,200" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
            <circle cx="400" cy="300" r="3" fill="#3B82F6" opacity="0.3" />
            <circle cx="800" cy="200" r="3" fill="#8B5CF6" opacity="0.3" />
            <circle cx="500" cy="300" r="3" fill="#EC4899" opacity="0.3" />
        </svg>
    )
}
