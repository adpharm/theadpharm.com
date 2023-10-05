import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

export default function Href({
  href,
  className,
  disabled,
  hideOutLinkIcon,
  children,
  ...props
}: {
  href: string;
  className?: string;
  disabled?: boolean;
  hideOutLinkIcon?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const isHashLink = href.startsWith("#");
  const isExternalLink = href.startsWith("http");

  let iconSize = "h-5 w-5";
  // match text size
  if (className?.includes("text-xs")) {
    iconSize = "h-4 w-4";
  } else if (className?.includes("text-sm")) {
    iconSize = "h-4 w-4";
  } else if (className?.includes("text-md")) {
    iconSize = "h-5 w-5";
  } else if (className?.includes("text-lg")) {
    iconSize = "h-6 w-6";
  } else if (className?.includes("text-xl")) {
    iconSize = "h-8 w-8";
  }

  return (
    <a
      href={href}
      className={twMerge(
        "relative transition-colors group text-base text-zinc-400 hover:text-zinc-100",
        disabled ? "pointer-events-none" : "",
        className
      )}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      {...props}
    >
      <span className="inline-flex items-center">
        <span>{children}</span>
        {isExternalLink && !hideOutLinkIcon && <Icon name="arrowUpRight" className={iconSize} />}
      </span>

      {/* custom underline */}
      <span className="absolute top-full left-0 w-full h-0.5 bg-transparent group-hover:bg-current transition-colors"></span>
    </a>
  );
}
