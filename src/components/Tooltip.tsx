// tooltip.tsx (or wherever you define CustomTooltip)
import { useState, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { twMerge } from "tailwind-merge";

interface CustomTooltipProps {
  preview: ReactNode;
  hoverText: string;
  hoverTextCustomClass?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({

  preview,
  hoverText,
  hoverTextCustomClass
}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delay={200}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        {/* asChild lets you pass a child element as the trigger */}
        <TooltipTrigger asChild onClick={() => setIsOpen(!isOpen)}>{preview}</TooltipTrigger>
        <TooltipContent className={twMerge("bg-white opacity-80 rounded text-lg  text-black", hoverTextCustomClass)}>
          <p>{hoverText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
