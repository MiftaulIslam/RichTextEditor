
import { BubbleMenu, type Editor } from "@tiptap/react"

import {  TooltipProvider,  } from "@/Components/ui/tooltip"
import { BubbleTools } from "@/Components/editor/bubble-tools"
import { Button } from "@/Components/ui/button"
import { Tools } from "@/utils/editor/tools/b-tool"

interface BubbleToolbarProps {
  editor: Editor
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {


  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center bg-white p-1 rounded-md shadow-md border"
    >
      <TooltipProvider>

      
        {Tools( {editor} ).map((tool) => (
          <Button key={tool.name} asChild>
            <BubbleTools  tool={tool} editor={editor} />
          </Button>
        ))}
      


      </TooltipProvider>
    </BubbleMenu>
  )
}
