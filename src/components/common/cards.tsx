import Image from "next/image";
import React from "react";
import { CardProps } from '@/types/interfaces/ui';

export default function Card({
  title,
  content,
  imageSrc,
  footer,
  className = "",
}: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {imageSrc && (
        <div className="w-full h-48 relative">
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
        </div>
      )}

      <div className="p-4">
        {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
        {content && <p className="text-gray-600">{content}</p>}
      </div>

      {footer && <div className="p-4 border-t">{footer}</div>}
    </div>
  );
}
