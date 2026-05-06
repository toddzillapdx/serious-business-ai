import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'lockup' | 'icon';
  color?: 'white' | 'black';
  className?: string;
}

export default function Logo({ variant = 'icon', color = 'white', className = '' }: LogoProps) {
  // Using monogram for simplicity since we'll reference the JPG assets
  // In production, these should be converted to SVGs
  
  if (variant === 'lockup') {
    return (
      <div className={className}>
        <img src="/SB_logo_full_lockup.jpg" alt="Serious Business" style={{ height: '40px' }} />
      </div>
    );
  }

  // Default: icon/monogram
  return (
    <div className={`text-2xl font-exo font-black ${color === 'white' ? 'text-white' : 'text-black'} ${className}`}>
      [SB]
    </div>
  );
}
