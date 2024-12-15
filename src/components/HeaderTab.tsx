import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

export default function HeaderTab({
  title,
  href,
  active,
  className,
}: {
  title: string;
  href: string;
  active?: boolean;
  className?: string;
}) {
  const isExternalLink = href.startsWith("http");

  return (
    <a
      href={href}
      className={twMerge(
        "flex justify-center items-center text-white text-center flex-1 py-2 px-1 text-sm font-normal transition-colors rounded-full truncate",
        active ? "bg-orange-600 hover:bg-orange-700 font-medium" : "bg-transparent hover:bg-zinc-800",
        className
      )}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
    >
      <span>{title}</span>
      {isExternalLink && <Icon name="arrowUpRight" className="h-4 w-4 -mr-2" />}
    </a>
  );
}
