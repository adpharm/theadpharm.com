import * as React from "react";
import type { string } from "astro:schema";

export interface LeadershipCardProps {
  imgSrc: string;
  name: string;
  title: string;
}

export function LeadershipCard({ imgSrc, name, title }: LeadershipCardProps) {
  return (
    <div className="flex flex-col justify-start items-center group">
      <div className="h-44 w-44 rounded-full overflow-hidden mb-4 flex items-center justify-center border border-zinc-400">
        <img
          src={imgSrc}
          alt={name}
          className="object-fill filter transition duration-300 ease-in-out group-hover:grayscale"
        />
      </div>
      <h3 className="text-xl text-orange-600 font-semibold">{name}</h3>
      <p
        className="text-sm text-zinc-400 text-center"
        dangerouslySetInnerHTML={{ __html: title }}
      ></p>
    </div>
  );
}
