import type { Editor } from "@tiptap/react";
import { Separator } from "@/Components/ui/separator";
import {
  TooltipProvider,
} from "../ui/tooltip";
import { topbarTools } from "@/utils/editor/tools/t-tool";

interface EditorToolbarProps {
  editor: Editor | null;
}
export function EditorToolbar({ editor }: EditorToolbarProps) {

  return (
    <div className="border-b px-1 py-2 sticky top-0 bg-white z-10 flex flex-wrap justify-center gap-1">
      <TooltipProvider>
        {topbarTools({editor}).map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center">
            {group.id === 'separator' ? (
              <Separator orientation="vertical" className="mx-1 h-6" />
            ) : (
              <div className="flex items-center gap-0.5">
                {group.items?.map((item, itemIndex) => (
                  <div key={`${groupIndex}-${itemIndex}`}>
                    {item.render}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}
