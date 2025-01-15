// // tooltip.tsx (or wherever you define CustomTooltip)
// import { type ReactNode } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// interface CustomTooltipProps {
//   preview: ReactNode;
//   hoverText: string;
// }

// export const CustomTooltip: React.FC<CustomTooltipProps> = ({
//   preview,
//   hoverText,
// }) => {
//   return (
//     <TooltipProvider delay={200}>
//       <Tooltip>
//         {/* asChild lets you pass a child element as the trigger */}
//         <TooltipTrigger asChild>{preview}</TooltipTrigger>
//         <TooltipContent className="bg-white opacity-80 rounded text-lg text-black">
//           <p>{hoverText}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// };
