/* eslint-disable @typescript-eslint/no-explicit-any */
const iconWidth = 'w-40';
const iconHeight = 'h-40';
const iconSize = `${iconWidth} ${iconHeight}`;

import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { Toggle } from "@/Components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { memo, forwardRef } from "react";
import { capitalized } from "../../utils/capitalized";
import getIcon from "../../utils/iconConverter";

export const BubbleTools = memo(forwardRef<HTMLButtonElement, any>(({ editor, tool }, ref) => {
    return tool.isWrapper ? (
        <Tooltip>
            <Popover>
                <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                        <Toggle ref={ref} size={tool.size} pressed={editor.isActive(tool.name)} aria-label={tool.label}>
                            {getIcon(tool.icon,iconSize)}
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
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    ref={ref}
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
}));