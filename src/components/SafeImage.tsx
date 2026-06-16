"use client";

import React from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function SafeImage({ src, alt, fill, sizes, className = '', priority, loading }: SafeImageProps) {
  // If the image is a base64 data URI, use a regular img tag
  if (src?.startsWith('data:')) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full ${className}`}
          loading={loading}
        />
      );
    }
    return <img src={src} alt={alt} className={className} loading={loading} />;
  }

  // Otherwise use Next.js Image optimization
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={loading}
    />
  );
}
