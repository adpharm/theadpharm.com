import * as React from "react";
import type { string } from "astro:schema";

export interface LeadershipCardProps {
  imgSrc: string;
  name: string;
  title: string;
}

export function LeadershipCard({ imgSrc, name, title }: LeadershipCardProps) {
  return (
    <div className="flex flex-col justify-start items-center">
      <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-orange-600 mb-2 flex items-center justify-center">
        <img src={imgSrc} alt={name} className="object-fill" />
      </div>
      <h3 className="text-lg text-orange-600 font-semibold">{name}</h3>
      <p
        className="text-gray-600 text-center"
        dangerouslySetInnerHTML={{ __html: title }}
      ></p>
    </div>
  );
}
