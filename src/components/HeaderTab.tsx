import { twMerge } from "tailwind-merge";

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
  return (
    <a
      href={href}
      className={twMerge(
        "text-white text-center flex-1 py-2 px-1 text-sm transition-colors rounded-full truncate",
        active ? "bg-orange-600 hover:bg-orange-700 font-medium" : "bg-transparent hover:bg-zinc-800",
        className
      )}
    >
      {title}
    </a>
  );
}
