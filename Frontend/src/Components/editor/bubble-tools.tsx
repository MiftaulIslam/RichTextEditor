/* eslint-disable @typescript-eslint/no-explicit-any */
const iconWidth = 'w-4';
const iconHeight = 'h-4';
const iconSize = `${iconWidth} ${iconHeight}`; // Correct way

import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";

import { memo  } from "react";
import { capitalized } from "../../utils/capitalized";
import getIcon from "../../utils/editor/iconConverter";


export const BubbleTools = memo(({ editor, tool, identifier }: any) => {

    return tool.isWrapper ? (
            
                 <Tooltip key={identifier}>
                 <Popover>
                     <PopoverTrigger asChild>
                         <TooltipTrigger asChild>
                             <Toggle size={tool.size} pressed={editor.isActive(tool.name)} aria-label={tool.label}>
                                 {getIcon(tool.icon, iconSize)}
                             </Toggle>
                         </TooltipTrigger>

                     </PopoverTrigger>
                     
                     <TooltipContent>
                             <p>{capitalized(tool.name)}</p>
                         </TooltipContent>
                     <PopoverContent className="w-80 p-3">
                         {
                             tool?.content
                         }
                     </PopoverContent>
                 </Popover>
             </Tooltip>
            ) : (
                <Tooltip key={identifier}>
                <TooltipTrigger asChild>
                    <Toggle
                        size={tool.size}
                        pressed={editor.isActive(tool.name)}
                        onPressedChange={tool.action}
                        aria-label={tool.label}
                    >
                        {getIcon(tool.icon, iconSize)}
                    </Toggle>
                </TooltipTrigger>

                <TooltipContent>
                    <p>{capitalized(tool.name)}</p>
                </TooltipContent>
            </Tooltip>
            )
})